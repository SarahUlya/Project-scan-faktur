import React, { useMemo } from "react";
import { Box, Typography, Paper, Chip, Avatar } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import useLaporanTransaksi from "../hooks/useLaporanTransaksi";
import useProdukDb from "../hooks/useProdukDb";
import useDashboardAlerts from "../hooks/useDashboardAlerts";
import DashboardLoadingSkeleton from "../components/common/DashboardLoadingSkeleton";
import formatCurrency from "../utils/formatCurrency";
import Table from "../components/ui/Table";

const themeColors = {
  primary: "#D81B60",
  primaryLight: "#FFF0F5",
  bgCanvas: "#F8FAFC",
  bgCard: "#FFFFFF",
  border: "#E2E8F0",
  textMain: "#1E293B",
  textMuted: "#64748B",
  successBg: "#E8F5E9",
  successText: "#2E7D32",
  warningBg: "#FFF8E1",
  warningText: "#F57F17",
  dangerBg: "#FFEBEE",
  dangerText: "#C62828",
};

const StatCard = ({ icon, title, value, accent, secondarySub }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: "12px",
      border: `1px solid ${themeColors.border}`,
      bgcolor: themeColors.bgCard,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          color: themeColors.textMuted,
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
          borderRadius: 2,
          bgcolor: themeColors.primaryLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent || themeColors.primary,
        }}
      >
        {icon}
      </Box>
    </Box>
    <Typography
      sx={{
        fontSize: 22,
        fontWeight: 800,
        color: themeColors.textMain,
        mb: secondarySub ? 1 : 0,
        lineHeight: 1.2,
      }}
    >
      {value}
    </Typography>
    {secondarySub && (
      <Box
        sx={{
          pt: 1,
          borderTop: `1px dashed ${themeColors.border}`,
          fontSize: 11,
          color: themeColors.textMuted,
        }}
      >
        {secondarySub}
      </Box>
    )}
  </Paper>
);

const DashboardPage = () => {
  const {
    produkTerlaris = [],
    totalOmzet = 0,
    jumlahTransaksi = 0,
    loading,
  } = useLaporanTransaksi() || {};
  const { produk = [], loading: produkLoading } = useProdukDb() || {};
  const {
    stokMenipisList = [],
    hampirExpiredList = [],
    auditLogs = [],
    leaderboardKasir = [],
    loadingAlerts,
  } = useDashboardAlerts() || {};

  const isLoading = loading || produkLoading || loadingAlerts;

  const totalUnitTerjual = useMemo(() => {
    return (produkTerlaris || []).reduce(
      (sum, item) => sum + Number(item?.total_terjual || 0),
      0,
    );
  }, [produkTerlaris]);

  const topProducts = useMemo(() => {
    return (produkTerlaris || []).slice(0, 5).map((item) => {
      const dataProduk = (produk || []).find(
        (p) => p?.id_produk === item?.id_produk,
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

  const columns = [
    {
      header: "Produk",
      accessor: "name",
      render: (row, idx) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 12,
              fontWeight: 700,
              bgcolor: themeColors.primaryLight,
              color: themeColors.primary,
            }}
          >
            {idx + 1}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: themeColors.textMain,
              }}
            >
              {row?.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: themeColors.textMuted }}>
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
        <Typography sx={{ fontSize: 14, color: themeColors.textMuted }}>
          {row?.type}
        </Typography>
      ),
    },
    {
      header: "Terjual",
      accessor: "sold",
      align: "center",
      render: (row) => (
        <Typography sx={{ fontWeight: 600, color: themeColors.textMain }}>
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
            color:
              (row?.stock || 0) < 10
                ? themeColors.dangerText
                : themeColors.textMuted,
            fontWeight: (row?.stock || 0) < 10 ? 700 : 400,
          }}
        >
          {(row?.stock || 0).toLocaleString()} unit
        </Typography>
      ),
    },
  ];

  if (isLoading) return <DashboardLoadingSkeleton />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F1F5F9",
        px: 3,
        pt: 3,
        pb: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* HEADER / CONTROL CENTER */}
      <Paper
        elevation={0}
        sx={{
          p: 3, // disamakan dengan header Laporan (p: 3)
          borderRadius: 3,
          border: `1px solid ${themeColors.border}`,
          bgcolor: themeColors.bgCard,
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 18,
                color: themeColors.textMain,
              }}
            >
              Dashboard Apotek Ampuh Tayu
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: 13, color: themeColors.textMuted, mt: 1 }}
          >
            Apotek Ampuh Tayu — Sistem Manajemen Ritel & Operasional Farmasi
          </Typography>
        </Box>
      </Paper>

      {/* TIER A: TOP SUMMARY METRIC CARDS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3, // disamakan gap-nya dengan LaporanPage (gap: 3)
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
          accent={themeColors.warningText}
          secondarySub="Faktur tempo < 7 hari"
        />
      </Box>

      {/* TABEL TOP 5 PRODUK TERLARIS */}
      <Box
        sx={{
          bgcolor: themeColors.bgCard,
          borderRadius: 4, // disamakan radiusnya dengan kontainer LaporanPage (borderRadius: 4)
          border: `1px solid ${themeColors.border}`,
          p: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 18,
            mb: 0.5,
            color: themeColors.textMain,
          }}
        >
          Top 5 Produk Terlaris
        </Typography>
        <Typography
          sx={{ fontSize: 13, color: themeColors.textMuted, mb: 2.5 }}
        >
          Performa penjualan produk periode berjalan.
        </Typography>
        {topProducts.length > 0 ? (
          <Table columns={columns} data={topProducts} />
        ) : (
          <Typography
            sx={{ textAlign: "center", py: 5, color: themeColors.textMuted }}
          >
            Belum ada data penjualan.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
