import React, { useState, useRef, useMemo } from "react";
import { Box, Typography, TextField, InputAdornment, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { PosProvider, usePos } from "../context/PosContext";
import usePosProducts from "../hooks/usePosProducts";
import PosProductGrid from "../components/kasir/PosProductGrid";
import PosProductList from "../components/kasir/PosProductList";
import PosCartSidebar from "../components/kasir/PosCartSidebar";
import PosBarcodeModal from "../components/kasir/PosBarcodeModal";
import PosSuccessModal from "../components/kasir/PosSuccessModal";

const KasirContent = () => {
  const { produk, kategori, loading, error, getNamaKategori } = usePosProducts();
  const { viewMode, setViewMode, kategoriFilter, setKategoriFilter, search, setSearch, addToCart } = usePos();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scanProduk, setScanProduk] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const scanRef = useRef(null);

  const filtered = useMemo(() => {
    let list = produk.filter((p) => p.is_active !== false);
    if (kategoriFilter !== "semua") {
      list = list.filter((p) => String(p.id_kategori) === String(kategoriFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nama_produk?.toLowerCase().includes(q) ||
          p.barcode?.includes(q) ||
          String(p.id_produk).includes(q)
      );
    }
    return list;
  }, [produk, kategoriFilter, search]);

  const handleBarcodeEnter = (e) => {
    if (e.key !== "Enter") return;
    const code = barcodeInput.trim();
    if (!code) return;
    const found = produk.find((p) => p.barcode === code);
    if (!found) {
      alert("Produk tidak ditemukan.");
      setBarcodeInput("");
      return;
    }
    setScanProduk(found);
    setBarcodeInput("");
  };

  const handleSuccess = (data) => {
    setSuccessData(data);
    if (data.cetakStruk) {
      setTimeout(() => window.print(), 400);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 26, color: "#1E293B" }}>Kasir Pintar</Typography>
        <Typography sx={{ color: "#64748B", fontSize: 14 }}>
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              placeholder="Cari nama obat, kode, atau barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 220, bgcolor: "#fff", borderRadius: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              inputRef={scanRef}
              placeholder="Scan barcode..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleBarcodeEnter}
              size="small"
              sx={{ width: 200, bgcolor: "#FFF1F2", borderRadius: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCodeScannerIcon sx={{ color: "#E91E63" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: "flex", gap: 0.5, bgcolor: "#fff", borderRadius: 2, border: "1px solid #F1F5F9", p: 0.5 }}>
              <Box onClick={() => setViewMode("grid")} sx={{ p: 1, cursor: "pointer", borderRadius: 1.5, bgcolor: viewMode === "grid" ? "#FFF1F2" : "transparent", color: viewMode === "grid" ? "#E91E63" : "#94A3B8" }}>
                <GridViewIcon fontSize="small" />
              </Box>
              <Box onClick={() => setViewMode("list")} sx={{ p: 1, cursor: "pointer", borderRadius: 1.5, bgcolor: viewMode === "list" ? "#FFF1F2" : "transparent", color: viewMode === "list" ? "#E91E63" : "#94A3B8" }}>
                <ViewListIcon fontSize="small" />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <Chip label="Semua" onClick={() => setKategoriFilter("semua")} sx={{ fontWeight: 700, bgcolor: kategoriFilter === "semua" ? "#E91E63" : "#fff", color: kategoriFilter === "semua" ? "#fff" : "#64748B" }} />
            {kategori.map((k) => (
              <Chip
                key={k.id_kategori}
                label={k.nama_kategori}
                onClick={() => setKategoriFilter(String(k.id_kategori))}
                sx={{ fontWeight: 600, bgcolor: kategoriFilter === String(k.id_kategori) ? "#E91E63" : "#fff", color: kategoriFilter === String(k.id_kategori) ? "#fff" : "#64748B" }}
              />
            ))}
          </Box>

          {error && (
            <Typography sx={{ color: "#B91C1C", py: 2, textAlign: "center", fontWeight: 700 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Typography sx={{ color: "#94A3B8", py: 4, textAlign: "center" }}>Memuat produk...</Typography>
          ) : viewMode === "grid" ? (
            <PosProductGrid produk={filtered} getNamaKategori={getNamaKategori} />
          ) : (
            <PosProductList produk={filtered} getNamaKategori={getNamaKategori} />
          )}
        </Box>

        <PosCartSidebar onTransaksiSukses={handleSuccess} />
      </Box>

      <PosBarcodeModal
        open={!!scanProduk}
        produk={scanProduk}
        onClose={() => setScanProduk(null)}
        onAdd={(p, qty) => addToCart(p, qty)}
      />

      <PosSuccessModal
        open={!!successData}
        data={successData}
        onClose={() => setSuccessData(null)}
        onNewTransaction={() => {
          setSuccessData(null);
          scanRef.current?.focus();
        }}
      />
    </Box>
  );
};

const KasirPage = () => (
  <PosProvider>
    <KasirContent />
  </PosProvider>
);

export default KasirPage;
