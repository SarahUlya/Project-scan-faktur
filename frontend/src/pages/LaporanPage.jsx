import React, { useState, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
import Card from "../components/ui/Card";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LaporanLoadingSkeleton from "../components/laporan/LaporanLoadingSkeleton";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  pageHeaderSx,
} from "@/theme/designTokens";
import LaporanPenjualan from "../components/laporan/LaporanPenjualan";
import LaporanProdukTerlaris from "../components/laporan/LaporanProdukTerlaris";
import LaporanBarangTidakLaku from "../components/laporan/LaporanBarangTidakLaku";
import LaporanStokExpired from "../components/laporan/LaporanStokExpired";
import useLaporanTransaksi from "../hooks/useLaporanTransaksi";

const laporanMenu = [
  {
    id: "penjualan",
    title: "Laporan Penjualan",
    desc: "Rekap transaksi dan omzet",
    icon: AssessmentOutlinedIcon,
  },
  {
    id: "terlaris",
    title: "Produk Terlaris",
    desc: "Analisis performa produk",
    icon: TrendingUpOutlinedIcon,
  },
  {
    id: "expired",
    title: "Stok & Expired",
    desc: "Status gudang & kadaluarsa",
    icon: EventBusyOutlinedIcon,
  },
];

const LaporanPage = () => {
  const [activeTab, setActiveTab] = useState("penjualan");
  const stokLaporanRef = useRef(null);
  const [expiredSummary, setExpiredSummary] = useState({
    expired: 0,
    warning: 0,
    aman: 0,
  });

  const renderContent = () => {
    switch (activeTab) {
      case "penjualan":
        return <LaporanPenjualan />;
      case "terlaris":
        return <LaporanProdukTerlaris />;
      case "expired":
        return (
          <LaporanStokExpired
            ref={stokLaporanRef}
            onSummaryChange={setExpiredSummary}
          />
        );
      default:
        return <LaporanPenjualan />;
    }
  };

  const getActiveTitle = () => {
    const active = laporanMenu.find((m) => m.id === activeTab);
    return active ? active.title : "Laporan";
  };

  const { loading } = useLaporanTransaksi();

  if (loading) {
    return <LaporanLoadingSkeleton />;
  }

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
        }}
      >
        <Typography sx={pageHeaderSx.title}>Laporan & Rekapitulasi</Typography>
        <Typography sx={{ ...pageHeaderSx.subtitle, fontSize: typography.body }}>
          Analisis data performa Apotek Ampuh Tayu
        </Typography>
      </Paper>

      {/* ==================== TAB MENU ==================== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: spacing.xxl,
        }}
      >
        {laporanMenu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Box
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              sx={{
                p: spacing.xxl,
                borderRadius: radii.s,
                cursor: "pointer",
                transition: transitions.fast,
                border: isActive
                  ? `2px solid ${colors.primary}`
                  : `2px solid ${colors.borderLight}`,
                bgcolor: isActive ? colors.primaryLight : colors.bgCard,
                boxShadow: isActive ? shadows.hover : shadows.card,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: shadows.hover,
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: isActive ? colors.primaryLight : colors.bgMuted,
                  borderRadius: radii.xs,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? colors.primary : colors.textMuted,
                  mb: spacing.md,
                }}
              >
                <Icon />
              </Box>

              <Typography
                sx={{
                  fontWeight: typography.bold,
                  color: isActive ? colors.primary : colors.text,
                  fontSize: typography.bodyLg,
                  mb: 0.5,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: typography.body,
                  color: colors.textSecondary,
                }}
              >
                {item.desc}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* ==================== EXPIRED SUMMARY CARDS ==================== */}
      {activeTab === "expired" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: spacing.xxl,
          }}
        >
          {/* Expired */}
          <Box
            sx={{
              bgcolor: colors.dangerLight,
              borderRadius: radii.s,
              p: spacing.xxl,
              display: "flex",
              alignItems: "center",
              gap: spacing.md,
              border: `1px solid ${colors.danger}40`,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: colors.bgCard,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.danger,
              }}
            >
              <HighlightOffIcon />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: typography.h3,
                  fontWeight: typography.bold,
                  color: colors.danger,
                }}
              >
                {expiredSummary.expired}
              </Typography>
              <Typography
                sx={{
                  color: colors.danger,
                  fontWeight: typography.bold,
                  fontSize: typography.caption,
                }}
              >
                Produk Expired
              </Typography>
            </Box>
          </Box>

          {/* Warning */}
          <Box
            sx={{
              bgcolor: colors.warningLight,
              borderRadius: radii.s,
              p: spacing.xxl,
              display: "flex",
              alignItems: "center",
              gap: spacing.md,
              border: `1px solid ${colors.warning}40`,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: colors.bgCard,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.warning,
              }}
            >
              <WarningAmberIcon />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: typography.h3,
                  fontWeight: typography.bold,
                  color: colors.warning,
                }}
              >
                {expiredSummary.warning}
              </Typography>
              <Typography
                sx={{
                  color: colors.warning,
                  fontWeight: typography.bold,
                  fontSize: typography.caption,
                }}
              >
                Produk Mendekati Expired
              </Typography>
            </Box>
          </Box>

          {/* Aman */}
          <Box
            sx={{
              bgcolor: colors.successLight,
              borderRadius: radii.s,
              p: spacing.xxl,
              display: "flex",
              alignItems: "center",
              gap: spacing.md,
              border: `1px solid ${colors.success}40`,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: colors.bgCard,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.success,
              }}
            >
              <InfoOutlinedIcon />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: typography.h3,
                  fontWeight: typography.bold,
                  color: colors.success,
                }}
              >
                {expiredSummary.aman}
              </Typography>
              <Typography
                sx={{
                  color: colors.success,
                  fontWeight: typography.bold,
                  fontSize: typography.caption,
                }}
              >
                Produk Aman
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* ==================== PREVIEW CARD ==================== */}
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: radii.s,
          boxShadow: shadows.card,
          border: `1px solid ${colors.borderLight}`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: spacing.xxl,
            borderBottom: `1px solid ${colors.borderLight}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: spacing.md }}>
            <Box
              sx={{
                bgcolor: colors.primaryLight,
                color: colors.primary,
                px: spacing.md,
                py: 0.5,
                borderRadius: radii.xs,
                fontSize: typography.small,
                fontWeight: typography.bold,
                letterSpacing: 0.5,
              }}
            >
              PREVIEW
            </Box>
            <Typography
              sx={{
                fontWeight: typography.bold,
                fontSize: typography.h5,
                color: colors.text,
              }}
            >
              Preview Laporan {getActiveTitle()}
            </Typography>
          </Box>
        </Box>

        <Box>{renderContent()}</Box>
      </Box>
    </Box>
  );
};

export default LaporanPage;