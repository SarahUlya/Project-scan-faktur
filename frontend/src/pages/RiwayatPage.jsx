import React, { useState, useMemo, useEffect } from "react";
import { Box, Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Select, MenuItem, Pagination, Typography } from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import TagIcon from "@mui/icons-material/Tag";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorefrontIcon from "@mui/icons-material/Storefront";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Custom Hooks & Modular Components
import useTransaksiDb from "../hooks/useTransaksiDb";
import DetailTransaksiModal from "../components/riwayat/DetailTransaksiModal";
import CancelTransactionConfirmModal from "../components/riwayat/CancelTransactionConfirmModal";
import ShiftDetailModal from "../components/riwayat/ShiftDetailModal";
import RiwayatLoadingSkeleton from "../components/riwayat/RiwayatLoadingSkeleton";
import RiwayatHeader from "../components/riwayat/RiwayatHeader";
import RiwayatSummaryCards from "../components/riwayat/RiwayatSummaryCards";
import RiwayatFilterCollapse from "../components/riwayat/RiwayatFilterCollapse";
import { formatRupiahPos } from "../utils/posCalculations";

// ══════════════════════════════════════════════════════════════════
// HELPER — cek status transaksi dianggap "lunas/selesai"
// ══════════════════════════════════════════════════════════════════
const isStatusLunas = (status) => {
  const s = String(status || "").toUpperCase();
  return (
    s.includes("LUNAS") ||
    s.includes("SELESAI") ||
    s.includes("SUCCESS") ||
    s.includes("PAID")
  );
};

