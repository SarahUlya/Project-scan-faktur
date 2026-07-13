import React from "react";
import Table from "../ui/Table";
import { IconButton, Typography, Box } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { colors } from "../../theme/designTokens";

const checkStatus = (expiredDateStr) => {
  const expiredDate = new Date(expiredDateStr);
  const now = new Date();
  const diffDays = Math.ceil((expiredDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { label: "Expired", color: colors.danger, bg: "#FEE2E2" };
  if (diffDays <= 30) return { label: "Hampir ED", color: colors.warning, bg: "#FEF3C7" };
  return { label: "Aman", color: colors.textSecondary, bg: colors.bgMuted };
};

const BatchTable = ({ produk, onShowDetail }) => {
  const allBatch = produk.flatMap((p) =>
    (p.batch || []).map((b) => ({
      ...b,
      produkId: p.id_produk || p.id,
      namaProduk: p.nama_produk || p.nama || p.namaItem,
      kategori: p.nama_kategori || p.kategori,
      kodeBatch: b.kodeBatch || b.no_batch,
    }))
  );

  const sortedBatch = [...allBatch].sort(
    (a, b) => new Date(a.expired) - new Date(b.expired)
  );

  const columns = [
    {
      header: "Produk",
      accessor: "namaProduk",
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: colors.text }}>{row.namaProduk}</Typography>
          <Typography sx={{ color: colors.textMuted, fontSize: 12 }}>{row.kategori}</Typography>
        </Box>
      ),
    },
    {
      header: "Kode Batch",
      accessor: "kodeBatch",
      render: (row) => (
        <Typography sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: 13, color: colors.primary }}>
          {row.kodeBatch || row.no_batch || "-"}
        </Typography>
      ),
    },
    {
      header: "No. Faktur",
      accessor: "no_faktur",
      render: (row) => (
        <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
          {row.no_faktur || "-"}
        </Typography>
      ),
    },
    {
      header: "Expired",
      accessor: "expired",
      render: (row) => {
        const isExpired = new Date(row.expired) < new Date();
        return (
          <Typography sx={{ fontWeight: isExpired ? 600 : 500, fontSize: 13, color: isExpired ? colors.danger : colors.text }}>
            {new Date(row.expired).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
          </Typography>
        );
      },
    },
    {
      header: "Stok",
      accessor: "stok",
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
          {row.stok} <Typography component="span" sx={{ color: colors.textMuted, fontSize: 12 }}>unit</Typography>
        </Typography>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      align: "center",
      render: (row) => {
        const st = checkStatus(row.expired);
        return (
          <Box component="span" sx={{ bgcolor: st.bg, color: st.color, px: 1.5, py: 0.5, borderRadius: 1, fontSize: 11, fontWeight: 600 }}>
            {st.label}
          </Box>
        );
      },
    },
    {
      header: "",
      accessor: "aksi",
      align: "center",
      render: (row) => (
        <IconButton
          size="small"
          onClick={() => onShowDetail(row)}
          title="Detail batch"
          sx={{ color: colors.textSecondary, border: `1px solid ${colors.borderLight}` }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return <Table columns={columns} data={sortedBatch} />;
};

export default BatchTable;
