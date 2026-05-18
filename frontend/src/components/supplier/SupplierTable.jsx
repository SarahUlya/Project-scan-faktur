import React from "react";
import Table from "../ui/Table";
import { IconButton, Box } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const getStatus = (status) => {
  if (status === "AKTIF") return { label: "AKTIF", color: "#1BC58D", bg: "#E6FFF3" };
  return { label: "NONAKTIF", color: "#B0B0B0", bg: "#F3F6F9" };
};

const columns = [
  {
    header: "NAMA SUPPLIER",
    accessor: "nama",
    width: 180,
    render: (row) => (
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ background: "#FCE7F3", color: "#E91E63", fontWeight: 700, borderRadius: "50%", width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{row.inisial}</span>
        <span style={{ fontWeight: 700 }}>{row.nama}</span>
      </span>
    )
  },
  { header: "PENANGGUNG JAWAB", accessor: "penanggungJawab", width: 120 },
  { header: "NO. TELEPON", accessor: "telepon", width: 120 },
  { header: "ALAMAT", accessor: "alamat", width: 180 },
  {
    header: "STATUS",
    accessor: "status",
    width: 80,
    render: (row) => {
      const s = getStatus(row.status);
      return <span style={{ background: s.bg, color: s.color, fontWeight: 700, fontSize: 13, borderRadius: 8, padding: "2px 12px" }}>{s.label}</span>;
    }
  },
  {
    header: "AKSI",
    accessor: "aksi",
    width: 80,
    render: (row) => (
      <Box sx={{ display: "flex", gap: 1 }}>
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
