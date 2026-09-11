import React, { useState, useEffect, useMemo } from "react";
import { 
  Box, Typography, Button, Paper, TextField, InputAdornment, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Divider, IconButton, MenuItem, CircularProgress 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

import DefectaTable from "../components/defecta/DefectaTable";
import PaginationControls from "../components/ui/PaginationControls";
import { colors, radii, statCardSx, typography } from "@/theme/designTokens";

// Import fungsi dari modular API folder
import { getStokMenipis } from "../api/produkApi";
import { getSupplier } from "../api/supplierApi";
import { createPembelian } from "../api/pembelianApi";

const PAGE_SIZE = 10;

// --- MODAL KONFIRMASI PO ---
const KonfirmasiPoModal = ({ open, onClose, selectedItemsData, suppliersList, onConfirm }) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState("");

  useEffect(() => {
    if (selectedItemsData.length > 0 && suppliersList.length > 0) {
      const firstItemSupplier = selectedItemsData[0]?.supplier;
      const matchedSupplier = suppliersList.find(s => s.nama_supplier === firstItemSupplier);
      setSelectedSupplierId(matchedSupplier ? matchedSupplier.id : (suppliersList[0]?.id || ""));
    }
  }, [selectedItemsData, suppliersList]);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ p: 1, bgcolor: colors.dangerLight, color: colors.danger, borderRadius: 2, display: "flex" }}><DescriptionOutlinedIcon /></Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: colors.text }}>Konfirmasi Buat Purchase Order (PO)</Typography>
            <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>Pembuatan Surat Pesanan resmi terintegrasi sistem defekta cerdas</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, mb: 1 }}>DISTRIBUTOR / PBF TERPILIH</Typography>
            <TextField 
              select 
              size="small" 
              fullWidth 
              value={selectedSupplierId} 
              onChange={(e) => setSelectedSupplierId(e.target.value)}
            >
              {suppliersList.map((sup) => (
                <MenuItem key={sup.id} value={sup.id}>{sup.nama_supplier || sup.nama}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, mb: 1 }}>NOMOR PO (OTOMATIS)</Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField size="small" fullWidth value="PO-2026-DEF-Auto" disabled />
              <Box sx={{ px: 1.5, py: 0.5, bgcolor: colors.successLight, color: colors.success, borderRadius: 1, fontSize: 11, fontWeight: 700, height: 32, display: "flex", alignItems: "center" }}>DRAFT BARU</Box>
            </Box>
          </Box>
        </Box>

        <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1.5, textTransform: "uppercase", color: colors.textMuted }}>
          Rincian Item Defecta ({selectedItemsData.length} Jenis Obat Siap Diorder)
        </Typography>
        <Box sx={{ border: `1px solid ${colors.borderLight}`, borderRadius: 2, overflow: "hidden", mb: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", bgcolor: colors.bgMuted, p: 1.5, fontSize: 11, fontWeight: 700, color: colors.textMuted }}>
            <Box>NAMA OBAT & SKU</Box>
            <Box align="center">STOK SAAT INI</Box>
            <Box align="center">JUMLAH ORDER</Box>
            <Box align="right">HPP SATUAN</Box>
            <Box align="right">SUBTOTAL</Box>
          </Box>
          {selectedItemsData.map((item, idx) => {
            const qtyOrder = item.saran_order || item.min_stock || 10;
            const hppItem = item.hpp || 15000;
            return (
              <Box key={idx} sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", p: 1.5, alignItems: "center", borderTop: `1px solid ${colors.borderLight}`, fontSize: 13 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{item.nama_produk || item.nama}</Typography>
                  <Typography sx={{ fontSize: 11, color: colors.textMuted }}>SKU: {item.sku}</Typography>
                </Box>
                <Box align="center">
                  <Box sx={{ bgcolor: colors.dangerLight, color: colors.danger, px: 1, py: 0.5, borderRadius: 1, fontWeight: 700, display: "inline-block", fontSize: 12 }}>{item.current_stock ?? item.stok_sisa} {item.satuan}</Box>
                </Box>
                <Box align="center">
                  <Box sx={{ bgcolor: colors.primaryLight, color: colors.primary, px: 1, py: 0.5, borderRadius: 1, fontWeight: 700, display: "inline-block", fontSize: 12 }}>{qtyOrder} {item.satuan}</Box>
                </Box>
                <Box align="right" sx={{ fontWeight: 500 }}>Rp {hppItem.toLocaleString("id-ID")}</Box>
                <Box align="right" sx={{ fontWeight: 700 }}>Rp {(qtyOrder * hppItem).toLocaleString("id-ID")}</Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 12, color: colors.textMuted }}>* Item otomatis berpindah ke status 'Menunggu Pengiriman'.</Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" onClick={onClose} sx={{ color: colors.text, borderColor: colors.borderLight }}>Batal</Button>
          <Button variant="contained" color="primary" endIcon={<ArrowForwardIcon />} onClick={() => onConfirm(selectedSupplierId)} sx={{ fontWeight: 700, px: 3 }}>Terbitkan & Tarik ke Faktur</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// --- HALAMAN UTAMA BUKU DEFECTA ---
const BukuDefectaPage = () => {
  const navigate = useNavigate();
  const [defectaData, setDefectaData] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState("semua");

  // State Pagination mengikuti pola ProdukPage
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resDefecta, resSupplier] = await Promise.all([
          getStokMenipis(),
          getSupplier()
        ]);
        setDefectaData(resDefecta || []);
        setSuppliersList(resSupplier.data || resSupplier || []);
      } catch (error) {
        console.error("Gagal mengambil data API Buku Defecta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return defectaData.filter((item) => {
      const name = item.nama_produk || item.nama || "";
      const sku = item.sku || "";
      const supplier = item.supplier || "";
      const matchQuery = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.toLowerCase().includes(searchQuery.toLowerCase());
      
      const currentStock = item.current_stock ?? item.stok_sisa ?? 0;
      const status = item.status || (currentStock === 0 ? "KRITIS" : "WASPADA");
      
      if (activeTabFilter === "kritis") return matchQuery && status === "KRITIS";
      if (activeTabFilter === "waspada") return matchQuery && status === "WASPADA";
      return matchQuery;
    });
  }, [defectaData, searchQuery, activeTabFilter]);

  // Perhitungan Pagination lokal
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredData.map((item) => item.id_produk || item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const selectedItemsData = defectaData.filter((item) => selectedItems.includes(item.id_produk || item.id));
  
  const estimasiNilaiTotal = selectedItemsData.reduce((sum, item) => {
    const qty = item.saran_order || item.min_stock || 10;
    const hpp = item.hpp || 15000;
    return sum + (qty * hpp);
  }, 0);

  const handleConfirmPoAndSave = async (supplierId) => {
    try {
      const payload = {
        supplier_id: supplierId,
        items: selectedItemsData.map(item => ({
          produk_id: item.id_produk || item.id,
          jumlah: item.saran_order || item.min_stock || 10,
          harga_satuan: item.hpp || 15000
        })),
        tanggal_pesan: new Date().toISOString()
      };

      await createPembelian(payload);
      alert("Purchase Order berhasil diterbitkan dan disimpan!");
      setIsPoModalOpen(false);
      navigate("/pembelian", { state: { items: selectedItemsData } });
    } catch (error) {
      console.error("Gagal menyimpan pembelian:", error);
      alert("Terjadi kesalahan saat memproses PO.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>
      {/* HEADER */}
      <Box sx={{ background: colors.bgCard, borderRadius: 3, p: 3, mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography sx={{ fontSize: 12, color: colors.textMuted }}>Inventaris Farmasi</Typography>
            <Typography sx={{ fontSize: 12, color: colors.textMuted }}>/</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.primary }}>Buku Defecta</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: typography.title, color: colors.text }}>Buku Defecta</Typography>
            <Chip label="Smart Restock (ROP)" size="small" sx={{ bgcolor: colors.primaryLight, color: colors.primary, fontWeight: 700 }} />
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={() => setIsPoModalOpen(true)}
          disabled={selectedItems.length === 0}
          sx={{ bgcolor: colors.text, color: "#fff", fontWeight: 700, px: 2.5, "&:hover": { bgcolor: colors.primary } }}
        >
          Buat PO Terpilih ({selectedItems.length}) • Rp {estimasiNilaiTotal.toLocaleString("id-ID")}
        </Button>
      </Box>

      {/* 4 STAT CARDS */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 3 }}>
        <Paper sx={{ ...statCardSx, p: 2.5, borderRadius: radii.xs, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>Stok Kritis</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: colors.danger, my: 0.5 }}>
              {defectaData.filter(i => (i.current_stock ?? i.stok_sisa ?? 0) === 0).length} <span style={{ fontSize: 13, fontWeight: 500, color: colors.textSecondary }}>Item</span>
            </Typography>
            <Typography sx={{ fontSize: 11, color: colors.danger }}>Habis &lt; 24 jam</Typography>
          </Box>
          <Box sx={{ p: 1, bgcolor: colors.dangerLight, color: colors.danger, borderRadius: 2 }}><ErrorOutlineIcon /></Box>
        </Paper>
        <Paper sx={{ ...statCardSx, p: 2.5, borderRadius: radii.xs, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>Menghampiri Batas</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: colors.warning, my: 0.5 }}>
              {defectaData.filter(i => (i.current_stock ?? i.stok_sisa ?? 0) > 0).length} <span style={{ fontSize: 13, fontWeight: 500, color: colors.textSecondary }}>Item</span>
            </Typography>
            <Typography sx={{ fontSize: 11, color: colors.warning }}>Buffer &lt; 3 hari</Typography>
          </Box>
          <Box sx={{ p: 1, bgcolor: colors.warningLight, color: colors.warning, borderRadius: 2 }}><WarningAmberIcon /></Box>
        </Paper>
        <Paper sx={{ ...statCardSx, p: 2.5, borderRadius: radii.xs, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>Estimasi Nilai PO</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: colors.text, my: 0.5 }}>Rp {estimasiNilaiTotal.toLocaleString("id-ID")}</Typography>
            <Typography sx={{ fontSize: 11, color: colors.textMuted }}>Total {defectaData.length} SKU Defecta</Typography>
          </Box>
          <Box sx={{ p: 1, bgcolor: colors.primaryLight, color: colors.primary, borderRadius: 2 }}><Inventory2OutlinedIcon /></Box>
        </Paper>
        <Paper sx={{ ...statCardSx, p: 2.5, borderRadius: radii.xs, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>PBF Terkait</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: colors.text, my: 0.5 }}>{suppliersList.length} <span style={{ fontSize: 13, fontWeight: 500, color: colors.textSecondary }}>Distributor</span></Typography>
            <Typography sx={{ fontSize: 11, color: colors.success }}>Semua Kontrak Aktif</Typography>
          </Box>
          <Box sx={{ p: 1, bgcolor: colors.successLight, color: colors.success, borderRadius: 2 }}><LocalShippingIcon /></Box>
        </Paper>
      </Box>

      {/* SEARCH & FILTER */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          placeholder="Cari nama obat, SKU, atau supplier..."
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          sx={{ flex: 1, minWidth: 280, bgcolor: colors.bgCard, borderRadius: radii.xs }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: colors.textMuted, fontSize: 20 }} /></InputAdornment>) }}
        />
        <Box sx={{ display: "flex", bgcolor: colors.bgCard, p: 0.5, borderRadius: 2, border: `1px solid ${colors.borderLight}` }}>
          <Button size="small" onClick={() => { setActiveTabFilter("semua"); setPage(1); }} sx={{ borderRadius: 1.5, px: 2, fontSize: 12, fontWeight: 600, bgcolor: activeTabFilter === 'semua' ? colors.primary : 'transparent', color: activeTabFilter === 'semua' ? '#fff' : colors.textSecondary }}>Semua</Button>
          <Button size="small" onClick={() => { setActiveTabFilter("kritis"); setPage(1); }} sx={{ borderRadius: 1.5, px: 2, fontSize: 12, fontWeight: 600, bgcolor: activeTabFilter === 'kritis' ? colors.danger : 'transparent', color: activeTabFilter === 'kritis' ? '#fff' : colors.textSecondary }}>Kritis</Button>
          <Button size="small" onClick={() => { setActiveTabFilter("waspada"); setPage(1); }} sx={{ borderRadius: 1.5, px: 2, fontSize: 12, fontWeight: 600, bgcolor: activeTabFilter === 'waspada' ? colors.warning : 'transparent', color: activeTabFilter === 'waspada' ? '#fff' : colors.textSecondary }}>Waspada</Button>
        </Box>
      </Box>

      {/* TABLE CONTAINER DENGAN DESAIN SEPERTI PRODUK PAGE */}
      <Box
        sx={{
          background: colors.bgLight,
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${colors.borderLight}`
        }}
      >
        <DefectaTable
          data={paginatedData}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onSinglePo={(item) => {
            setSelectedItems([item.id_produk || item.id]);
            setIsPoModalOpen(true);
          }}
        />

        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.bgCard,
            borderTop: `1px solid ${colors.borderLight}`,
            minHeight: 64,
            borderBottomLeftRadius: radii.lg,
            borderBottomRightRadius: radii.lg,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              color: colors.textSecondary,
            }}
          >
            Menampilkan {paginatedData.length} dari {totalItems} item defecta
          </Typography>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </Box>
      </Box>

      <KonfirmasiPoModal
        open={isPoModalOpen}
        onClose={() => setIsPoModalOpen(false)}
        selectedItemsData={selectedItemsData.length ? selectedItemsData : [defectaData[0]].filter(Boolean)}
        suppliersList={suppliersList}
        onConfirm={handleConfirmPoAndSave}
      />
    </Box>
  );
};

export default BukuDefectaPage;