import React, { useState, useMemo, useEffect } from "react";
import {
  Box, Paper, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Select, MenuItem,
  Pagination, Typography, CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import useTransaksiDb from "../hooks/useTransaksiDb";
import useShiftList from "../hooks/useShiftList";
import DetailTransaksiModal from "../components/riwayat/DetailTransaksiModal";
import CancelTransactionConfirmModal from "../components/riwayat/CancelTransactionConfirmModal";
import ShiftDetailModal from "../components/riwayat/ShiftDetailModal";
import RiwayatLoadingSkeleton from "../components/riwayat/RiwayatLoadingSkeleton";
import RiwayatHeader from "../components/riwayat/RiwayatHeader";
import RiwayatSummaryCards from "../components/riwayat/RiwayatSummaryCards";
import RiwayatFilterCollapse from "../components/riwayat/RiwayatFilterCollapse";
import { TransaksiRow, RekapRow, ShiftRow } from "../components/riwayat/table";
import ExportPrintMenu from "../components/ui/ExportPrintMenu";

import { formatRupiahPos } from "../utils/posCalculations";
import { isStatusLunas, isStatusDibatalkan } from "../utils/statusHelpers";
import { applyTransaksiFilters } from "../utils/riwayatFilters";
import { buildDailyRekap } from "../utils/rekapBuilder";
import {
  exportReportExcel,
  exportReportCsv,
  exportReportPdf,
} from "../utils/export/reportExport";

import {
  colors, radii, spacing, typography,
  shadows, transitions, fieldInputSx,
} from "@/theme/designTokens";

/* ══════════════════════════════════════════════════════════════════
 * HELPER
 * ══════════════════════════════════════════════════════════════════ */
const formatTanggalWaktu = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTanggal = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/* ══════════════════════════════════════════════════════════════════
 * SHARED SX
 * ══════════════════════════════════════════════════════════════════ */
const cardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.borderLight}`,
  bgcolor: colors.bgCard,
  boxShadow: shadows.card,
  overflow: "hidden",
};

const headCellSx = {
  color: colors.textOnDark,
  fontWeight: typography.bold,
  fontSize: typography.small,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  borderBottom: "none",
  py: spacing.md,
};

/* ══════════════════════════════════════════════════════════════════
 * PAGE
 * ══════════════════════════════════════════════════════════════════ */
const RiwayatPage = () => {
  const { transaksiList, loading, reloadTransaksi, batalkan } = useTransaksiDb();

  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("terbaru");

  const [selectedTx, setSelectedTx] = useState(null);
  const [cancelTxId, setCancelTxId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  /* ══ FILTER + SORT ══ */
  const filteredAndSortedList = useMemo(
    () =>
      applyTransaksiFilters(transaksiList, {
        startDate,
        endDate,
        search,
        sortOrder,
      }),
    [transaksiList, startDate, endDate, search, sortOrder]
  );

  /* ══ RINGKASAN ══ */
  const isFilterActive = Boolean(startDate || endDate);
  const targetDateString = new Date().toISOString().split("T")[0];

  const todayList = useMemo(() => {
    return filteredAndSortedList.filter((t) => {
      if (isFilterActive) return true;
      const tgl = t.tanggal_transaksi || t.created_at;
      if (!tgl) return false;
      return new Date(tgl).toISOString().split("T")[0] === targetDateString;
    });
  }, [filteredAndSortedList, isFilterActive, targetDateString]);

  const totalTransaksiDitampilkan = todayList.length;

  const omzetDitampilkan = useMemo(
    () =>
      todayList
        .filter((t) => isStatusLunas(t.status))
        .reduce((acc, c) => acc + Number(c.total || c.total_bayar || 0), 0),
    [todayList]
  );

  const transaksiDibatalkan = useMemo(
    () => todayList.filter((t) => isStatusDibatalkan(t.status)).length,
    [todayList]
  );

  /* ══ REKAP HARIAN ══ */
  const dailyList = useMemo(
    () => buildDailyRekap(filteredAndSortedList),
    [filteredAndSortedList]
  );

  /* ══ SHIFT LIST ══ */
  const {
    shiftList: shiftListDb,
    loading: shiftLoading,
    error: shiftError,
  } = useShiftList({ startDate, endDate });

  const filteredShiftList = useMemo(() => {
    let result = [...shiftListDb];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => {
        const idMatch = String(s.id_shift || "").includes(q);
        const kasirMatch = String(s.nama_kasir || "").toLowerCase().includes(q);
        return idMatch || kasirMatch;
      });
    }

    result.sort((a, b) => {
      const dA = new Date(a.waktu_buka || 0).getTime();
      const dB = new Date(b.waktu_buka || 0).getTime();
      return sortOrder === "terbaru" ? dB - dA : dA - dB;
    });

    return result;
  }, [shiftListDb, search, sortOrder]);

  /* ══ PAGINATION ══ */
  const currentDataList =
    tabValue === 0
      ? filteredAndSortedList
      : tabValue === 1
      ? dailyList
      : filteredShiftList;

  const totalItems = currentDataList.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedList = currentDataList.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, tabValue, sortOrder, startDate, endDate]);

  /* ══════════════════════════════════════════════════════════════════
   * ⚡ BUILD EXPORT PAYLOAD — sesuai tab
   * ══════════════════════════════════════════════════════════════════ */
  const buildExportPayload = () => {
    const meta = [
      ["Tanggal Cetak", new Date().toLocaleString("id-ID")],
      ["Periode", startDate && endDate ? `${startDate} — ${endDate}` : "Semua periode"],
      ["Pencarian", search || "—"],
    ];

    /* ── TAB 0 ──────────────────────────────────────────────── */
    if (tabValue === 0) {
      const totalOmzet = filteredAndSortedList
        .filter((t) => isStatusLunas(t.status))
        .reduce((a, c) => a + Number(c.total || c.total_bayar || 0), 0);

      return {
        title: "LAPORAN TRANSAKSI",
        subtitle: "Semua Transaksi",
        meta,
        summary: [
          ["Total Transaksi", filteredAndSortedList.length],
          ["Total Omzet", `Rp ${formatRupiahPos(totalOmzet)}`],
        ],
        headers: ["No", "No. Transaksi", "Tanggal", "Kasir", "Total", "Status"],
        rows: filteredAndSortedList.map((t, i) => [
          i + 1,
          t.no_transaksi || "-",
          formatTanggalWaktu(t.tanggal_transaksi || t.created_at),
          t.user?.nama || t.kasir?.nama || "-",
          Number(t.total || t.total_bayar || 0),
          t.status || "-",
        ]),
        columnStyles: {
          0: { halign: "center", cellWidth: 12 },
          1: { halign: "left" },
          2: { halign: "center", cellWidth: 38 },
          3: { halign: "left" },
          4: { halign: "right", cellWidth: 26 },
          5: { halign: "center", cellWidth: 24 },
        },
        filename: `Riwayat_Transaksi_${new Date().toISOString().slice(0, 10)}`,
      };
    }

    /* ── TAB 1 ──────────────────────────────────────────────── */
    if (tabValue === 1) {
      const grandOmzet = dailyList.reduce((a, c) => a + Number(c.omzet), 0);
      const grandTrx = dailyList.reduce((a, c) => a + c.totalTransaksi, 0);

      return {
        title: "REKAP HARIAN",
        subtitle: "Rekapitulasi Transaksi per Hari",
        meta,
        summary: [
          ["Total Hari", dailyList.length],
          ["Total Transaksi", grandTrx],
          ["Total Omzet", `Rp ${formatRupiahPos(grandOmzet)}`],
        ],
        headers: ["No", "Tanggal", "Jumlah Trx", "Omzet", "Dibatalkan", "Kasir"],
        rows: dailyList.map((d, i) => [
          i + 1,
          formatTanggal(d.tanggal),
          d.totalTransaksi,
          Number(d.omzet),
          d.dibatalkan,
          d.kasir,
        ]),
        columnStyles: {
          0: { halign: "center", cellWidth: 12 },
          1: { halign: "left", cellWidth: 55 },
          2: { halign: "center", cellWidth: 24 },
          3: { halign: "right", cellWidth: 32 },
          4: { halign: "center", cellWidth: 26 },
          5: { halign: "left" },
        },
        filename: `Rekap_Harian_${new Date().toISOString().slice(0, 10)}`,
      };
    }

    /* ── TAB 2 ──────────────────────────────────────────────── */
    const totalOmzetShift = filteredShiftList.reduce(
      (a, c) => a + Number(c.total_omzet ?? 0),
      0
    );

    return {
      title: "BUKU SHIFT",
      subtitle: "Riwayat Sesi Kasir",
      meta,
      summary: [
        ["Total Shift", filteredShiftList.length],
        ["Total Omzet", `Rp ${formatRupiahPos(totalOmzetShift)}`],
      ],
      headers: ["No", "ID Shift", "Status", "Buka", "Tutup", "Kasir", "Trx", "Omzet"],
      rows: filteredShiftList.map((s, i) => [
        i + 1,
        `#${s.id_shift}`,
        s.status,
        formatTanggalWaktu(s.waktu_buka),
        s.waktu_tutup ? formatTanggalWaktu(s.waktu_tutup) : "—",
        s.nama_kasir || "-",
        s.total_transaksi ?? 0,
        Number(s.total_omzet ?? 0),
      ]),
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { halign: "center", cellWidth: 18 },
        2: { halign: "center", cellWidth: 18 },
        3: { halign: "center", cellWidth: 32 },
        4: { halign: "center", cellWidth: 32 },
        5: { halign: "left" },
        6: { halign: "right", cellWidth: 16 },
        7: { halign: "right", cellWidth: 28 },
      },
      filename: `Buku_Shift_${new Date().toISOString().slice(0, 10)}`,
    };
  };

  /* ══════════════════════════════════════════════════════════════════
   * ⚡ HANDLERS EXPORT & PRINT
   * ══════════════════════════════════════════════════════════════════ */

  // Print → preview PDF di tab baru
  const handlePrint = () => {
    const payload = buildExportPayload();
    exportReportPdf(payload, {
      filename: `${payload.filename}.pdf`,
      previewInNewTab: true, // ⚡ buka di tab baru
    });
  };

  // Export PDF → download file
  const handleExportPDF = () => {
    const payload = buildExportPayload();
    exportReportPdf(payload, { filename: `${payload.filename}.pdf` });
  };

  // Export Excel → download .xlsx
  const handleExportExcel = () => {
    const payload = buildExportPayload();
    exportReportExcel(payload, { filename: `${payload.filename}.xlsx` });
  };

  // Export CSV → download .csv
  const handleExportCSV = () => {
    const payload = buildExportPayload();
    exportReportCsv(payload, { filename: `${payload.filename}.csv` });
  };

  /* ══ HANDLERS ══ */
  const handlePageChange = (event, value) => setPage(value);

  const handleConfirmCancel = async () => {
    if (!cancelTxId) return;
    setActionLoading(true);
    try {
      await batalkan(cancelTxId);
      setCancelTxId(null);
      reloadTransaksi();
      alert("Transaksi berhasil dibatalkan.");
    } catch (err) {
      alert(err.message || "Gagal membatalkan transaksi.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDailyDetail = (dateKey) => {
    setStartDate(dateKey);
    setEndDate(dateKey);
    setTabValue(0);
  };

  /* ══ TABLE HEAD ══ */
  const renderTableHead = () => {
    const heads =
      tabValue === 0
        ? ["ID TRANSAKSI", "TANGGAL & WAKTU", "NAMA KASIR", "TOTAL TRANSAKSI", "STATUS", "AKSI"]
        : tabValue === 1
        ? ["TANGGAL", "JUMLAH TRX", "OMZET", "DIBATALKAN", "KASIR", "AKSI"]
        : ["ID SHIFT", "STATUS", "PERIODE", "KASIR", "TRX", "OMZET", "AKSI"];

    return (
      <TableRow>
        {heads.map((h, i) => (
          <TableCell key={i} sx={headCellSx}>{h}</TableCell>
        ))}
      </TableRow>
    );
  };

  /* ══ ROW RENDERER ══ */
  const renderRow = (row) => {
    if (tabValue === 0) {
      return <TransaksiRow row={row} onDetail={setSelectedTx} />;
    }
    if (tabValue === 1) {
      return <RekapRow row={row} onViewDetail={handleViewDailyDetail} />;
    }
    return <ShiftRow row={row} onViewSession={setSelectedShift} />;
  };

  const searchPlaceholder =
    tabValue === 0
      ? "Cari ID atau Kasir..."
      : tabValue === 1
      ? "Cari tanggal atau kasir..."
      : "Cari ID Shift atau Kasir...";

  if (loading && transaksiList.length === 0) return <RiwayatLoadingSkeleton />;

  const colSpan = tabValue === 2 ? 7 : 6;

  /* ══════════════════════════════════════════════════════════════════
   * RENDER
   * ══════════════════════════════════════════════════════════════════ */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        px: spacing.xxl,
        pt: spacing.xxl,
        pb: spacing.xxl,
        display: "flex",
        flexDirection: "column",
        gap: spacing.xxl,
      }}
    >
      <RiwayatHeader
        showFilter={showFilter}
        onToggleFilter={() => setShowFilter(!showFilter)}
        actions={
          <ExportPrintMenu
            disabled={currentDataList.length === 0}
            onPrint={handlePrint}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onExportCSV={handleExportCSV}
          />
        }
      />
      <RiwayatFilterCollapse
        showFilter={showFilter}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <RiwayatSummaryCards
        isFilterActive={isFilterActive}
        totalTransaksi={totalTransaksiDitampilkan}
        omzet={omzetDitampilkan}
        itemTerjual={transaksiDibatalkan}
      />

      {/* ═══ TABS CARD ═══ */}
      <Paper elevation={0} sx={cardSx}>
        <Box
          sx={{
            borderBottom: `1px solid ${colors.borderLight}`,
            px: spacing.lg,
            pt: 0.5,
            bgcolor: colors.bgCard,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            TabIndicatorProps={{
              style: { backgroundColor: colors.primary, height: 3 },
            }}
          >
            {["Semua Transaksi", "Rekap Harian", "Buku Shift"].map((label, i) => (
              <Tab
                key={i}
                label={label}
                sx={{
                  textTransform: "none",
                  fontWeight: typography.bold,
                  fontSize: typography.body,
                  color: tabValue === i ? `${colors.primary} !important` : colors.textSecondary,
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Search & Sort */}
        <Box
          sx={{
            p: spacing.xl,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: colors.bgCard,
            gap: spacing.lg,
            flexWrap: "wrap",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              px: spacing.lg,
              py: 0.5,
              bgcolor: colors.bgMuted,
              borderRadius: `${radii.s}px`,
              width: 340,
              border: `1px solid ${colors.border}`,
              transition: transitions.fast,
              "&:focus-within": { borderColor: colors.primary },
            }}
          >
            <SearchIcon sx={{ color: colors.textMuted, fontSize: 18, mr: 1 }} />
            <InputBase
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, fontSize: typography.body, fontWeight: typography.semibold }}
            />
          </Paper>

          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
            sx={{
              fontSize: typography.body,
              fontWeight: typography.bold,
              bgcolor: colors.bgCard,
              borderRadius: `${radii.s}px`,
              ...fieldInputSx["& .MuiOutlinedInput-root"],
            }}
          >
            <MenuItem value="terbaru">Terbaru</MenuItem>
            <MenuItem value="terlama">Terlama</MenuItem>
          </Select>
        </Box>

        {/* Table */}
        <TableContainer sx={{ bgcolor: colors.bgCard }}>
          <Table>
            <TableHead sx={{ bgcolor: colors.primary }}>{renderTableHead()}</TableHead>
            <TableBody>
              {tabValue === 2 && shiftLoading ? (
                <TableRow>
                  <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={24} sx={{ color: colors.primary }} />
                    <Typography sx={{ mt: 1, fontSize: typography.body, color: colors.textMuted }}>
                      Memuat data shift...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : tabValue === 2 && shiftError ? (
                <TableRow>
                  <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontWeight: typography.bold, color: colors.danger }}>
                      {shiftError}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontWeight: typography.bold, color: colors.textMuted, fontSize: typography.body }}>
                      Tidak ada data ditemukan.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedList.map((row) => (
                  <TableRow
                    key={
                      tabValue === 2
                        ? `shift-${row.id_shift}`
                        : row.id || row.no_transaksi || row.id_transaksi || row.tanggal
                    }
                    hover
                    sx={{
                      "&:hover": { bgcolor: colors.bgMuted },
                      "& td": {
                        borderBottom: `1px solid ${colors.borderLight}`,
                        py: spacing.md,
                      },
                    }}
                  >
                    {renderRow(row)}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalItems > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: spacing.lg,
              borderTop: `1px solid ${colors.borderLight}`,
              bgcolor: colors.bgCard,
            }}
          >
            <Typography
              sx={{
                fontSize: typography.caption,
                color: colors.textSecondary,
                fontWeight: typography.semibold,
              }}
            >
              Menampilkan {startIndex + 1} - {Math.min(startIndex + rowsPerPage, totalItems)} dari {totalItems} data
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              sx={{
                "& .Mui-selected": {
                  bgcolor: `${colors.primary} !important`,
                  color: colors.textOnDark,
                },
                "& .MuiPaginationItem-root": {
                  borderRadius: `${radii.xs}px`,
                  fontSize: typography.body,
                  fontWeight: typography.semibold,
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* MODALS */}
      <ShiftDetailModal
        open={Boolean(selectedShift)}
        shift={selectedShift}
        onClose={() => setSelectedShift(null)}
      />
      <CancelTransactionConfirmModal
        open={Boolean(cancelTxId)}
        transaksiId={cancelTxId}
        isLoading={actionLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTxId(null)}
      />
      <DetailTransaksiModal
        open={Boolean(selectedTx)}
        transaksiId={selectedTx}
        onClose={() => setSelectedTx(null)}
        onRefresh={reloadTransaksi}
      />
    </Box>
  );
};

export default RiwayatPage;