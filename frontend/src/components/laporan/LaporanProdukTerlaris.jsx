import React, { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";
import useLaporanTransaksi from "../../hooks/useLaporanTransaksi";
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  transitions,
} from "@/theme/designTokens";

const PAGE_SIZE = 25;

const LaporanProdukTerlaris = () => {
  const [page, setPage] = useState(1);
  const { produkTerlaris } = useLaporanTransaksi();
  const data = useMemo(
    () =>
      (produkTerlaris || []).map((p, i) => ({
        id: i + 1,
        nama: p.nama || p.nama_produk || "-",
        kategori: p.kategori || p.nama_kategori || "-",
        terjual: Number(p.terjual || p.total_terjual || 0),
        omzet: Number(p.omzet || p.subtotal || 0),
      })),
    [produkTerlaris],
  );

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const maxTerjual =
    data.length > 0 ? Math.max(...data.map((d) => d.terjual)) : 1;

  const columns = [
    {
      header: "RANK",
      accessor: "id",
      render: (row, idx) => (
        <Box
          sx={{
            width: 32,
            height: 32,
            background: colors.primary,
            color: colors.textOnDark,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 13,
          }}
        >
          {(page - 1) * PAGE_SIZE + idx + 1}
        </Box>
      ),
      align: "center",
      width: "80px",
    },
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
      header: "JUMLAH TERJUAL",
      accessor: "terjual",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: colors.text, fontSize: 15 }}>
          {row.terjual.toLocaleString("id-ID")}
        </Typography>
      ),
      align: "center",
    },
    {
      header: "TOTAL OMZET",
      accessor: "omzet",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: colors.text, fontSize: 15 }}>
          Rp {row.omzet.toLocaleString("id-ID")}
        </Typography>
      ),
      align: "right",
    },
  ];

  return (
    <Box>
      {/* Visualisasi Bar Chart */}
      <Box sx={{ px: 3, py: 3, borderBottom: "2px solid " + colors.border }}>
        <Typography
          sx={{
            color: colors.textSecondary,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 1,
            mb: 3,
          }}
        >
          VISUALISASI TOP 5 PRODUK
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {data.slice(0, 5).map((item, idx) => {
            const widthPercent =
              maxTerjual > 0 ? (item.terjual / maxTerjual) * 100 : 0;
            return (
              <Box key={idx} sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 800, color: colors.text, fontSize: 13 }}
                  >
                    {item.nama}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 800, color: colors.danger, fontSize: 13 }}
                  >
                    {item.terjual.toLocaleString("id-ID")} Sold
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    background: colors.bgMuted,
                    borderRadius: 4,
                    height: 8,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${widthPercent}%`,
                      background: colors.primary,
                      height: "100%",
                      borderRadius: 4,
                    }}
                  ></Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Tabel */}
      <Table columns={columns} data={pagedData} />
      <div
        style={{
          padding: "20px 24px",
          borderTop: "1px solid " + colors.border,
          color: colors.textSecondary,
          fontSize: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          Menampilkan {pagedData.length} dari {data.length} produk terjual
        </div>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </Box>
  );
};

export default LaporanProdukTerlaris;
