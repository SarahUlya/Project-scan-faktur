import React, { useMemo } from "react";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import useLaporanTransaksi from "../hooks/useLaporanTransaksi";
import useProdukDb from "../hooks/useProdukDb";
import useDashboardAlerts from "../hooks/useDashboardAlerts";
import DashboardLoadingSkeleton from "../components/common/DashboardLoadingSkeleton";
import formatCurrency from "../utils/formatCurrency";
import Table from "../components/ui/Table";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  statCardSx,
  pageHeaderSx,
} from "@/theme/designTokens";

// ==================== STAT CARD COMPONENT ====================
const StatCard = ({ icon, title, value, accent, secondarySub }) => (
  <Paper
    elevation={0}
    sx={{
      ...statCardSx,
      p: spacing.xl,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      transition: transitions.fast,
      "&:hover": {
        boxShadow: shadows.hover,
        transform: "translateY(-2px)",
      },
    }}
  >
    {/* Header: Title + Icon */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 1.5,
      }}
    >
      <Typography
        sx={{
          fontSize: typography.tiny,
          fontWeight: typography.bold,
          color: colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: radii.xs,        // ✅
          bgcolor: colors.primaryLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent || colors.primary,
        }}
      >
        {icon}
      </Box>
    </Box>

    {/* Value */}
    <Typography
      sx={{
        fontSize: typography.h3,
        fontWeight: typography.bold,
        color: colors.text,
        mb: secondarySub ? 1.5 : 0,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      }}
    >
      {value}
    </Typography>

    {/* Secondary Subtitle */}
    {secondarySub && (
      <Box
        sx={{
          pt: 1.5,
          borderTop: `1px dashed ${colors.border}`,
          fontSize: typography.small,
          color: colors.textSecondary,
        }}
      >
        {secondarySub}
      </Box>
    )}
  </Paper>
);

// ==================== DASHBOARD PAGE ====================
const DashboardPage = () => {
  const {
    produkTerlaris = [],
    totalOmzet = 0,
    jumlahTransaksi = 0,
    loading,
  } = useLaporanTransaksi() || {};
  const { produk = [], loading: produkLoading } = useProdukDb() || {};
  const { loadingAlerts } = useDashboardAlerts() || {};

  const isLoading = loading || produkLoading || loadingAlerts;

  const totalUnitTerjual = useMemo(() => {
    return (produkTerlaris || []).reduce(
      (sum, item) => sum + Number(item?.total_terjual || 0),
      0
    );
  }, [produkTerlaris]);

  const topProducts = useMemo(() => {
    return (produkTerlaris || []).slice(0, 5).map((item) => {
      const dataProduk = (produk || []).find(
        (p) => p?.id_produk === item?.id_produk
      );
      return {
        id: item?.id_produk,
        name: item?.nama_produk || "-",
        type: item?.kategori || "-",
        sold: Number(item?.total_terjual || 0),
        stock: Number(dataProduk?.stok || 0),
      };
    });
  }, [produkTerlaris, produk]);

  // ==================== KOLOM TABEL ====================
  const columns = [
    {
      header: "Produk",
      accessor: "name",
      render: (row, idx) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: typography.caption,
              fontWeight: typography.bold,
              bgcolor: colors.primaryLight,
              color: colors.primary,
            }}
          >
            {idx + 1}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: typography.semibold,
                fontSize: typography.body,
                color: colors.text,
                lineHeight: 1.3,
              }}
            >
              {row?.name}
            </Typography>
            <Typography
              sx={{
                fontSize: typography.small,
                color: colors.textSecondary,
                lineHeight: 1.3,
              }}
            >
              {row?.type}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      header: "Kategori",
      accessor: "type",
      render: (row) => (
        <Typography sx={{ fontSize: typography.body, color: colors.textSecondary }}>
          {row?.type}
        </Typography>
      ),
    },
    {
      header: "Terjual",
      accessor: "sold",
      align: "center",
      render: (row) => (
        <Typography
          sx={{
            fontWeight: typography.semibold,
            fontSize: typography.body,
            color: colors.text,
          }}
        >
          {(row?.sold || 0).toLocaleString()} unit
        </Typography>
      ),
    },
    {
      header: "Sisa Stok",
      accessor: "stock",
      align: "center",
      render: (row) => (
        <Typography
          sx={{
            color: (row?.stock || 0) < 10 ? colors.danger : colors.textSecondary,
            fontWeight: (row?.stock || 0) < 10 ? typography.bold : typography.regular,
            fontSize: typography.body,
          }}
        >
          {(row?.stock || 0).toLocaleString()} unit
        </Typography>
      ),
    },
  ];

  if (isLoading) return <DashboardLoadingSkeleton />;

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
          borderRadius: radii.s,          // ✅
          border: `1px solid ${colors.borderLight}`,
          bgcolor: colors.bgCard,
          boxShadow: shadows.card,
        }}
      >
        <Typography sx={pageHeaderSx.title}>
          Dashboard Apotek Ampuh Tayu
        </Typography>
        <Typography sx={{ ...pageHeaderSx.subtitle, fontSize: typography.body }}>
          Apotek Ampuh Tayu — Sistem Manajemen Ritel & Operasional Farmasi
        </Typography>
      </Paper>

      {/* ==================== SUMMARY CARDS ==================== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: spacing.xxl,
          width: "100%",
        }}
      >
        <StatCard
          icon={<AccountBalanceWalletOutlinedIcon />}
          title="Omzet Hari Ini"
          value={formatCurrency(totalOmzet ?? 0)}
          secondarySub="Pencatatan real-time tanggal hari ini"
        />
        <StatCard
          icon={<ReceiptLongOutlinedIcon />}
          title="Transaksi Selesai"
          value={(jumlahTransaksi ?? 0).toLocaleString() + " Trx"}
          secondarySub={`Total ${totalUnitTerjual.toLocaleString()} unit obat`}
        />
        <StatCard
          icon={<AssignmentOutlinedIcon />}
          title="Piutang & Tempo"
          value="Monitoring Aktif"
          accent={colors.warning}
          secondarySub="Faktur tempo < 7 hari"
        />
      </Box>

      {/* ==================== TOP 5 PRODUK TERLARIS ==================== */}
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: radii.s,          // ✅
          border: `1px solid ${colors.borderLight}`,
          p: spacing.xxl,
          boxShadow: shadows.card,
        }}
      >
        <Typography
          sx={{
            fontWeight: typography.bold,
            fontSize: typography.h5,
            mb: 0.5,
            color: colors.text,
          }}
        >
          Top 5 Produk Terlaris
        </Typography>
        <Typography
          sx={{
            fontSize: typography.body,
            color: colors.textSecondary,
            mb: spacing.xxl,
          }}
        >
          Performa penjualan produk periode berjalan.
        </Typography>

        {topProducts.length > 0 ? (
          <Table columns={columns} data={topProducts} />
        ) : (
          <Typography
            sx={{
              textAlign: "center",
              py: 5,
              color: colors.textMuted,
              fontSize: typography.body,
            }}
          >
            Belum ada data penjualan.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;