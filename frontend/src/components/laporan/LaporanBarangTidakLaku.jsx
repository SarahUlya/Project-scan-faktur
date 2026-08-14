import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";
import useLaporanTransaksi from "../../hooks/useLaporanTransaksi";
import usePosProducts from "../../hooks/usePosProducts";
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  transitions,
} from "@/theme/designTokens";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";


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
            (Date.now() - terakhir.getTime()) / (1000 * 60 * 60 * 24),
          ),
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
        <Typography sx={{ fontWeight: 800, color: colors.text, fontSize: 15 }}>
          {row.nama}
        </Typography>
      ),
    },
    {
      header: "KATEGORI",
      accessor: "kategori",
      render: (row) => (
        <Typography sx={{ color: colors.textSecondary, fontSize: 14 }}>
          {row.kategori}
        </Typography>
      ),
    },
    {
      header: "STOK SAAT INI",
      accessor: "stok",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: colors.text, fontSize: 15 }}>
          {row.stok}{" "}
          <span style={{ fontWeight: 600, color: colors.textSecondary, fontSize: 13 }}>
            Unit
          </span>
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
            <Typography sx={{ color: colors.textSecondary, fontSize: 14 }}>-</Typography>
          );
        }
        return (
          <Typography sx={{ color: colors.text, fontSize: 14 }}>
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
            background: colors.dangerLight,
            color: colors.danger,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            display: "inline-block",
            fontWeight: 800,
            fontSize: 13,
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
      <Box sx={{ mb: 2.5 }}>
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
            backgroundColor: "#F1F5F9",
            p: 0.5,
            borderRadius: "12px",
            border: "none",
            gap: "4px",

            "& .MuiToggleButtonGroup-grouped": {
              border: "none !important",
              borderRadius: "8px !important",
            },

            "& .MuiToggleButton-root": {
              px: 2,
              py: 0.6,
              height: 34,
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              color: "#64748B",
              transition: "all 0.2s ease-in-out",

              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                color: "#1E293B",
              },
            },

            "& .Mui-selected": {
              backgroundColor: "#FFFFFF !important", 
              color: "#E11D48 !important", 
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.06)",
              fontWeight: 700,
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
          padding: "20px 24px",
          borderTop: `1px solid ${colors.border}`,
          color: colors.textSecondary,
          fontSize: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2">
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
