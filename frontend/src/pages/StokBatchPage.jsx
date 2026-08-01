import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import useProdukBatch from "../hooks/useProdukBatch";
import ProductStokTable from "../components/stok/ProductStokTable";
import DetailProductModal from "../components/stok/DetailProductModal";
import StokBatchLoadingSkeleton from "../components/stok/StokBatchLoadingSkeleton";
import StokPrintActions from "../components/stok/StokPrintActions";
import PaginationControls from "../components/ui/PaginationControls";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  pageHeaderSx,
  statCardSx,
} from "@/theme/designTokens";

const PAGE_SIZE = 20;

const StokBatchPage = () => {
  const { produk, loading } = useProdukBatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter produk dengan stok > 0
  const filteredProducts = useMemo(() => {
    let list = produk.filter((p) => {
      const totalStok = (p.batch || []).reduce((sum, b) => sum + Number(b.stok || 0), 0);
      return totalStok > 0;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const nameMatch = p.nama_produk?.toLowerCase().includes(q);
        const barcodeMatch = p.barcode?.includes(q);
        const batchMatch = (p.batch || []).some((b) =>
          String(b.no_batch || "").toLowerCase().includes(q)
        );
        return nameMatch || barcodeMatch || batchMatch;
      });
    }

    // Urutkan berdasarkan expired terdekat (FEFO)
    return list.sort((a, b) => {
      const getEarliest = (batches) => {
        const valid = (batches || []).filter((b) => Number(b.stok) > 0);
        if (!valid.length) return Infinity;
        return Math.min(...valid.map((b) => new Date(b.expired).getTime()));
      };
      return getEarliest(a.batch) - getEarliest(b.batch);
    });
  }, [produk, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Statistik ringkasan
  const stats = useMemo(() => {
    let totalBatch = 0;
    let nearExpired = 0;
    let expired = 0;

    filteredProducts.forEach((p) => {
      (p.batch || []).forEach((b) => {
        const stok = Number(b.stok || 0);
        if (stok <= 0) return;
        totalBatch += 1;
        const days = Math.ceil((new Date(b.expired) - new Date()) / (1000 * 60 * 60 * 24));
        if (days <= 0) expired += 1;
        else if (days <= 30) nearExpired += 1;
      });
    });

    return {
      totalProduk: filteredProducts.length,
      totalBatch,
      nearExpired,
      expired,
    };
  }, [filteredProducts]);

  if (loading) return <StokBatchLoadingSkeleton />;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={pageHeaderSx.title}>Stok & Batch</Typography>
          <Typography sx={pageHeaderSx.subtitle}>
            Monitoring stok per produk dengan manajemen batch (FEFO)
          </Typography>
        </Box>
        <StokPrintActions disabled={!filteredProducts.length} onExport={() => {}} />
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              ...statCardSx,
              borderRadius: radii.xs,
              p: 2.5,
              transition: transitions.fast,
              "&:hover": { boxShadow: shadows.hover, transform: "translateY(-2px)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: radii.xs,
                  bgcolor: colors.primaryLight,
                  color: colors.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InventoryIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, textTransform: "uppercase" }}>
                  Produk Tersedia
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 24, color: colors.text }}>
                  {stats.totalProduk}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              ...statCardSx,
              borderRadius: radii.xs,
              p: 2.5,
              transition: transitions.fast,
              "&:hover": { boxShadow: shadows.hover, transform: "translateY(-2px)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: radii.xs,
                  bgcolor: colors.bgMuted,
                  color: colors.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InventoryIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, textTransform: "uppercase" }}>
                  Total Batch
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 24, color: colors.text }}>
                  {stats.totalBatch}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              ...statCardSx,
              borderRadius: radii.xs,
              p: 2.5,
              transition: transitions.fast,
              "&:hover": { boxShadow: shadows.hover, transform: "translateY(-2px)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: radii.xs,
                  bgcolor: colors.warningLight,
                  color: colors.warning,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WarningAmberIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, textTransform: "uppercase" }}>
                  Hampir Expired
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 24, color: colors.warning }}>
                  {stats.nearExpired}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              ...statCardSx,
              borderRadius: radii.xs,
              p: 2.5,
              transition: transitions.fast,
              "&:hover": { boxShadow: shadows.hover, transform: "translateY(-2px)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: radii.xs,
                  bgcolor: colors.dangerLight,
                  color: colors.danger,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CancelIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, textTransform: "uppercase" }}>
                  Expired
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 24, color: colors.danger }}>
                  {stats.expired}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Cari produk, barcode, atau kode batch..."
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          sx={{
            width: { xs: "100%", sm: 360 },
            "& .MuiOutlinedInput-root": {
              borderRadius: radii.xs,
              bgcolor: colors.bgCard,
              border: `1px solid ${colors.border}`,
              transition: transitions.fast,
              "&:hover": {
                borderColor: colors.primary,
              },
              "&.Mui-focused": {
                borderColor: colors.primary,
                boxShadow: `0 0 0 3px ${colors.primaryLight}`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.textMuted, fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <Paper
        sx={{
          borderRadius: radii.xs,
          border: `1px solid ${colors.borderLight}`,
          overflow: "hidden",
          boxShadow: shadows.card,
        }}
      >
        {filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <InventoryIcon sx={{ fontSize: 48, color: colors.textMuted, mb: 2 }} />
            <Typography sx={{ fontWeight: 600, color: colors.text, mb: 1 }}>
              Tidak ada produk dengan stok tersedia
            </Typography>
            <Typography sx={{ fontSize: 14, color: colors.textMuted }}>
              Stok akan muncul setelah penerimaan faktur pembelian.
            </Typography>
          </Box>
        ) : (
          <>
            <ProductStokTable products={pagedProducts} onDetailClick={setSelectedProduct} />

            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: `1px solid ${colors.borderLight}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                bgcolor: colors.bgMuted,
              }}
            >
              <Typography sx={{ fontSize: 13, color: colors.textMuted }}>
                Menampilkan {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filteredProducts.length)} dari{" "}
                {filteredProducts.length} produk
              </Typography>
              <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
            </Box>
          </>
        )}
      </Paper>

      <DetailProductModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </Box>
  );
};

export default StokBatchPage;