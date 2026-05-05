import React from "react";
import Table from "../ui/Table";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const getColumns = (onViewDetail, onEdit, onDelete, getNamaKategori) => [
  {
    header: "NAMA PRODUK",
    accessor: "nama",
    width: 280,
    bold: true,
    render: (row) => (
      <Box>
        <Typography sx={{ fontWeight: 700, color: "#1E293B", fontSize: 15 }}>
          {row.nama || row.namaItem}
        </Typography>
        <Typography sx={{ color: "#94A3B8", fontSize: 12, mt: 0.5 }}>
          ID: {row.kodeItem || row.id || "-"}
        </Typography>
      </Box>
    )
  },
  {
    header: "KATEGORI OBAT",
    accessor: "kategoriId",
    width: 180,
    render: (row) => getNamaKategori(row.id_kategori || row.kategoriId || row.kategori)
  },
  { header: "SATUAN DASAR", accessor: "satuan", width: 140 },
  { header: "STOK MINIMUM", accessor: "stokMinimum", width: 140, align: "center" },
  {
    header: "STATUS PRODUK",
    accessor: "status",
    width: 120,
    render: (row) => {
      const active = row.status === "AKTIF" || row.status === "Aktif";
      return (
        <span style={{
          background: active ? "#E6FFF3" : "#F3F6F9",
          color: active ? "#1BC58D" : "#64748B",
          fontWeight: 700,
          fontSize: 13,
          borderRadius: 999,
          padding: "8px 14px",
          display: "inline-flex"
        }}>
          {active ? "AKTIF" : "NON-AKTIF"}
        </span>
      );
    }
  },
  {
    header: "AKSI",
    accessor: "aksi",
    width: 140,
    align: "center",
    render: (row) => (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => onEdit && onEdit(row)}
          title="Edit produk"
          sx={{
            color: "#64748B",
            border: "1px solid #F3F6F9",
            bgcolor: "#fff",
            '&:hover': { bgcolor: "#f8f4f8" },
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete && onDelete(row.id)}
          title="Hapus produk"
          sx={{
            color: "#EF4444",
            border: "1px solid #F3F6F9",
            bgcolor: "#fff",
            '&:hover': { bgcolor: "#fee9ee" },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    )
  }
];

const ProdukTable = ({ data, onViewDetail, onEdit, onDelete, getNamaKategori }) => {
  return (
    <Table columns={getColumns(onViewDetail, onEdit, onDelete, getNamaKategori)} data={data || []} />
  );
};

export default ProdukTable;
