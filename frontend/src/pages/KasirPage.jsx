import React, { useState, useRef, useMemo, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { PosProvider, usePos } from "../context/PosContext";
import usePosProducts from "../hooks/usePosProducts";
import PosProductGrid from "../components/kasir/PosProductGrid";
import PosProductList from "../components/kasir/PosProductList";
import PosCartSidebar from "../components/kasir/PosCartSidebar";
import PosSuccessModal from "../components/kasir/PosSuccessModal";
// Reusable UI components
import SearchBar from "../components/kasir/SearchBar";
import BarcodeInput from "../components/kasir/BarcodeInput";
import CategoryFilter from "../components/kasir/CategoryFilter";
import KasirLoadingSkeleton from "../components/kasir/KasirLoadingSkeleton";
import useTransaksiDb from "../hooks/useTransaksiDb";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  zIndex,
  fieldInputSx,
  pageHeaderSx,
  statCardSx,
} from "@/theme/designTokens";

const KasirContent = () => {
  const {
    cart,
    search,
    setSearch,
    viewMode,
    setViewMode,
    kategoriFilter,
    setKategoriFilter,
    addToCart,
  } = usePos();
  const { produk, kategori, loading, error, getNamaKategori, reloadProducts } =
    usePosProducts();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const scanRef = useRef(null);
  const focusBarcode = () => {
    requestAnimationFrame(() => {
      if (scanRef.current) {
        scanRef.current.focus();
        scanRef.current.select();
      }
    });
  };
  const { reloadTransaksi } = useTransaksiDb();

  // Focus barcode scanner on mount, when cart changes, or when modals/success modal closes
  useEffect(() => {
    focusBarcode();
  }, []);

  useEffect(() => {
    if (!successModalOpen) {
      focusBarcode();
    }
  }, [successModalOpen]);

  useEffect(() => {
    focusBarcode();
  }, [cart]);

  const selectedKategoriLabel =
    kategoriFilter === "semua"
      ? "Semua Kategori"
      : kategori.find((k) => String(k.id_kategori) === String(kategoriFilter))
          ?.nama_kategori || "Semua Kategori";

  const filtered = useMemo(() => {
    let list = produk.filter((p) => p.is_active !== false);
    if (kategoriFilter !== "semua") {
      list = list.filter(
        (p) => String(p.id_kategori) === String(kategoriFilter),
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nama_produk?.toLowerCase().includes(q) ||
          p.barcode?.includes(q) ||
          String(p.id_produk).includes(q),
      );
    }
    return list;
  }, [produk, kategoriFilter, search]);

  const handleBarcodeEnter = (e) => {
    if (e.key !== "Enter") return;

    const code = barcodeInput.trim();

    if (!code) {
      focusBarcode();
      return;
    }

    const found = produk.find((p) => p.barcode === code);

    if (!found) {
      setBarcodeInput("");
      setSnackbarOpen(true);
      focusBarcode();
      return;
    }

    addToCart(found, 1);

    setBarcodeInput("");

    setSnackbarOpen(true);

    focusBarcode();
  };

  // Return focus to barcode input after snackbar opens
  useEffect(() => {
    if (snackbarOpen) {
      focusBarcode();
    }
  }, [snackbarOpen]);

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  if (loading) {
    return <KasirLoadingSkeleton />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        pb: spacing.xxl,
      }}
    >
      {" "}
      <Box sx={{ px: 3, pt: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, pb: 2 }}>
          <Typography
            sx={{
              fontWeight: typography.bold,
              fontSize: typography.title,
              color: colors.text,
              mb: 0.5,
            }}
          >
            Kasir Pintar
          </Typography>
          <Typography
            sx={{
              color: colors.textSecondary,
              fontSize: typography.caption,
              fontWeight: typography.medium,
            }}
          >
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Search & Controls */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                flexWrap: "wrap",
                alignItems: "center",
                p: "16px 20px",
                bgcolor: colors.bgCard,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.card,
              }}
            >
              <SearchBar
                placeholder="Cari nama obat atau barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <BarcodeInput
                placeholder="Scan barcode..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeEnter}
                ref={scanRef}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  bgcolor: "rgba(255,255,255,0.8)",
                  borderRadius: 2.5,
                  border: "1px solid #E2E8F0",
                  p: 0.5,
                  transition: "all 150ms ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <Box
                  onClick={() => setViewMode("grid")}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    borderRadius: 2,
                    bgcolor:
                      viewMode === "grid"
                        ? "linear-gradient(135deg, #FFF5F7 0%, #FFE8ED 100%)"
                        : "transparent",
                    color: viewMode === "grid" ? "#D81B60" : "#94A3B8",
                    fontSize: 18,
                    transition: "all 150ms ease",
                    boxShadow:
                      viewMode === "grid"
                        ? "0 2px 6px rgba(216,27,96,0.12)"
                        : "none",
                    "&:hover": { backgroundColor: "rgba(216,27,96,0.06)" },
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
                    bgcolor:
                      viewMode === "list"
                        ? "linear-gradient(135deg, #FFF5F7 0%, #FFE8ED 100%)"
                        : "transparent",
                    color: viewMode === "list" ? "#D81B60" : "#94A3B8",
                    fontSize: 18,
                    transition: "all 150ms ease",
                    boxShadow:
                      viewMode === "list"
                        ? "0 2px 6px rgba(216,27,96,0.12)"
                        : "none",
                    "&:hover": { backgroundColor: "rgba(216,27,96,0.06)" },
                  }}
                >
                  <ViewListIcon fontSize="small" />
                </Box>
              </Box>
            </Box>
            {/* Category */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: colors.textSecondary,
                  whiteSpace: "nowrap",
                }}
              >
                KATEGORI :
              </Typography>

              <Box sx={{ width: 250 }}>
                <CategoryFilter
                  kategori={kategori}
                  kategoriFilter={kategoriFilter}
                  setKategoriFilter={setKategoriFilter}
                  selectedLabel={selectedKategoriLabel}
                />
              </Box>
            </Box>
            {/* Product Display */}
            <Box
              sx={{
                bgcolor: colors.bgCard,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.card,
                p: 3,
                minHeight: 400,
              }}
            >
              {error && (
                <Typography
                  sx={{
                    color: colors.error,
                    py: 2,
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                >
                  {error}
                </Typography>
              )}
              {filtered.length === 0 ? (
                <Typography
                  sx={{
                    textAlign: "center",
                    py: 4,
                    color: colors.textSecondary,
                    fontWeight: 500,
                  }}
                >
                  Tidak ada produk yang cocok dengan pencarian Anda.
                </Typography>
              ) : viewMode === "grid" ? (
                <PosProductGrid
                  produk={filtered}
                  getNamaKategori={getNamaKategori}
                />
              ) : (
                <PosProductList
                  produk={filtered}
                  getNamaKategori={getNamaKategori}
                />
              )}
            </Box>
          </Box>
          <PosCartSidebar
            onTransaksiSukses={async (result) => {
              setSuccessData(result);
              setSuccessModalOpen(true);

              await reloadProducts();
            }}
          />
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        sx={{ mt: 2 }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ bgcolor: colors.danger, color: "#fff" }}
        >
          Produk Tidak Terdeteksi
        </Alert>
      </Snackbar>
      <PosSuccessModal
        open={successModalOpen}
        data={successData}
        onClose={() => {
          setSuccessModalOpen(false);
          focusBarcode();
        }}
        onNewTransaction={() => {
          setSuccessModalOpen(false);
          focusBarcode();
        }}
      />
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            bgcolor: "#D81B60",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Produk ditambahkan ke keranjang
        </Alert>
      </Snackbar>
    </Box>
  );
};

const KasirPage = () => (
  <PosProvider>
    <KasirContent />
  </PosProvider>
);

export default KasirPage;
