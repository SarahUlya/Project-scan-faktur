import React, { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PrintIcon from "@mui/icons-material/Print";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
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
  zIndex,
  fieldInputSx,
  pageHeaderSx,
  statCardSx,
} from "@/theme/designTokens";
import LaporanPenjualan from "../components/laporan/LaporanPenjualan";
import LaporanProdukTerlaris from "../components/laporan/LaporanProdukTerlaris";
import LaporanBarangTidakLaku from "../components/laporan/LaporanBarangTidakLaku";
import LaporanStokExpired from "../components/laporan/LaporanStokExpired";
import useLaporanTransaksi from "../hooks/useLaporanTransaksi"; const laporanMenu = [
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
  // {
  //   id: "tidak-laku",
  //   title: "Barang Tidak Laku",
  //   desc: "Dead stock & slow moving",
  //   icon: AssignmentLateOutlinedIcon,
  // },
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
      // case "tidak-laku":
      //   return <LaporanBarangTidakLaku />;
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
  const {
    loading,
    dataPenjualan,
    produkTerlaris,
    barangTidakLaku,
    stokExpired,
  } = useLaporanTransaksi();
  if (loading) {
    return <LaporanLoadingSkeleton />;
  }
  return (
    <Box
      sx={{ minHeight: "100vh", background: "#F1F5F9", px: 3, pt: 3, pb: 4 }}
    >
      <Box
        sx={{
          background: colors.bgCard,
          borderRadius: 3,
          p: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: typography.title, color: colors.text }}
            >
              Laporan & Rekapitulasi
            </Typography>

            <Typography sx={{ fontSize: typography.body, color: colors.textSecondary, mt: 1 }}>
            Analisis data performa Apotek Ampuh Tayu
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
        {laporanMenu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Card
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 4,
                cursor: "pointer",
                transition: "all 0.2s",
                border: isActive
                  ? "2px solid #D81B60"
                  : "2px solid transparent",
                background: isActive ? "#FCE4EC" : "#fff",
                boxShadow: isActive
                  ? "0 10px 30px rgba(216, 27, 96, 0.1)"
                  : "0 4px 20px rgba(0,0,0,0.03)",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: isActive ? "#F8BBD0" : "#F8FAFC",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? "#D81B60" : "#94A3B8",
                  mb: 2,
                }}
              >
                <Icon />
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  color: isActive ? colors.primary : colors.text,
                  fontSize: 16,
                  mb: 0.5,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: isActive ? colors.textSecondary : colors.text,
                }}
              >
                {item.desc}
              </Typography>
            </Card>
          );
        })}
      </Box>

      {activeTab === "expired" && (
        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          {/* Expired */}
          <Box
            sx={{
              flex: 1,
              background: "#FFF1F2",
              borderRadius: 4,
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              border: "1px solid #FFE4E6",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E11D48",
              }}
            >
              <HighlightOffIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#E11D48",
                }}
              >
                {expiredSummary.expired}
              </Typography>

              <Typography
                sx={{
                  color: "#E11D48",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Produk Expired
              </Typography>
            </Box>
          </Box>

          {/* Warning */}
          <Box
            sx={{
              flex: 1,
              background: "#FFF7ED",
              borderRadius: 4,
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              border: "1px solid #FFEDD5",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F97316",
              }}
            >
              <WarningAmberIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#F97316",
                }}
              >
                {expiredSummary.warning}
              </Typography>

              <Typography
                sx={{
                  color: colors.warning,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Produk Mendekati Expired
              </Typography>
            </Box>
          </Box>

          {/* Aman */}
          <Box
            sx={{
              flex: 1,
              background: "#F0FDF4",
              borderRadius: 4,
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              border: "1px solid #BBF7D0",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#fff",
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
                  fontSize: 24,
                  fontWeight: 900,
                  color: colors.suce,
                }}
              >
                {expiredSummary.aman}
              </Typography>

              <Typography
                sx={{
                  color: colors.success,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Produk Aman
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          background: "#fff",
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            borderBottom: "1px solid #F1F5F9",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                background: "#FCE4EC",
                color: "#D81B60",
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 0.5,
              }}
            >
              PREVIEW
            </Box>
            <Box>
              <Typography
                sx={{ fontWeight: 800, fontSize: 18, color: "#1E293B" }}
              >
                Preview Laporan {getActiveTitle()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            {activeTab === "expired" ? (
              <>
              </>
            ) : (
              <>
              </>
            )}
          </Box>
        </Box>
        <Box>{renderContent()}</Box>
      </Box>
    </Box>
  );
};

export default LaporanPage;
