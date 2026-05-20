import React, { useState, useRef, useMemo, useEffect } from "react";
import { Box, Typography } from "@mui/material";
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
  const [kategoriSearch, setKategoriSearch] = useState("");
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const scanRef = useRef(null);
  const kategoriInputRef = useRef(null);

  // Auto-focus barcode input on mount
  useEffect(() => {
    scanRef.current?.focus();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (kategoriInputRef.current && !kategoriInputRef.current.contains(event.target)) {
        setShowKategoriDropdown(false);
        setKategoriSearch("");
      }
    };

    if (showKategoriDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showKategoriDropdown]);

  // Filter kategori based on search
  const filteredKategori = useMemo(() => {
    const q = kategoriSearch.toLowerCase();
    return kategori.filter((k) =>
      k.nama_kategori.toLowerCase().includes(q)
    );
  }, [kategoriSearch, kategori]);

  const filtered = useMemo(() => {
    let list = produk.filter((p) => p.is_active !== false && (p.stok || 0) > 0);
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
      scanRef.current?.focus();
      return;
    }
    setScanProduk(found);
    setBarcodeInput("");
  };

  const handleKategoriSelect = (kategoriId) => {
    setKategoriFilter(String(kategoriId));
    setKategoriSearch("");
    setShowKategoriDropdown(false);
  };

  const handleSuccess = (data) => {
    setSuccessData(data);
    if (data.cetakStruk) {
      setTimeout(() => window.print(), 400);
    }
    // Auto-focus barcode input after successful transaction
    setTimeout(() => {
      scanRef.current?.focus();
    }, 600);
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
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Cari nama obat atau barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 200,
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                fontSize: 14,
                outline: "none",
                backgroundColor: "#fff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#E91E63")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
            />
            <input
              ref={scanRef}
              type="text"
              placeholder="Scan barcode..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleBarcodeEnter}
              style={{
                width: 160,
                padding: "10px 14px",
                borderRadius: 8,
                border: "2px solid #E91E63",
                fontSize: 14,
                outline: "none",
                backgroundColor: "#FFF1F2",
              }}
            />
            <Box sx={{ display: "flex", gap: 0.5, bgcolor: "#fff", borderRadius: 2, border: "1px solid #F1F5F9", p: 0.5 }}>
              <Box onClick={() => setViewMode("grid")} sx={{ p: 1, cursor: "pointer", borderRadius: 1.5, bgcolor: viewMode === "grid" ? "#FFF1F2" : "transparent", color: viewMode === "grid" ? "#E91E63" : "#94A3B8", fontSize: 18 }}>
                <GridViewIcon fontSize="small" />
              </Box>
              <Box onClick={() => setViewMode("list")} sx={{ p: 1, cursor: "pointer", borderRadius: 1.5, bgcolor: viewMode === "list" ? "#FFF1F2" : "transparent", color: viewMode === "list" ? "#E91E63" : "#94A3B8", fontSize: 18 }}>
                <ViewListIcon fontSize="small" />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2, alignItems: "center", position: "relative" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>Kategori:</label>
            <div style={{ position: "relative", minWidth: 180 }}>
              <input
                ref={kategoriInputRef}
                type="text"
                placeholder="Cari kategori..."
                value={kategoriSearch || kategori.find((k) => String(k.id_kategori) === kategoriFilter)?.nama_kategori || "Semua Kategori"}
                onChange={(e) => {
                  setKategoriSearch(e.target.value);
                  setShowKategoriDropdown(true);
                }}
                onFocus={() => setShowKategoriDropdown(true)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  fontSize: 13,
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  color: "#1E293B",
                  transition: "all 0.2s",
                }}
                onMouseDown={(e) => {
                  if (!kategoriSearch) {
                    setShowKategoriDropdown(!showKategoriDropdown);
                    e.preventDefault();
                  }
                }}
              />
              {showKategoriDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 4,
                    backgroundColor: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    maxHeight: 240,
                    overflowY: "auto",
                    zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    onClick={() => handleKategoriSelect("semua")}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      backgroundColor: kategoriFilter === "semua" ? "#FFF1F2" : "#fff",
                      color: kategoriFilter === "semua" ? "#E91E63" : "#475569",
                      borderBottom: "1px solid #F1F5F9",
                      fontWeight: kategoriFilter === "semua" ? 700 : 600,
                      fontSize: 13,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#FDF8FB")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = kategoriFilter === "semua" ? "#FFF1F2" : "#fff")}
                  >
                    Semua Kategori
                  </div>
                  {filteredKategori.map((k) => (
                    <div
                      key={k.id_kategori}
                      onClick={() => handleKategoriSelect(k.id_kategori)}
                      style={{
                        padding: "10px 12px",
                        cursor: "pointer",
                        backgroundColor: String(k.id_kategori) === kategoriFilter ? "#FFF1F2" : "#fff",
                        color: String(k.id_kategori) === kategoriFilter ? "#E91E63" : "#475569",
                        borderBottom: "1px solid #F1F5F9",
                        fontWeight: String(k.id_kategori) === kategoriFilter ? 700 : 600,
                        fontSize: 13,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#FDF8FB")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = String(k.id_kategori) === kategoriFilter ? "#FFF1F2" : "#fff")}
                    >
                      {k.nama_kategori}
                    </div>
                  ))}
                  {filteredKategori.length === 0 && kategoriSearch && (
                    <div style={{ padding: "10px 12px", color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
                      Kategori tidak ditemukan
                    </div>
                  )}
                </div>
              )}
            </div>
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
