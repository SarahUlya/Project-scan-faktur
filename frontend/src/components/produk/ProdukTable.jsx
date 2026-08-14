import React from "react";
import Table from "../ui/Table";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  transitions,
} from "@/theme/designTokens";

const getColumns = (
  onViewDetail,
  onEdit,
  onDelete,
  getNamaKategori,
  getNamaSatuan,
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
            color: row.is_active ? colors.text : colors.textSecondary,
            fontSize: 15,
            textDecoration: row.is_active ? "none" : "line-through",
          }}
        >
          {row.nama || row.nama_produk || row.namaItem}
        </Typography>

        <Typography
          sx={{
            color: row.is_active ? colors.textSecondary : colors.textDisabled,
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
    header: "KATEGORI",
    accessor: "kategoriId",
    width: 180,
    render: (row) => (
      <Typography
        sx={{
          color: row.is_active ? colors.text : colors.textSecondary,
          opacity: row.is_active ? 1 : 0.6,
        }}
      >
        {getNamaKategori(row.id_kategori || row.kategoriId || row.kategori)}
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
          color: row.is_active ? colors.text : colors.textSecondary,
          opacity: row.is_active ? 1 : 0.6,
        }}
      >
        {row.satuan?.nama || getNamaSatuan(row.satuan_id) || "-"}
      </Typography>
    ),
  },

  {
    header: "HARGA JUAL",
    accessor: "hargaJual",
    width: 160,
    align: "right",
    render: (row) => {
      const harga = Number(row.harga_jual || row.hargaJual || 0);

      return (
        <Typography
          sx={{
            fontSize: typography.body,
            fontWeight: typography.semibold,
            color: row.is_active ? colors.text : colors.textMuted,
            opacity: row.is_active ? 1 : 0.6,
            whiteSpace: "nowrap",
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
          color: row.is_active ? colors.text : colors.textSecondary,
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
    width: 70,
    render: (row) => {
      const isActive = row.is_active === true;

      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 2,
            py: 0.35,
            borderRadius: "999px",
            bgcolor: isActive ? colors.successLight : colors.bgLight,
            border: `1px solid ${isActive ? colors.success : colors.border}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: isActive ? colors.success : colors.textSecondary,
            }}
          >
            {isActive ? "Aktif" : "Nonaktif"}
          </Typography>
        </Box>
      );
    },
  },

  {
    header: "DETAIL",
    accessor: "Detail",
    width: 70,
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
            color: colors.textSecondary,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.bgCard,
            "&:hover": {
              bgcolor: colors.primaryLight,
              color: colors.primary,
            },
          }}
        >
          <EditOutlinedIcon fontSize="small" />
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
        getNamaSatuan,
      )}
      data={data || []}
    />
  );
};

export default ProdukTable;
