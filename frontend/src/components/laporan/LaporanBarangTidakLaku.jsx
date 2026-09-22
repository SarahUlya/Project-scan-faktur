import React, { useState, useMemo } from "react";
import { Box, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";
import useLaporanTransaksi from "../../hooks/useLaporanTransaksi";
import usePosProducts from "../../hooks/usePosProducts";
import { colors, radii, typography, spacing } from "@/theme/designTokens";

const LaporanBarangTidakLaku = () => {
  const {
    getProdukTidakLaku,
    hari,
    setHari,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useLaporanTransaksi();
  const { produk } = usePosProducts();

  const data = useMemo(() => {
    const list = getProdukTidakLaku(produk);
    return list.map((p, i) => {
      const terakhir =
        p.terakhirTerjual === "-" ? null : new Date(p.terakhirTerjual);
      const durasi = terakhir
        ? Math.max(
            0,
            Math.ceil(
              (Date.now() - terakhir.getTime()) / (1000 * 60 * 60 * 24)
            )
          )
        : "-";

      return {
        id: i + 1,
        nama: p.nama,
        kategori: p.kategori,
        stok: p.stok,
        terakhir: p.terakhirTerjual,
        durasi,
      };
    });
  }, [produk, getProdukTidakLaku]);

  const pagedData = data;

  const columns = [
    {
      header: "NAMA PRODUK",
      accessor: "nama",
      render: (row) => (
        <Typography
          sx={{
            fontWeight: typography.bold,
            color: colors.text,
            fontSize: typography.bodyLg,
          }}
        >
          {row.nama}
        </Typography>
      ),
    },
    {
      header: "KATEGORI",
      accessor: "kategori",
      render: (row) => (
        <Typography
          sx={{ color: colors.textSecondary, fontSize: typography.body }}
        >
          {row.kategori}
        </Typography>
      ),
    },
    {
      header: "STOK SAAT INI",
      accessor: "stok",
      render: (row) => (
        <Typography
          sx={{
            fontWeight: typography.bold,
            color: colors.text,
            fontSize: typography.bodyLg,
          }}
        >
          {row.stok}{" "}
          <Box
            component="span"
            sx={{
              fontWeight: typography.semibold,
              color: colors.textSecondary,
              fontSize: typography.body,
            }}
          >
            Unit
          </Box>
        </Typography>
      ),
      align: "center",
    },
    {
      header: "PENJUALAN TERAKHIR",
      accessor: "terakhir",
      render: (row) => {
        if (!row.terakhir || row.terakhir === "-") {
          return (
            <Typography
              sx={{ color: colors.textSecondary, fontSize: typography.body }}
            >
              -
            </Typography>
          );
        }
        return (
          <Typography sx={{ color: colors.text, fontSize: typography.body }}>
            {new Date(row.terakhir).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        );
      },
      align: "center",
    },
    {
      header: "DURASI TIDAK LAKU",
      accessor: "durasi",
      render: (row) => (
        <Box
          sx={{
            bgcolor: colors.dangerLight,
            color: colors.danger,
            px: spacing.md,
            py: 0.5,
            borderRadius: radii.xs,
            display: "inline-block",
            fontWeight: typography.bold,
            fontSize: typography.body,
          }}
        >
          {typeof row.durasi === "number" ? `${row.durasi} Hari` : row.durasi}
        </Box>
      ),
      align: "right",
    },
  ];

  return (
    <>
      <Box sx={{ mb: spacing.xl }}>
        <ToggleButtonGroup
          value={hari}
          exclusive
          onChange={(_, value) => {
            if (value !== null) {
              setHari(value);
              setCurrentPage(1);
            }
          }}
          sx={{
            bgcolor: colors.bgMuted,
            p: 0.5,
            borderRadius: radii.s,
            border: "none",
            gap: "4px",
            "& .MuiToggleButtonGroup-grouped": {
              border: "none !important",
              borderRadius: `${radii.s}px !important`,
            },
            "& .MuiToggleButton-root": {
              px: spacing.lg,
              py: 0.6,
              height: 34,
              textTransform: "none",
              fontSize: typography.body,
              fontWeight: typography.semibold,
              color: colors.textSecondary,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: colors.bgCard,
                color: colors.text,
              },
            },
            "& .Mui-selected": {
              bgcolor: `${colors.bgCard} !important`,
              color: `${colors.primary} !important`,
              boxShadow: shadows.card,
              fontWeight: typography.bold,
            },
          }}
        >
          <ToggleButton value={7}>7 Hari</ToggleButton>
          <ToggleButton value={30}>30 Hari</ToggleButton>
          <ToggleButton value={60}>60 Hari</ToggleButton>
          <ToggleButton value={90}>90 Hari</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Table columns={columns} data={pagedData} />

      <Box
        sx={{
          p: `${spacing.xl}px ${spacing.xxl}px`,
          borderTop: `1px solid ${colors.border}`,
          color: colors.textSecondary,
          fontSize: typography.body,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: typography.body }}>
          Menampilkan {pagedData.length} dari {data.length} item tidak laku
        </Typography>
        <PaginationControls
          page={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      </Box>
    </>
  );
};

export default LaporanBarangTidakLaku;