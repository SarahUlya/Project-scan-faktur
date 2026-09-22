import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
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
import * as XLSX from "xlsx";

const PageSize = 10;

const StokBatchPage = () => {
  const { produk, loading } = useProdukBatch();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    let list = produk.filter((p) => {
      const totalStok = (p.batch || []).reduce(
        (sum, b) => sum + Number(b.qty_sisa || 0),
        0
      );
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

    return list.sort((a, b) => {
      const getEarliest = (batches) => {
        const valid = (batches || []).filter((b) => Number(b.qty_sisa) > 0);
        if (!valid.length) return Infinity;
        return Math.min(
          ...valid.map((b) => new Date(b.expired_date).getTime())
        );
      };
      return getEarliest(a.batch) - getEarliest(b.batch);
    });
  }, [produk, searchQuery]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PageSize) || 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * PageSize;
    return filteredProducts.slice(startIndex, startIndex + PageSize);
  }, [filteredProducts, page]);

  const stats = useMemo(() => {
    let totalBatch = 0;
    let nearExpired = 0;
    let expired = 0;

    filteredProducts.forEach((p) => {
      (p.batch || []).forEach((b) => {
        const stok = Number(b.qty_sisa || 0);
        if (stok <= 0) return;
        totalBatch += 1;
        const days = Math.ceil(
          (new Date(b.expired_date) - new Date()) / (1000 * 60 * 60 * 24)
        );
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

  const handleExport = () => {
    if (!filteredProducts.length) return;

    const exportData = filteredProducts.map((p) => {
      const namaKategori =
        typeof p.kategori === "object" && p.kategori !== null
          ? p.kategori.nama || p.kategori.nama_kategori || "-"
          : p.kategori || "-";

      const totalStok = (p.batch || []).reduce(
        (sum, b) => sum + Number(b.qty_sisa || 0),
        0
      );

      const validBatches = (p.batch || []).filter(
        (b) => Number(b.qty_sisa) > 0
      );
      let expiredTerdekat = "-";
      if (validBatches.length > 0) {
        const dates = validBatches
          .map((b) => new Date(b.expired_date))
          .filter((d) => !isNaN(d));
        if (dates.length > 0) {
          const minDate = new Date(Math.min(...dates));
          expiredTerdekat = minDate.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      }

      return {
        "Nama Produk": p.nama_produk || "-",
        "Kategori / Kode": `${namaKategori} • ${p.barcode || "-"}`,
        "Total Batch": (p.batch || []).length,
        "Total Stok": totalStok,
        "Expired Terdekat": expiredTerdekat,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stok Produk");

    XLSX.writeFile(
      workbook,
      `Laporan_Stok_Batch_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  if (loading) return <StokBatchLoadingSkeleton />;

  // ==================== RENDER ====================
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
      {/* ==================== HEADER ==================== */}
      <Paper
        elevation={0}
        sx={{
          p: spacing.xxl,
          borderRadius: radii.s,
          border: `1px solid ${colors.borderLight}`,
          bgcolor: colors.bgCard,
          boxShadow: shadows.card,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: spacing.lg,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 280 }}>
          <Typography sx={pageHeaderSx.title}>Stok Produk & Batch</Typography>
          <Typography
            sx={{ ...pageHeaderSx.subtitle, fontSize: typography.body }}
          >
            Pantau stok produk dan batch yang tersedia, termasuk informasi
            tanggal kadaluarsa.
          </Typography>
        </Box>
        <StokPrintActions
          disabled={!filteredProducts.length}
          onExport={handleExport}
        />
      </Paper>

      {/* ==================== STAT CARDS ==================== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: spacing.xxl,
        }}
      >
        {/* Produk Tersedia */}
        <Paper
          sx={{
            ...statCardSx,
            borderRadius: radii.s,
            p: spacing.xxl,
            transition: transitions.fast,
            "&:hover": {
              boxShadow: shadows.hover,
              transform: "translateY(-2px)",
            },
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
              <Typography
                sx={{
                  fontSize: typography.caption,
                  color: colors.textMuted,
                  fontWeight: typography.semibold,
                  textTransform: "uppercase",
                }}
              >
                Produk Tersedia
              </Typography>
              <Typography
                sx={{
                  fontWeight: typography.bold,
                  fontSize: typography.h3,
                  color: colors.text,
                }}
              >
                {stats.totalProduk}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Total Batch */}
        <Paper
          sx={{
            ...statCardSx,
            borderRadius: radii.s,
            p: spacing.xxl,
            transition: transitions.fast,
            "&:hover": {
              boxShadow: shadows.hover,
              transform: "translateY(-2px)",
            },
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
              <Typography
                sx={{
                  fontSize: typography.caption,
                  color: colors.textMuted,
                  fontWeight: typography.semibold,
                  textTransform: "uppercase",
                }}
              >
                Total Batch
              </Typography>
              <Typography
                sx={{
                  fontWeight: typography.bold,
                  fontSize: typography.h3,
                  color: colors.text,
                }}
              >
                {stats.totalBatch}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Hampir Expired */}
        <Paper
          sx={{
            ...statCardSx,
            borderRadius: radii.s,
            p: spacing.xxl,
            transition: transitions.fast,
            "&:hover": {
              boxShadow: shadows.hover,
              transform: "translateY(-2px)",
            },
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
              <Typography
                sx={{
                  fontSize: typography.caption,
                  color: colors.textMuted,
                  fontWeight: typography.semibold,
                  textTransform: "uppercase",
                }}
              >
                Hampir Expired
              </Typography>
              <Typography
                sx={{
                  fontWeight: typography.bold,
                  fontSize: typography.h3,
                  color: colors.warning,
                }}
              >
                {stats.nearExpired}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Expired */}
        <Paper
          sx={{
            ...statCardSx,
            borderRadius: radii.s,
            p: spacing.xxl,
            transition: transitions.fast,
            "&:hover": {
              boxShadow: shadows.hover,
              transform: "translateY(-2px)",
            },
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
              <Typography
                sx={{
                  fontSize: typography.caption,
                  color: colors.textMuted,
                  fontWeight: typography.semibold,
                  textTransform: "uppercase",
                }}
              >
                Expired
              </Typography>
              <Typography
                sx={{
                  fontWeight: typography.bold,
                  fontSize: typography.h3,
                  color: colors.danger,
                }}
              >
                {stats.expired}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* ==================== SEARCH ==================== */}
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
            borderRadius: radii.s,
            bgcolor: colors.bgCard,
            fontSize: typography.body,
            "& fieldset": { borderColor: colors.border },
            "&:hover fieldset": { borderColor: colors.borderHover },
            "&.Mui-focused fieldset": { borderColor: colors.primary },
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

      {/* ==================== TABLE ==================== */}
      <Paper
        sx={{
          borderRadius: radii.s,
          border: `1px solid ${colors.borderLight}`,
          overflow: "hidden",
          boxShadow: shadows.card,
        }}
      >
        {filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <InventoryIcon
              sx={{ fontSize: 48, color: colors.textMuted, mb: 2 }}
            />
            <Typography
              sx={{
                fontWeight: typography.semibold,
                color: colors.text,
                mb: 1,
                fontSize: typography.bodyLg,
              }}
            >
              Tidak ada produk dengan stok tersedia
            </Typography>
            <Typography
              sx={{ fontSize: typography.body, color: colors.textMuted }}
            >
              Stok akan muncul setelah penerimaan faktur pembelian.
            </Typography>
          </Box>
        ) : (
          <>
            <ProductStokTable
              products={paginatedProducts}
              onDetailClick={setSelectedProduct}
            />

            <Box
              sx={{
                px: spacing.xxl,
                py: spacing.lg,
                borderTop: `1px solid ${colors.borderLight}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                bgcolor: colors.bgMuted,
              }}
            >
              <Typography
                sx={{ fontSize: typography.body, color: colors.textMuted }}
              >
                Menampilkan {totalProducts === 0 ? 0 : (page - 1) * PageSize + 1}
                –{Math.min(page * PageSize, totalProducts)} dari{" "}
                {totalProducts} produk
              </Typography>
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
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