import React from "react";
import Table from "../ui/Table";
import { IconButton, Box, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  transitions,
} from "@/theme/designTokens";

const columns = [
  {
    header: "NAMA SUPPLIER",
    accessor: "nama",
    width: 220,
    render: (row) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          opacity: row.status === "AKTIF" ? 1 : 0.55,
        }}
      >
        <Box
          sx={{
            bgcolor: colors.primaryLight,
            color: colors.primary,
            fontWeight: 700,
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
          }}
        >
          {row.inisial}
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: row.status === "AKTIF" ? colors.text : colors.textSecondary,
              fontSize: 15,
              textDecoration: row.status === "AKTIF" ? "none" : "line-through",
            }}
          >
            {row.nama}
          </Typography>
          <Typography sx={{ color: colors.textSecondary, fontSize: 12, mt: 0.5 }}>
            ID: {row.id || "-"}
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    header: "NO. TELEPON",
    accessor: "telepon",
    width: 140,
    render: (row) => (
      <Typography
        sx={{
          fontSize: 14,
          color: row.status === "AKTIF" ? colors.text : colors.textSecondary,
          opacity: row.status === "AKTIF" ? 1 : 0.6,
        }}
      >
        {row.telepon}
      </Typography>
    ),
  },
  {
    header: "STATUS",
    accessor: "status",
    width: 50,
    render: (row) => {
      const isActive = row.status === "AKTIF";

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
          opacity: row.status === "AKTIF" ? 1 : 0.7,
        }}
      >
        <IconButton
          size="small"
          onClick={() => row.onEdit && row.onEdit(row)}
          title="Edit supplier"
          sx={{
            color: colors.textSecondary,
            border: "1px solid " + colors.border,
            bgcolor: colors.bgCard,
            "&:hover": { bgcolor: colors.primaryLight, color: colors.primary },
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
];

const SupplierTable = ({ data, onEdit }) => {
  const tableData = data.map((row) => ({ ...row, onEdit }));
  return <Table columns={columns} data={tableData} />;
};

export default SupplierTable;