// ══════════════════════════════════════════════════════════════════
// HELPER — cek status transaksi dianggap "dibatalkan"
// ══════════════════════════════════════════════════════════════════
const isStatusDibatalkan = (status) => {
  const s = String(status || "").toUpperCase();
  return s.includes("BATAL") || s.includes("CANCEL") || s.includes("VOID");
};

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

  // ── List transaksi terfilter + tersortir ────────────────────────
  const filteredAndSortedList = useMemo(() => {
    let result = [...transaksiList];

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter(
        (t) => new Date(t.tanggal_transaksi || t.created_at) >= start
      );
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(
        (t) => new Date(t.tanggal_transaksi || t.created_at) <= end
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((row) => {
        const idMatch = String(row.no_transaksi || "")
          .toLowerCase()
          .includes(searchLower);
        const kasirMatch = String(row.user?.nama || row.kasir?.nama || "")
          .toLowerCase()
          .includes(searchLower);
        return idMatch || kasirMatch;
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.tanggal_transaksi || a.created_at);
      const dateB = new Date(b.tanggal_transaksi || b.created_at);
      return sortOrder === "terbaru" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [transaksiList, search, sortOrder, startDate, endDate]);

  // ══════════════════════════════════════════════════════════════════
  // RINGKASAN KARTU — filter "Hari Ini" (atau filter tanggal aktif)
  // ══════════════════════════════════════════════════════════════════
  const isFilterActive = Boolean(startDate || endDate);
  const targetDateString = new Date().toISOString().split("T")[0];

  const todayList = useMemo(() => {
    return filteredAndSortedList.filter((t) => {
      if (isFilterActive) return true;

      const tgl = t.tanggal_transaksi || t.created_at;
      if (!tgl) return false;
      const txDate = new Date(tgl).toISOString().split("T")[0];
      return txDate === targetDateString;
    });
  }, [filteredAndSortedList, isFilterActive, targetDateString]);

  const totalTransaksiDitampilkan = todayList.length;

  const omzetDitampilkan = useMemo(() => {
    return todayList
      .filter((t) => isStatusLunas(t.status))
      .reduce((acc, curr) => acc + Number(curr.total || curr.total_bayar || 0), 0);
  }, [todayList]);

  const transaksiDibatalkan = useMemo(() => {
    return todayList.filter((t) => isStatusDibatalkan(t.status)).length;
  }, [todayList]);

  // ══════════════════════════════════════════════════════════════════
  // IDE 3 — REKAP HARIAN (group by tanggal)
  // ══════════════════════════════════════════════════════════════════
  const dailyList = useMemo(() => {
    const days = {};

    filteredAndSortedList.forEach((t) => {
      const tgl = t.tanggal_transaksi || t.created_at;
      if (!tgl) return;

      const dateKey = new Date(tgl).toISOString().split("T")[0]; // "2026-09-03"

      if (!days[dateKey]) {
        days[dateKey] = {
          id: dateKey,
          tanggal: dateKey,
          kasirCounter: {},
          kasir: "Admin Utama",
          totalTransaksi: 0,
          omzet: 0,
          dibatalkan: 0,
        };
      }

      const day = days[dateKey];
      day.totalTransaksi += 1;

      const namaKasir = t.user?.nama || t.kasir?.nama || "Admin Utama";
      day.kasirCounter[namaKasir] = (day.kasirCounter[namaKasir] || 0) + 1;

      if (isStatusLunas(t.status)) {
        day.omzet += Number(t.total || t.total_bayar || 0);
      }
      if (isStatusDibatalkan(t.status)) {
        day.dibatalkan += 1;
      }
    });

    // Ambil kasir paling sering per hari
    Object.values(days).forEach((day) => {
      const sorted = Object.entries(day.kasirCounter).sort(
        (a, b) => b[1] - a[1]
      );
      if (sorted.length > 0) day.kasir = sorted[0][0];
    });

    // Sort terbaru dulu
    return Object.values(days).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [filteredAndSortedList]);

  // ══════════════════════════════════════════════════════════════════
  // IDE 1 + 4 — BUKU SHIFT (group by shift, dengan "Tanpa Shift" rapi)
  // ══════════════════════════════════════════════════════════════════
  const shiftList = useMemo(() => {
    const shifts = {};

    filteredAndSortedList.forEach((t) => {
      const shiftId = t.id_shift ?? t.shift_id ?? null;
      const groupKey = shiftId != null ? String(shiftId) : "__NO_SHIFT__";

      if (!shifts[groupKey]) {
        shifts[groupKey] = {
          id: shiftId != null ? shiftId : "—",
          isNoShift: shiftId == null,
          kasir: t.user?.nama || t.kasir?.nama || "Admin Utama",
          kasirCounter: {},
          waktuBuka: t.tanggal_transaksi || t.created_at,
          waktuTutup: t.tanggal_transaksi || t.created_at,
          transactions: [],
          totalTransaksi: 0,
          omzet: 0,
        };
      }

      const group = shifts[groupKey];
      group.transactions.push(t);
      group.totalTransaksi += 1;

      const namaKasir = t.user?.nama || t.kasir?.nama || "Admin Utama";
      group.kasirCounter[namaKasir] = (group.kasirCounter[namaKasir] || 0) + 1;

      // ⚡ FIX logika waktu — min buka, max tutup
      const txTime = new Date(t.tanggal_transaksi || t.created_at).getTime();
      const currentBuka = new Date(group.waktuBuka).getTime();
      const currentTutup = new Date(group.waktuTutup).getTime();

      if (txTime < currentBuka) {
        group.waktuBuka = t.tanggal_transaksi || t.created_at;
      }
      if (txTime > currentTutup) {
        group.waktuTutup = t.tanggal_transaksi || t.created_at;
      }

      if (isStatusLunas(t.status)) {
        group.omzet += Number(t.total || t.total_bayar || 0);
      }
    });

    // Kasir = paling sering muncul
    Object.values(shifts).forEach((group) => {
      const sorted = Object.entries(group.kasirCounter).sort(
        (a, b) => b[1] - a[1]
      );
      if (sorted.length > 0) group.kasir = sorted[0][0];
    });

    // Sort: shift asli dulu, "Tanpa Shift" di akhir
    return Object.values(shifts).sort((a, b) => {
      if (a.isNoShift && !b.isNoShift) return 1;
      if (!a.isNoShift && b.isNoShift) return -1;
      // Sesama shift asli → sort by id descending
      return String(b.id).localeCompare(String(a.id));
    });
  }, [filteredAndSortedList]);

  // ── Pilih data sesuai tab ───────────────────────────────────────
  const currentDataList =
    tabValue === 0
      ? filteredAndSortedList
      : tabValue === 1
      ? dailyList
      : shiftList;

  const totalItems = currentDataList.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedList = currentDataList.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, tabValue, sortOrder, startDate, endDate]);

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

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(
      `<html><body style="font-family: sans-serif; padding: 20px;"><h2>Laporan</h2><script>window.onload = () => { window.print(); window.close(); }</script></body></html>`
    );
    printWindow.document.close();
  };

  // Klik tanggal di Rekap Harian → set filter ke tanggal itu, pindah ke Semua Transaksi
  const handleViewDailyDetail = (dateKey) => {
    setStartDate(dateKey);
    setEndDate(dateKey);
    setTabValue(0);
  };

  const renderStatus = (status) => {
    const s = String(status).toUpperCase();
    if (isStatusLunas(s))
      return (
        <Chip
          label="LUNAS"
          sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 800, height: 24, fontSize: 11 }}
        />
      );
    if (s.includes("MENUNGGU"))
      return (
        <Chip
          label="MENUNGGU"
          sx={{ bgcolor: "#FFF8E1", color: "#F57F17", fontWeight: 800, height: 24, fontSize: 11 }}
        />
      );
    if (s.includes("RETUR"))
      return (
        <Chip
          label="RETUR"
          sx={{ bgcolor: "#FFEBEE", color: "#C62828", fontWeight: 800, height: 24, fontSize: 11 }}
        />
      );
    if (isStatusDibatalkan(s))
      return (
        <Chip
          label="DIBATALKAN"
          sx={{ bgcolor: "#F1F5F9", color: "#64748B", fontWeight: 800, height: 24, fontSize: 11 }}
        />
      );
    return (
      <Chip
        label={s || "-"}
        sx={{ height: 24, fontSize: 11, fontWeight: 800, bgcolor: "#F1F5F9", color: "#64748B" }}
      />
    );
  };

  // ── Header tabel per tab ────────────────────────────────────────
  const renderTableHead = () => {
    if (tabValue === 0) {
      return (
        <TableRow>
          {["ID TRANSAKSI", "TANGGAL & WAKTU", "NAMA KASIR", "TOTAL TRANSAKSI", "STATUS", "AKSI"].map((h, i) => (
            <TableCell key={i} sx={{ color: "#FFF", fontWeight: 800, fontSize: 12 }}>
              {h}
            </TableCell>
          ))}
        </TableRow>
      );
    }
    if (tabValue === 1) {
      return (
        <TableRow>
          {["TANGGAL", "JUMLAH TRX", "OMZET", "DIBATALKAN", "KASIR", "AKSI"].map((h, i) => (
            <TableCell key={i} sx={{ color: "#FFF", fontWeight: 800, fontSize: 12 }}>
              {h}
            </TableCell>
          ))}
        </TableRow>
      );
    }
    return (
      <TableRow>
        {["ID SHIFT", "PERIODE", "NAMA KASIR", "TOTAL TRX", "OMZET SHIFT", "AKSI"].map((h, i) => (
          <TableCell key={i} sx={{ color: "#FFF", fontWeight: 800, fontSize: 12 }}>
            {h}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  // ── Render baris per tab ────────────────────────────────────────
  const renderRow = (row) => {
    // ═══ TAB 0: Semua Transaksi ═══════════════════════════════════
    if (tabValue === 0) {
      return (
        <>
          <TableCell>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TagIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{row.no_transaksi}</Typography>
            </Box>
          </TableCell>
          <TableCell>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <EventNoteIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {new Date(row.tanggal_transaksi || row.created_at).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <PersonOutlineIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                {row.user?.nama || row.kasir?.nama || "Admin Utama"}
              </Typography>
            </Box>
          </TableCell>
          <TableCell sx={{ fontWeight: 800, fontSize: 14 }}>
            Rp {formatRupiahPos(row.total || row.total_bayar)}
          </TableCell>
          <TableCell>{renderStatus(row.status)}</TableCell>
          <TableCell>
            <Button
              size="small"
              onClick={() => setSelectedTx(row.id_transaksi || row.id)}
              sx={{ color: "#D81B60", fontWeight: 800, fontSize: 12, bgcolor: "#FFF0F5", px: 1.5 }}
            >
              <RemoveRedEyeIcon sx={{ fontSize: 16 }} /> Detail
            </Button>
          </TableCell>
        </>
      );
    }

    // ═══ TAB 1: Rekap Harian ══════════════════════════════════════
    if (tabValue === 1) {
      return (
        <>
          <TableCell>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <CalendarMonthIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                {new Date(row.tanggal).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>
            {row.totalTransaksi} Transaksi
          </TableCell>
          <TableCell sx={{ fontWeight: 800, color: "#10B981", fontSize: 14 }}>
            Rp {formatRupiahPos(row.omzet)}
          </TableCell>
          <TableCell>
            {row.dibatalkan > 0 ? (
              <Chip
                label={`${row.dibatalkan} Dibatalkan`}
                size="small"
                sx={{
                  bgcolor: "#FEF2F2",
                  color: "#DC2626",
                  fontWeight: 700,
                  fontSize: 11,
                  height: 22,
                }}
              />
            ) : (
              <Typography sx={{ fontSize: 13, color: "#94A3B8" }}>—</Typography>
            )}
          </TableCell>
          <TableCell>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <PersonOutlineIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{row.kasir}</Typography>
            </Box>
          </TableCell>
          <TableCell>
            <Button
              size="small"
              onClick={() => handleViewDailyDetail(row.tanggal)}
              sx={{ color: "#3B82F6", fontWeight: 800, fontSize: 12, bgcolor: "#EFF6FF", px: 1.5 }}
            >
              <RemoveRedEyeIcon sx={{ fontSize: 16 }} /> Lihat Detail
            </Button>
          </TableCell>
        </>
      );
    }

    // ═══ TAB 2: Buku Shift ════════════════════════════════════════
    return (
      <>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <AssignmentIndIcon
              sx={{ fontSize: 16, color: row.isNoShift ? "#CBD5E1" : "#94A3B8" }}
            />
            {row.isNoShift ? (
              <Chip
                label="Tanpa Shift"
                size="small"
                sx={{
                  bgcolor: "#F1F5F9",
                  color: "#64748B",
                  fontWeight: 700,
                  fontSize: 11,
                  height: 22,
                }}
              />
            ) : (
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>#{row.id}</Typography>
            )}
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              {new Date(row.waktuBuka).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
              })}{" "}
              {new Date(row.waktuBuka).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" — "}
              {new Date(row.waktuTutup).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
              })}{" "}
              {new Date(row.waktuTutup).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <PersonOutlineIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{row.kasir}</Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>
          {row.totalTransaksi} Transaksi
        </TableCell>
        <TableCell sx={{ fontWeight: 800, color: "#10B981", fontSize: 14 }}>
          Rp {formatRupiahPos(row.omzet)}
        </TableCell>
        <TableCell>
          <Button
            size="small"
            onClick={() => setSelectedShift(row)}
            disabled={row.isNoShift}
            sx={{
              color: row.isNoShift ? "#94A3B8" : "#3B82F6",
              fontWeight: 800,
              fontSize: 12,
              bgcolor: row.isNoShift ? "#F8FAFC" : "#EFF6FF",
              px: 1.5,
              "&.Mui-disabled": { color: "#94A3B8", bgcolor: "#F8FAFC" },
            }}
          >
            <StorefrontIcon sx={{ fontSize: 16 }} /> Lihat Sesi
          </Button>
        </TableCell>
      </>
    );
  };

  // Placeholder search per tab
  const searchPlaceholder =
    tabValue === 0
      ? "Cari ID atau Kasir..."
      : tabValue === 1
      ? "Cari tanggal atau kasir..."
      : "Cari Shift atau Kasir...";

  if (loading && transaksiList.length === 0) return <RiwayatLoadingSkeleton />;

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <RiwayatHeader
        showFilter={showFilter}
        onToggleFilter={() => setShowFilter(!showFilter)}
        onExportPDF={handleExportPDF}
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

      <Paper
        elevation={0}
        sx={{ borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden", bgcolor: "transparent" }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, pt: 1, bgcolor: "#FFFFFF" }}>
          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            TabIndicatorProps={{ style: { backgroundColor: "#D81B60", height: 3 } }}
          >
            <Tab
              label="Semua Transaksi"
              sx={{
                textTransform: "none",
                fontWeight: 800,
                color: tabValue === 0 ? "#D81B60 !important" : "#64748B",
              }}
            />
            <Tab
              label="Rekap Harian"
              sx={{
                textTransform: "none",
                fontWeight: 800,
                color: tabValue === 1 ? "#D81B60 !important" : "#64748B",
              }}
            />
            <Tab
              label="Buku Shift"
              sx={{
                textTransform: "none",
                fontWeight: 800,
                color: tabValue === 2 ? "#D81B60 !important" : "#64748B",
              }}
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#FFFFFF" }}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 0.5,
              bgcolor: "#F8FAFC",
              borderRadius: "8px",
              width: 340,
              border: "1px solid #E2E8F0",
            }}
          >
            <SearchIcon sx={{ color: "#94A3B8", fontSize: 20, mr: 1 }} />
            <InputBase
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, fontSize: 13, fontWeight: 600 }}
            />
          </Paper>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
            sx={{ fontSize: 13, fontWeight: 700, bgcolor: "#FFFFFF" }}
          >
            <MenuItem value="terbaru">Terbaru</MenuItem>
            <MenuItem value="terlama">Terlama</MenuItem>
          </Select>
        </Box>

        <TableContainer sx={{ bgcolor: "#FFFFFF" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#D81B60" }}>{renderTableHead()}</TableHead>
            <TableBody>
              {paginatedList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontWeight: 700, color: "#94A3B8" }}>
                      Tidak ada data ditemukan.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedList.map((row) => (
                  <TableRow key={row.id || row.no_transaksi || row.id_transaksi} hover>
                    {renderRow(row)}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalItems > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderTop: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>
              Menampilkan {startIndex + 1} - {Math.min(startIndex + rowsPerPage, totalItems)} dari {totalItems} data
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              sx={{ "& .Mui-selected": { bgcolor: "#D81B60 !important", color: "#FFF" } }}
            />
          </Box>
        )}
      </Paper>

      {/* Modal */}
      <ShiftDetailModal open={Boolean(selectedShift)} shift={selectedShift} onClose={() => setSelectedShift(null)} />
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