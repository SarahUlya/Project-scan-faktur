import React from "react";
import Table from "../ui/Table";
import { IconButton, Box, Typography } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const columns = [
  {
    header: "NAMA SUPPLIER",
    accessor: "nama",
    width: 220,
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, opacity: row.status === "AKTIF" ? 1 : 0.55 }}>
        <Box sx={{ background: "#CCFBF1", color: "#0F766E", fontWeight: 700, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
          {row.inisial}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, color: row.status === "AKTIF" ? "#1E293B" : "#94A3B8", fontSize: 15, textDecoration: row.status === "AKTIF" ? "none" : "line-through" }}>
            {row.nama}
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: 12, mt: 0.5 }}>
            ID: {row.id || "-"}
          </Typography>
        </Box>
      </Box>
    )
  },
  {
    header: "PENANGGUNG JAWAB",
    accessor: "penanggungJawab",
    width: 160,
    render: (row) => (
      <Typography sx={{ fontSize: 14, color: row.status === "AKTIF" ? "#334155" : "#94A3B8", opacity: row.status === "AKTIF" ? 1 : 0.6 }}>
        {row.penanggungJawab}
      </Typography>
    )
  },
  {
    header: "NO. TELEPON",
    accessor: "telepon",
    width: 140,
    render: (row) => (
      <Typography sx={{ fontSize: 14, color: row.status === "AKTIF" ? "#334155" : "#94A3B8", opacity: row.status === "AKTIF" ? 1 : 0.6 }}>
        {row.telepon}
      </Typography>
    )
  },
  {
    header: "ALAMAT",
    accessor: "alamat",
    width: 200,
    render: (row) => (
      <Typography sx={{ fontSize: 14, color: row.status === "AKTIF" ? "#334155" : "#94A3B8", opacity: row.status === "AKTIF" ? 1 : 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {row.alamat}
      </Typography>
    )
  },
  {
    header: "STATUS",
    accessor: "status",
    width: 120,
    render: (row) => {
      const isActive = row.status === "AKTIF";
      return (
        <span
          style={{
            background: isActive ? "#E6FFF3" : "#F3F6F9",
            color: isActive ? "#1BC58D" : "#64748B",
            fontWeight: 700,
            borderRadius: 999,
            padding: "6px 12px",
            fontSize: 12,
          }}
        >
          {isActive ? "AKTIF" : "NON-AKTIF"}
        </span>
      );
    }
  },
  {
    header: "AKSI",
    accessor: "aksi",
    width: 100,
    align: "center",
    render: (row) => (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, opacity: row.status === "AKTIF" ? 1 : 0.7 }}>
        <IconButton
          size="small"
          onClick={() => row.onEdit && row.onEdit(row)}
          title="Edit supplier"
          sx={{
            color: "#64748B",
            border: "1px solid #F3F6F9",
            bgcolor: "#fff",
            '&:hover': { bgcolor: "#f8f4f8" },
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    )
  }
];

const SupplierTable = ({ data, onEdit }) => {
  const tableData = data.map((row) => ({ ...row, onEdit }));
  return <Table columns={columns} data={tableData} />;
};

export default SupplierTable;
