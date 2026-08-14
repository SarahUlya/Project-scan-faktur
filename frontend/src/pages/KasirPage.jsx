import React, { useState, useRef, useMemo, useEffect } from "react";
import { Box, Typography, Snackbar, Alert, Autocomplete, TextField } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { PosProvider, usePos } from "../context/PosContext";
import usePosProducts from "../hooks/usePosProducts";
import PosProductGrid from "../components/kasir/PosProductGrid";
import PosProductList from "../components/kasir/PosProductList";
import PosCartSidebar from "../components/kasir/PosCartSidebar";
import PosSuccessModal from "../components/kasir/PosSuccessModal";
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const scanRef = useRef(null);

  const focusBarcode = () => {
    setTimeout(() => {
      if (scanRef.current) {
        scanRef.current.focus();
        if (typeof scanRef.current.select === "function") {
          try {
            scanRef.current.select();
          } catch (err) {
          }
        }
      }
    }, 50);
  };

  const { reloadTransaksi } = useTransaksiDb();

  useEffect(() => {
    if (!loading && !successModalOpen) {
      focusBarcode();
    }
  }, [loading, successModalOpen, cart, snackbarOpen]);

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

    const inputQuery = search.trim();

    if (!inputQuery) {
      focusBarcode();
      return;
    }

    const foundByBarcode = produk.find(
      (p) => p.barcode === inputQuery || p.kode === inputQuery
    );

    if (foundByBarcode) {
      addToCart(foundByBarcode, 1);
      setSearch("");
      setSnackbarOpen(true);
      focusBarcode();
      return;
    }

    if (filtered.length === 1) {
      addToCart(filtered[0], 1);
      setSearch("");
      setSnackbarOpen(true);
      focusBarcode();
      return;
    }

    focusBarcode();
  };

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
        width: "100%",
      }}
    >
      <Box sx={{ px: 3, pt: 3 }}>
        {/* Header */}
        <Box
          sx={{
            background: colors.bgCard,
            borderRadius: 3,
            p: 3,
            mb: 3,
          }}
        >
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

        <Box
          sx={{
            display: "flex",
            gap: 2.5,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* AREA KERANJANG (70%) */}
          <Box
            sx={{
              width: "70%",
              flexShrink: 0,
              "& > *": {
                width: "100% !important",
                maxWidth: "100% !important",
                minWidth: "100% !important",
              },
            }}
          >
            <PosCartSidebar
              onTransaksiSukses={async (result) => {
                setSuccessData(result);
                setSuccessModalOpen(true);
                await reloadProducts();
              }}
            />
          </Box>

          {/* AREA DAFTAR PRODUK (30%) */}
          <Box
            sx={{
              width: "30%",
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            {/* Search Bar Tunggal */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 2,
                alignItems: "center",
                p: "12px 16px",
                bgcolor: colors.bgCard,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.card,
              }}
            >
              <SearchBar
                placeholder="Cari obat atau scan barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleBarcodeEnter}
                ref={scanRef}
                autoFocus
              />
            </Box>

            {/* Filter Kategori */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: colors.textSecondary,
                  whiteSpace: "nowrap",
                }}
              >
                KATEGORI :
              </Typography>

              <Box sx={{ width: "100%" }}>
                <Autocomplete
                  size="small"
                  options={kategori}
                  value={
                    kategori.find(
                      (item) => String(item.id_kategori) === String(kategoriFilter)
                    ) || null
                  }
                  getOptionLabel={(option) => option.nama_kategori || ""}
                  isOptionEqualToValue={(option, value) =>
                    String(option.id_kategori) === String(value.id_kategori)
                  }
                  onChange={(event, newValue) => {
                    setKategoriFilter(newValue?.id_kategori || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Cari kategori..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: 13,
                          borderRadius: `${radii.sm}px`,
                          backgroundColor: colors.bgCard,
                        },
                      }}
                    />
                  )}
                  noOptionsText="Kategori tidak ditemukan"
                />
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: colors.bgCard,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.card,
                p: 2,
                height: "calc(100vh - 220px)",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.15)",
                  borderRadius: "4px",
                },
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
              ) : (
                <PosProductList
                  produk={filtered}
                  getNamaKategori={getNamaKategori}
                />
              )}
            </Box>
          </Box>
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
          sx={{ bgcolor: "#D81B60", color: "#fff", fontWeight: 600 }}
        >
          Produk ditambahkan ke keranjang
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
    </Box>
  );
};

const KasirPage = () => (
  <PosProvider>
    <KasirContent />
  </PosProvider>
);

export default KasirPage;