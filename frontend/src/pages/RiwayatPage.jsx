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

  const filteredAndSortedList = useMemo(() => {
    let result = [...transaksiList];
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter(t => new Date(t.tanggal_transaksi || t.created_at) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.tanggal_transaksi || t.created_at) <= end);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((row) => {
        const idMatch = String(row.no_transaksi || "").toLowerCase().includes(searchLower);
        const kasirMatch = String(row.user?.nama || row.kasir?.nama || "").toLowerCase().includes(searchLower);
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

  const shiftList = useMemo(() => {
    const shifts = {};
    filteredAndSortedList.forEach(t => {
      const shiftId = t.shift_id || t.id_shift || "SHFT-DEFAULT";
      if (!shifts[shiftId]) {
        shifts[shiftId] = {
          id: shiftId,
          kasir: t.user?.nama || t.kasir?.nama || "Admin Utama",
          waktuBuka: t.tanggal_transaksi || t.created_at,
          waktuTutup: t.tanggal_transaksi || t.created_at,
          transactions: [],
          totalTransaksi: 0,
          omzet: 0,
        };
      }
      shifts[shiftId].transactions.push(t);
      shifts[shiftId].totalTransaksi += 1;
      
      const txDate = new Date(t.tanggal_transaksi || t.created_at);
      if (txDate > new Date(shifts[shiftId].waktuTutup)) shifts[shiftId].waktuTutup = t.tanggal_transaksi || t.created_at;
      if (txDate < new Date(shifts[shiftId].waktuBuka)) shifts[shiftId].waktuBuka = t.tanggal_transaksi || t.created_at;

      if (t.status === "LUNAS" || t.status === "SELESAI") {
        shifts[shiftId].omzet += Number(t.total_bayar || t.total || 0);
      }
    });
    return Object.values(shifts);
  }, [filteredAndSortedList]);

  const currentDataList = tabValue === 0 ? filteredAndSortedList : shiftList;
  const totalItems = currentDataList.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedList = currentDataList.slice(startIndex, startIndex + rowsPerPage);

  const isFilterActive = startDate || endDate;
  const targetDateString = new Date().toISOString().split('T')[0];

  const omzetDitampilkan = filteredAndSortedList
    .filter(t => t.status === "LUNAS" || t.status === "SELESAI")
    .filter(t => {
      if (isFilterActive) return true;
      const txDate = new Date(t.tanggal_transaksi || t.created_at).toISOString().split('T')[0];
      return txDate === targetDateString;
    })
    .reduce((acc, curr) => acc + Number(curr.total_bayar || curr.total || 0), 0);
    
  const itemTerjual = filteredAndSortedList
    .filter(t => {
      if (isFilterActive) return true;
      const txDate = new Date(t.tanggal_transaksi || t.created_at).toISOString().split('T')[0];
      return txDate === targetDateString;
    })
    .reduce((acc, curr) => acc + (curr.transaksidetail?.length || curr.items?.length || 1), 0);

  useEffect(() => { setPage(1); }, [search, tabValue, sortOrder, startDate, endDate]);
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
    printWindow.document.write(`<html><body style="font-family: sans-serif; padding: 20px;"><h2>Laporan</h2><script>window.onload = () => { window.print(); window.close(); }</script></body></html>`);
    printWindow.document.close();
  };

  const renderStatus = (status) => {
    const s = String(status).toUpperCase();
    if (s.includes("LUNAS") || s.includes("SELESAI")) return <Chip label="LUNAS" sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 800, height: 24, fontSize: 11 }} />;
    if (s.includes("MENUNGGU")) return <Chip label="MENUNGGU" sx={{ bgcolor: "#FFF8E1", color: "#F57F17", fontWeight: 800, height: 24, fontSize: 11 }} />;
    if (s.includes("RETUR")) return <Chip label="RETUR" sx={{ bgcolor: "#FFEBEE", color: "#C62828", fontWeight: 800, height: 24, fontSize: 11 }} />;
    return <Chip label={s} sx={{ height: 24, fontSize: 11, fontWeight: 800, bgcolor: "#F1F5F9", color: "#64748B" }} />;
  };

  if (loading && transaksiList.length === 0) return <RiwayatLoadingSkeleton />;

  return (
    // Menyamakan background box utama menjadi transparan / mengikuti halaman agar tidak ada kotak terpisah
    <Box sx={{ p: 4, width: "100%" }}>
      <RiwayatHeader showFilter={showFilter} onToggleFilter={() => setShowFilter(!showFilter)} onExportPDF={handleExportPDF} />
      <RiwayatFilterCollapse showFilter={showFilter} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      <RiwayatSummaryCards isFilterActive={isFilterActive} totalTransaksi={filteredAndSortedList.length} omzet={omzetDitampilkan} itemTerjual={itemTerjual} />

      <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden", bgcolor: "transparent" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, pt: 1, bgcolor: "#FFFFFF" }}>
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} TabIndicatorProps={{ style: { backgroundColor: "#D81B60", height: 3 } }}>
            <Tab label="Semua Transaksi" sx={{ textTransform: "none", fontWeight: 800, color: tabValue === 0 ? "#D81B60 !important" : "#64748B" }} />
            <Tab label="Buku Shift" sx={{ textTransform: "none", fontWeight: 800, color: tabValue === 1 ? "#D81B60 !important" : "#64748B" }} />
          </Tabs>
        </Box>

        <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#FFFFFF" }}>
          <Paper elevation={0} sx={{ display: "flex", alignItems: "center", px: 2, py: 0.5, bgcolor: "#F8FAFC", borderRadius: "8px", width: 340, border: "1px solid #E2E8F0" }}>
            <SearchIcon sx={{ color: "#94A3B8", fontSize: 20, mr: 1 }} />
            <InputBase placeholder={tabValue === 0 ? "Cari ID atau Kasir..." : "Cari Shift atau Kasir..."} value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1, fontSize: 13, fontWeight: 600 }} />
          </Paper>
          <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} size="small" sx={{ fontSize: 13, fontWeight: 700, bgcolor: "#FFFFFF" }}>
            <MenuItem value="terbaru">Terbaru</MenuItem>
            <MenuItem value="terlama">Terlama</MenuItem>
          </Select>
        </Box>

        <TableContainer sx={{ bgcolor: "#FFFFFF" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#D81B60" }}>
              {tabValue === 0 ? (
                <TableRow>{["ID TRANSAKSI", "TANGGAL & WAKTU", "NAMA KASIR", "TOTAL TRANSAKSI", "STATUS", "AKSI"].map((h, i) => <TableCell key={i} sx={{ color: "#FFF", fontWeight: 800, fontSize: 12 }}>{h}</TableCell>)}</TableRow>
              ) : (
                <TableRow>{["ID SHIFT", "JAM BUKA & TUTUP", "NAMA KASIR", "TOTAL TRX", "OMZET SHIFT", "AKSI"].map((h, i) => <TableCell key={i} sx={{ color: "#FFF", fontWeight: 800, fontSize: 12 }}>{h}</TableCell>)}</TableRow>
              )}
            </TableHead>
            <TableBody>
              {paginatedList.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><Typography sx={{ fontWeight: 700, color: "#94A3B8" }}>Tidak ada data ditemukan.</Typography></TableCell></TableRow>
              ) : (
                paginatedList.map((row) => (
                  <TableRow key={row.id || row.no_transaksi} hover>
                    {tabValue === 0 ? (
                      <>
                        <TableCell><Box sx={{ display: "flex", gap: 1, alignItems: "center" }}><TagIcon sx={{ fontSize: 16, color: "#94A3B8" }} /><Typography sx={{ fontWeight: 700, fontSize: 13 }}>{row.no_transaksi}</Typography></Box></TableCell>
                        <TableCell><Box sx={{ display: "flex", gap: 1, alignItems: "center" }}><EventNoteIcon sx={{ fontSize: 16, color: "#94A3B8" }} /><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{new Date(row.tanggal_transaksi || row.created_at).toLocaleString("id-ID", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Typography></Box></TableCell>
                        <TableCell><Box sx={{ display: "flex", gap: 1, alignItems: "center" }}><PersonOutlineIcon sx={{ fontSize: 16, color: "#94A3B8" }} /><Typography sx={{ fontSize: 13, fontWeight: 700 }}>{row.user?.nama || row.kasir?.nama || "Admin Utama"}</Typography></Box></TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: 14 }}>Rp {formatRupiahPos(row.total_bayar || row.total)}</TableCell>
                        <TableCell>{renderStatus(row.status)}</TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => setSelectedTx(row.id || row.id_transaksi)} sx={{ color: "#D81B60", fontWeight: 800, fontSize: 12, bgcolor: "#FFF0F5", px: 1.5 }}>
                            <RemoveRedEyeIcon sx={{ fontSize: 16 }} /> Detail
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell><Box sx={{ display: "flex", gap: 1, alignItems: "center" }}><AssignmentIndIcon sx={{ fontSize: 16, color: "#94A3B8" }} /><Typography sx={{ fontWeight: 700, fontSize: 13 }}>{row.id}</Typography></Box></TableCell>
                        <TableCell><Box sx={{ display: "flex", gap: 1, alignItems: "center" }}><AccessTimeIcon sx={{ fontSize: 16, color: "#94A3B8" }} /><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{new Date(row.waktuBuka).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} s/d {new Date(row.waktuTutup).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB</Typography></Box></TableCell>
                        <TableCell><Box sx={{ display: "flex", gap: 1, alignItems: "center" }}><PersonOutlineIcon sx={{ fontSize: 16, color: "#94A3B8" }} /><Typography sx={{ fontSize: 13, fontWeight: 700 }}>{row.kasir}</Typography></Box></TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>{row.totalTransaksi} Transaksi</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "#10B981", fontSize: 14 }}>Rp {formatRupiahPos(row.omzet)}</TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => setSelectedShift(row)} sx={{ color: "#3B82F6", fontWeight: 800, fontSize: 12, bgcolor: "#EFF6FF", px: 1.5 }}>
                            <StorefrontIcon sx={{ fontSize: 16 }} /> Lihat Sesi
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalItems > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderTop: "1px solid #E2E8F0", bgcolor: "#FFFFFF" }}>
            <Typography sx={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>Menampilkan {startIndex + 1} - {Math.min(startIndex + rowsPerPage, totalItems)} dari {totalItems} data</Typography>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} shape="rounded" sx={{ "& .Mui-selected": { bgcolor: "#D81B60 !important", color: "#FFF" } }} />
          </Box>
        )}
      </Paper>

      {/* Komponen Modal */}
      <ShiftDetailModal open={Boolean(selectedShift)} shift={selectedShift} onClose={() => setSelectedShift(null)} />
      <CancelTransactionConfirmModal open={Boolean(cancelTxId)} transaksiId={cancelTxId} isLoading={actionLoading} onConfirm={handleConfirmCancel} onCancel={() => setCancelTxId(null)} />
      <DetailTransaksiModal open={Boolean(selectedTx)} transaksiId={selectedTx} onClose={() => setSelectedTx(null)} onRefresh={reloadTransaksi} />
    </Box>
  );
};

export default RiwayatPage;