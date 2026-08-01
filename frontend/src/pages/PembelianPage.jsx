import React, { useMemo, useState, useEffect } from "react";
import FakturTable from "../components/pembelian/FakturTable";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePembelianDb from "../hooks/usePembelianDb";
import PaginationControls from "../components/ui/PaginationControls";
import Button from "../components/ui/Button";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
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
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PembelianLoadingSkeleton from "../components/pembelian/PembelianLoadingSkeleton";
const PAGE_SIZE = 25;

const PembelianPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const {
    pembelian = [],
    loading,
    total = 0,
    totalPages = 1,
    loadPembelian,
  } = usePembelianDb();

  useEffect(() => {
    loadPembelian(page);
  }, [page]);
  const totalPembelian = useMemo(
    () => pembelian.reduce((acc, curr) => acc + Number(curr.total || 0), 0),
    [pembelian],
  );

  const lunas = useMemo(
    () => pembelian.filter((p) => p.status?.toUpperCase() === "LUNAS").length,
    [pembelian],
  );

  const belumBayar = useMemo(
    () => pembelian.filter((p) => p.status?.toUpperCase() !== "LUNAS").length,
    [pembelian],
  );

  const stats = [
    {
      label: "Total Faktur",
      value: loading ? <Skeleton width={40} /> : total,
      subtitle: "Seluruh invoice",
      color: colors.primary,
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
      color: colors.info,
      icon: <PaymentsOutlinedIcon />,
    },
    {
      label: "Sudah Lunas",
      value: loading ? <Skeleton width={40} /> : lunas,
      subtitle: "Pembayaran selesai",
      color: colors.success,
      icon: <CheckCircleOutlineOutlinedIcon />,
    },
    {
      label: "Belum Bayar",
      value: loading ? <Skeleton width={40} /> : belumBayar,
      subtitle: "Perlu pembayaran",
      color: colors.danger,
      icon: <PendingActionsOutlinedIcon />,
    },
  ];
    if (loading) {
    return <PembelianLoadingSkeleton />;
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={pageHeaderSx.title}>
            Daftar Faktur Pembelian
          </Typography>
          <Typography sx={pageHeaderSx.subtitle}>
            Manajemen invoice pembelian barang ke supplier
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Cari faktur..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.textMuted, fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: colors.bgCard, width: 240 },
            }}
          />
          <Button
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/pembelian/tambah")}
          >
            Tambah Faktur
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))",
          gap: 2,
          mb: 3,
        }}
      >
        {stats.map((s) => (
          <Box
            key={s.label}
            sx={{
              ...statCardSx,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: s.color,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                {s.label}
              </Typography>

              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: colors.text,
                  mt: 0.5,
                }}
              >
                {s.value}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: colors.textMuted,
                  mt: 0.5,
                }}
              >
                {s.subtitle}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                bgcolor: `${s.color}18`,
                color: s.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                "& svg": {
                  fontSize: 28,
                },
              }}
            >
              {s.icon}
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: 2,
          border: `1px solid ${colors.borderLight}`,
          overflow: "hidden",
        }}
      >
        {
          <>
            <FakturTable
              data={pembelian}
              startIndex={(page - 1) * PAGE_SIZE}
              onView={(row) =>
                navigate(`/pembelian/lihat/${encodeURIComponent(row.id)}`)
              }
            />

            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderTop: `1px solid ${colors.borderLight}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 13, color: colors.textMuted }}>
                Menampilkan {pembelian.length} dari {total} faktur
              </Typography>

              <PaginationControls
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </Box>
          </>
        }
      </Box>
    </Box>
  );
};

export default PembelianPage;
