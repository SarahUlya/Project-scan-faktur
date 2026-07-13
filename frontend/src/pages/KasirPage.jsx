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
    let list = produk.filter(
      (p) => p.is_active !== false
    );
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
  console.log(produk);

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
    <Box sx={{
      minHeight: "100vh",
      backgroundColor: "#F1F5F9",
      pb: 4,
    }}>
      <Box sx={{ px: 3, pt: 3 }}>
        {/* Header dengan Design Minimalis */}
        <Box sx={{ mb: 4, pb: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 32, color: "#1E293B", mb: 0.5 }}>
            💊 Kasir Pintar
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13, fontWeight: 500 }}>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Search & Control Bar - Premium Glass Design */}
            <Box sx={{ 
              display: "flex", 
              gap: 2, 
              mb: 3, 
              flexWrap: "wrap", 
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              padding: "16px 20px",
              borderRadius: "14px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Cari nama obat atau barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #E2E8F0",
                  fontSize: 13,
                  outline: "none",
                  backgroundColor: "#fff",
                  color: "#1E293B",
                  fontWeight: 500,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D81B60";
                  e.target.style.boxShadow = "0 0 0 3px rgba(216, 27, 96, 0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E2E8F0";
                  e.target.style.boxShadow = "none";
                }}
              />

              {/* Barcode Scanner Input */}
              <input
                ref={scanRef}
                type="text"
                placeholder="Scan barcode..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeEnter}
                style={{
                  width: 190,
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #E2E8F0",
                  fontSize: 13,
                  outline: "none",
                  backgroundColor: "#FFFFFF",
                  color: "#D81B60",
                  fontWeight: 600,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D81B60";
                  e.target.style.boxShadow = "0 0 0 3px rgba(216, 27, 96, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E2E8F0";
                  e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.02)";
                }}
              />

              {/* View Mode Toggle */}
              <Box sx={{ 
                display: "flex", 
                gap: 0.5, 
                bgcolor: "rgba(255, 255, 255, 0.8)", 
                borderRadius: 2.5, 
                border: "1px solid #E2E8F0", 
                p: 0.5,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}>
                <Box 
                  onClick={() => setViewMode("grid")} 
                  sx={{ 
                    p: 1, 
                    cursor: "pointer", 
                    borderRadius: 2, 
                    bgcolor: viewMode === "grid" ? "linear-gradient(135deg, #FFF5F7 0%, #FFE8ED 100%)" : "transparent", 
                    color: viewMode === "grid" ? "#D81B60" : "#94A3B8", 
                    fontSize: 18,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: viewMode === "grid" ? "0 2px 6px rgba(216, 27, 96, 0.12)" : "none",
                    "&:hover": {
                      backgroundColor: "rgba(216, 27, 96, 0.06)",
                    },
                  }}
                >
                  <GridViewIcon fontSize="small" />
                </Box>
                <Box 
                  onClick={() => setViewMode("list")} 
                  sx={{ 
                    p: 1, 
                    cursor: "pointer", 
                    borderRadius: 2, 
                    bgcolor: viewMode === "list" ? "linear-gradient(135deg, #FFF5F7 0%, #FFE8ED 100%)" : "transparent", 
                    color: viewMode === "list" ? "#D81B60" : "#94A3B8", 
                    fontSize: 18,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: viewMode === "list" ? "0 2px 6px rgba(216, 27, 96, 0.12)" : "none",
                    "&:hover": {
                      backgroundColor: "rgba(216, 27, 96, 0.06)",
                    },
                  }}
                >
                  <ViewListIcon fontSize="small" />
                </Box>
              </Box>
            </Box>

            {/* Category Filter - Premium Design */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3, alignItems: "center", position: "relative" }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.5 }}>Kategori:</label>
              <div style={{ position: "relative", minWidth: 190 }}>
                <input
                  ref={kategoriInputRef}
                  type="text"
                  placeholder="Semua Kategori"
                  value={kategoriSearch || kategori.find((k) => String(k.id_kategori) === kategoriFilter)?.nama_kategori || "Semua Kategori"}
                  onChange={(e) => {
                    setKategoriSearch(e.target.value);
                    setShowKategoriDropdown(true);
                  }}
                  onFocus={() => setShowKategoriDropdown(true)}
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 10,
                    border: "1.5px solid #E2E8F0",
                    fontSize: 13,
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    color: "#1E293B",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseDown={(e) => {
                    if (!kategoriSearch) {
                      setShowKategoriDropdown(!showKategoriDropdown);
                      e.preventDefault();
                    }
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#D81B60";
                    e.target.style.boxShadow = "0 0 0 3px rgba(216, 27, 96, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E2E8F0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {showKategoriDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      marginTop: 6,
                      backgroundColor: "#fff",
                      border: "1.5px solid #E2E8F0",
                      borderRadius: 12,
                      maxHeight: 260,
                      overflowY: "auto",
                      zIndex: 10,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                    }}
                  >
                    <div
                      onClick={() => handleKategoriSelect("semua")}
                      style={{
                        padding: "11px 14px",
                        cursor: "pointer",
                        backgroundColor: kategoriFilter === "semua" ? "#FFF5F7" : "#fff",
                        color: kategoriFilter === "semua" ? "#D81B60" : "#475569",
                        borderBottom: "1px solid #F1F5F9",
                        fontWeight: kategoriFilter === "semua" ? 700 : 600,
                        fontSize: 13,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#FDF8FB")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = kategoriFilter === "semua" ? "#FFF5F7" : "#fff")}
                    >
                      Semua Kategori
                    </div>
                    {filteredKategori.map((k) => (
                      <div
                        key={k.id_kategori}
                        onClick={() => handleKategoriSelect(k.id_kategori)}
                        style={{
                          padding: "11px 14px",
                          cursor: "pointer",
                          backgroundColor: String(k.id_kategori) === kategoriFilter ? "#FFF5F7" : "#fff",
                          color: String(k.id_kategori) === kategoriFilter ? "#D81B60" : "#475569",
                          borderBottom: "1px solid #F1F5F9",
                          fontWeight: String(k.id_kategori) === kategoriFilter ? 700 : 600,
                          fontSize: 13,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#FDF8FB")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = String(k.id_kategori) === kategoriFilter ? "#FFF5F7" : "#fff")}
                      >
                        {k.nama_kategori}
                      </div>
                    ))}
                    {filteredKategori.length === 0 && kategoriSearch && (
                      <div style={{ padding: "11px 14px", color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
                        Kategori tidak ditemukan
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Box>

            {/* Product Display Area - Premium Glass */}
            <Box sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              p: 3,
              minHeight: 400,
            }}>
              {error && (
                <Typography sx={{ color: "#B91C1C", py: 2, textAlign: "center", fontWeight: 700 }}>
                  {error}
                </Typography>
              )}

              {loading ? (
                <Typography sx={{ color: "#94A3B8", py: 4, textAlign: "center", fontWeight: 600 }}>
                  ⏳ Memuat produk...
                </Typography>
              ) : viewMode === "grid" ? (
                <PosProductGrid produk={filtered} getNamaKategori={getNamaKategori} />
              ) : (
                <PosProductList produk={filtered} getNamaKategori={getNamaKategori} />
              )}
            </Box>
          </Box>

          <PosCartSidebar onTransaksiSukses={handleSuccess} />
        </Box>
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
