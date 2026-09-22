import React, { useMemo, useState, forwardRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";
import useLaporanTransaksi from "../../hooks/useLaporanTransaksi";
import formatCurrency from "../../utils/formatCurrency";
import { colors, radii, typography, spacing } from "@/theme/designTokens";

const PAGE_SIZE = 25;

/* ══════════════════════════════════════════════════════════════════
 * HELPER — Format tanggal
 * ══════════════════════════════════════════════════════════════════ */
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ══════════════════════════════════════════════════════════════════
 * MAIN
 * ══════════════════════════════════════════════════════════════════ */
const LaporanPenjualan = forwardRef((props, ref) => {
  const [page, setPage] = useState(1);
  const { penjualan } = useLaporanTransaksi();

  const data = useMemo(() => {
    return (penjualan || []).map((p) => ({
      ...p,
      itemTerjual: p.itemTerjual || p.item_terjual || p.items || "-",
      metode: p.metode === "TUNAI" ? "Tunai" : p.metode || "-",
      status: p.status || "Sukses",
      total: typeof p.total === "number" ? p.total : Number(p.total) || 0,
    }));
  }, [penjualan]);

  // Reset page saat data berubah
  useEffect(() => {
    setPage(1);
  }, [data.length]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Columns ─────────────────────────────────────────────────── */
  const columns = [
    {
      header: "TANGGAL",
      accessor: "tanggal",
      render: (row) => (
        <Typography
          sx={{ color: colors.textSecondary, fontSize: 13 }}
        >
          {formatDate(row.tanggal)}
        </Typography>
      ),
    },
    {
      header: "NO TRANSAKSI",
      accessor: "noFaktur",
      render: (row) => (
        <Typography
          sx={{
            fontWeight: 600,
            color: colors.text,
            fontSize: 13,
          }}
        >
          {row.noFaktur || "-"}
        </Typography>
      ),
    },
    {
      header: "ITEM TERJUAL",
      accessor: "itemTerjual",
      render: (row) => (
        <Typography
          sx={{ color: colors.textSecondary, fontSize: 13 }}
        >
          {row.itemTerjual || "-"}
        </Typography>
      ),
    },
    {
      header: "TOTAL TRANSAKSI",
      accessor: "total",
      align: "center",
      render: (row) => (
        <Typography
          sx={{
            fontWeight: 600,
            color: colors.text,
            fontSize: 13,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatCurrency(row.total)}
        </Typography>
      ),
    },
    {
      header: "METODE",
      accessor: "metode",
      align: "center",
      render: (row) => (
        <Typography
          sx={{ color: colors.textSecondary, fontSize: 13 }}
        >
          {row.metode || "-"}
        </Typography>
      ),
    },
    {
      header: "STATUS",
      accessor: "status",
      align: "center",
      render: (row) => {
        const isSukses = row.status === "Sukses";
        return (
          <span
            style={{
              background: isSukses
                ? colors.successLight
                : colors.dangerLight,
              color: isSukses ? colors.success : colors.danger,
              padding: "4px 10px",
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            {row.status || "Sukses"}
          </span>
        );
      },
    },
  ];

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <Box>
      <Table columns={columns} data={pagedData} />

      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid " + colors.border,
          color: colors.textSecondary,
          fontSize: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          Menampilkan {pagedData.length} dari {data.length} transaksi
        </div>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </Box>
  );
});

LaporanPenjualan.displayName = "LaporanPenjualan";

export default LaporanPenjualan;