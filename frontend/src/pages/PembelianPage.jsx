import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FakturTable from "../components/pembelian/FakturTable";
import PaginationControls from "../components/ui/PaginationControls";
import Button from "../components/ui/Button";
import PembelianLoadingSkeleton from "../components/pembelian/PembelianLoadingSkeleton";
import usePembelianDb from "../hooks/usePembelianDb";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Skeleton,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  statCardSx,
  pageHeaderSx,
} from "@/theme/designTokens";

const PAGE_SIZE = 10;

const PembelianPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const {
    pembelian = [],
    loading,
    total = 0,
    totalPages = 1,
    loadPembelian,
  } = usePembelianDb();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadPembelian(page, debouncedSearch);
  }, [page, debouncedSearch, loadPembelian]);

  const totalPembelian = useMemo(
    () => pembelian.reduce((acc, curr) => acc + Number(curr.total || 0), 0),
    [pembelian]
  );

  const lunas = useMemo(
    () => pembelian.filter((p) => p.status?.toUpperCase() === "LUNAS").length,
    [pembelian]
  );

  const belumBayar = useMemo(
    () => pembelian.filter((p) => p.status?.toUpperCase() !== "LUNAS").length,
    [pembelian]
  );

  const stats = [
    {
      label: "Total Faktur",
      value: loading ? <Skeleton width={40} /> : total,
      subtitle: "Seluruh invoice",
      color: colors.primary,
      bg: colors.primaryLight,
      icon: <ReceiptLongOutlinedIcon />,
    },
    {
      label: "Nilai Pembelian",
      value: loading ? (
        <Skeleton width={80} />
      ) : (
        `Rp ${totalPembelian.toLocaleString("id-ID")}`
      ),
      subtitle: "Total transaksi",
      color: colors.blue,
      bg: colors.blue + "20",
      icon: <PaymentsOutlinedIcon />,
    },
    {
      label: "Sudah Lunas",
      value: loading ? <Skeleton width={40} /> : lunas,
      subtitle: "Pembayaran selesai",
      color: colors.success,
      bg: colors.successLight,
      icon: <CheckCircleOutlineOutlinedIcon />,
    },
    {
      label: "Belum Bayar",
      value: loading ? <Skeleton width={40} /> : belumBayar,
      subtitle: "Perlu pembayaran",
      color: colors.danger,
      bg: colors.dangerLight,
      icon: <PendingActionsOutlinedIcon />,
    },
  ];

  if (loading && pembelian.length === 0) {
    return <PembelianLoadingSkeleton />;
  }

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
          <Typography sx={pageHeaderSx.title}>
            Daftar Faktur Pembelian
          </Typography>
          <Typography
            sx={{ ...pageHeaderSx.subtitle, fontSize: typography.body }}
          >
            Pantau seluruh faktur pembelian, status pembayaran, dan total
            transaksi.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: spacing.lg, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Cari no. faktur / supplier..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: colors.textMuted, fontSize: 18 }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 260,
              "& .MuiOutlinedInput-root": {
                bgcolor: colors.bgMuted,
                borderRadius: radii.s,
                fontSize: typography.body,
                height: 44,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.borderHover },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
            }}
          />
          <Button
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/pembelian/tambah")}
            sx={{
              borderRadius: radii.s,
              height: 44,
              px: spacing.xxl,
              fontWeight: typography.bold,
              textTransform: "none",
              bgcolor: colors.primary,
              color: colors.textOnDark,
              boxShadow: "none",
              "&:hover": {
                bgcolor: colors.primaryHover,
                boxShadow: "none",
              },
            }}
          >
            Tambah Faktur
          </Button>
        </Box>
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
        {stats.map((s) => (
          <Box
            key={s.label}
            sx={{
              ...statCardSx,
              p: spacing.xxl,
              borderRadius: radii.s,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: typography.caption,
                  fontWeight: typography.bold,
                  color: s.color,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                {s.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.h3,
                  fontWeight: typography.bold,
                  color: colors.text,
                  mt: 0.5,
                }}
              >
                {s.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.caption,
                  color: colors.textMuted,
                  mt: 0.5,
                }}
              >
                {s.subtitle}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: radii.xs,
                bgcolor: s.bg,
                color: s.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& svg": { fontSize: 24 },
              }}
            >
              {s.icon}
            </Box>
          </Box>
        ))}
      </Box>

      {/* ==================== TABLE CARD ==================== */}
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: radii.s,
          border: `1px solid ${colors.borderLight}`,
          boxShadow: shadows.card,
          overflow: "hidden",
        }}
      >
        <FakturTable
          data={pembelian}
          startIndex={(page - 1) * PAGE_SIZE}
          onView={(row) =>
            navigate(`/pembelian/lihat/${encodeURIComponent(row.id)}`)
          }
        />

        <Box
          sx={{
            px: spacing.xxl,
            py: spacing.lg,
            borderTop: `1px solid ${colors.borderLight}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 64,
          }}
        >
          <Typography
            sx={{ fontSize: typography.body, color: colors.textMuted }}
          >
            Menampilkan {pembelian.length} dari {total} faktur
          </Typography>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PembelianPage;