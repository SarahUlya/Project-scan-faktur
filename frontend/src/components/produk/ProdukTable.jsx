import React from "react";
import Table from "../ui/Table";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const getColumns = (
  onViewDetail,
  onEdit,
  onDelete,
  getNamaKategori,
  getNamaSatuan
) => [
    {
      header: "NAMA PRODUK",
      accessor: "nama",
      width: 260,
      bold: true,
      render: (row) => (
        <Box
          sx={{
            opacity: row.is_active ? 1 : 0.55,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: row.is_active ? "#1E293B" : "#94A3B8",
              fontSize: 15,
              textDecoration: row.is_active ? "none" : "line-through",
            }}
          >
            {row.nama || row.nama_produk || row.namaItem}
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              fontSize: 12,
              mt: 0.5,
            }}
          >
            ID: {row.id_produk || row.kodeItem || row.id || "-"}
          </Typography>
        </Box>
      ),
    },

    {
      header: "BARCODE",
      accessor: "barcode",
      width: 180,
      render: (row) => (
        <Typography
          sx={{
            fontSize: 13,
            color: row.is_active ? "#334155" : "#94A3B8",
            opacity: row.is_active ? 1 : 0.6,
          }}
        >
          {row.barcode || row.kode_barcode || "-"}
        </Typography>
      ),
    },

    {
      header: "KATEGORI",
      accessor: "kategoriId",
      width: 180,
      render: (row) => (
        <Typography
          sx={{
            color: row.is_active ? "#334155" : "#94A3B8",
            opacity: row.is_active ? 1 : 0.6,
          }}
        >
          {getNamaKategori(
            row.id_kategori || row.kategoriId || row.kategori
          )}
        </Typography>
      ),
    },

    {
      header: "SATUAN",
      accessor: "satuan",
      width: 120,
      render: (row) => (
        <Typography
          sx={{
            color: row.is_active ? "#334155" : "#94A3B8",
            opacity: row.is_active ? 1 : 0.6,
          }}
        >
          {row.satuan?.nama ||
            getNamaSatuan(row.satuan_id) ||
            "-"}
        </Typography>
      ),
    },

    {
      header: "HARGA JUAL",
      accessor: "hargaJual",
      width: 160,
      align: "right",
      render: (row) => {
        const harga = row.harga_jual || row.hargaJual || 0;

        return (
          <Typography
            sx={{
              fontWeight: 600,
              color: row.is_active ? "#0F172A" : "#94A3B8",
              opacity: row.is_active ? 1 : 0.6,
            }}
          >
            Rp {harga.toLocaleString("id-ID")}
          </Typography>
        );
      },
    },

    {
      header: "STOK MIN",
      accessor: "stokMinimum",
      width: 120,
      align: "center",
      render: (row) => (
        <Typography
          sx={{
            color: row.is_active ? "#0F172A" : "#94A3B8",
            opacity: row.is_active ? 1 : 0.6,
          }}
        >
          {row.stok_minimum || row.stokMinimum || 0}
        </Typography>
      ),
    },

    {
      header: "STATUS",
      accessor: "is_active",
      render: (row) => {
        return (
          <span
            style={{
              background: row.is_active ? "#E6FFF3" : "#F3F6F9",
              color: row.is_active ? "#1BC58D" : "#64748B",
              fontWeight: 700,
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 12,
            }}
          >
            {row.is_active ? "AKTIF" : "NON-AKTIF"}
          </span>
        );
      },
    },

    {
      header: "AKSI",
      accessor: "aksi",
      width: 140,
      align: "center",
      render: (row) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            opacity: row.is_active ? 1 : 0.7,
          }}
        >
          <IconButton
            size="small"
            onClick={() => onEdit && onEdit(row)}
            title="Edit produk"
            sx={{
              color: "#64748B",
              border: "1px solid #F3F6F9",
              bgcolor: "#fff",
              "&:hover": {
                bgcolor: "#f8f4f8",
              },
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() =>
              onDelete && onDelete(row)
            }
            title="Nonaktifkan produk"
            sx={{
              color: "#EF4444",
              border: "1px solid #F3F6F9",
              bgcolor: "#fff",
              "&:hover": {
                bgcolor: "#fee9ee",
              },
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

const ProdukTable = ({
  data,
  onViewDetail,
  onEdit,
  onDelete,
  getNamaKategori,
  getNamaSatuan,
}) => {
  return (
    <Table
      columns={getColumns(
        onViewDetail,
        onEdit,
        onDelete,
        getNamaKategori,
        getNamaSatuan
      )}
      data={data || []}
    />
  );
};

export default ProdukTable;