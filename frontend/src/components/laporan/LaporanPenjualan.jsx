import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";

const PAGE_SIZE = 25;

// Mock Data
const mockPenjualan = [
  { id: 1, tanggal: "2024-01-31", noFaktur: "INV/20240131/042", itemTerjual: "Paracetamol (2), Vitamin C (1)", total: 45000, metode: "Tunai", status: "Sukses" },
  { id: 2, tanggal: "2024-01-31", noFaktur: "INV/20240131/041", itemTerjual: "Amoxicillin Syrup (1)", total: 22500, metode: "QRIS", status: "Sukses" },
  { id: 3, tanggal: "2024-01-30", noFaktur: "INV/20240130/089", itemTerjual: "Betadine (1), Masker (10)", total: 38000, metode: "Tunai", status: "Sukses" },
  { id: 4, tanggal: "2024-01-30", noFaktur: "INV/20240130/088", itemTerjual: "Ibuprofen (3)", total: 15000, metode: "Transfer", status: "Dibatalkan" },
  { id: 5, tanggal: "2024-01-29", noFaktur: "INV/20240129/012", itemTerjual: "Vitamin B Complex (1)", total: 12000, metode: "Tunai", status: "Sukses" },
];

const LaporanPenjualan = () => {
  const [page, setPage] = useState(1);
  const data = mockPenjualan; // Replace with actual API data hook later
  
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { 
      header: "TANGGAL", 
      accessor: "tanggal",
      render: (row) => (
        <Typography sx={{ color: '#475569', fontSize: 14 }}>
          {new Date(row.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Typography>
      )
    },
    { 
      header: "NO. FAKTUR", 
      accessor: "noFaktur",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 14 }}>{row.noFaktur}</Typography>
      )
    },
    { 
      header: "ITEM TERJUAL", 
      accessor: "itemTerjual",
      render: (row) => (
        <Typography sx={{ color: '#475569', fontSize: 14 }}>{row.itemTerjual}</Typography>
      )
    },
    { 
      header: "TOTAL TRANSAKSI", 
      accessor: "total",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 14 }}>
          Rp {row.total.toLocaleString('id-ID')}
        </Typography>
      ),
      align: 'center'
    },
    { 
      header: "METODE", 
      accessor: "metode",
      render: (row) => (
        <Typography sx={{ color: '#64748B', fontSize: 14 }}>{row.metode}</Typography>
      ),
      align: 'center'
    },
    { 
      header: "STATUS", 
      accessor: "status",
      render: (row) => {
        const isSukses = row.status === "Sukses";
        return (
          <span style={{ 
            background: isSukses ? '#DCFCE7' : '#FEE2E2', 
            color: isSukses ? '#16A34A' : '#EF4444',
            padding: '4px 12px',
            borderRadius: 16,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.5
          }}>
            {row.status}
          </span>
        )
      },
      align: 'center'
    },
  ];

  return (
    <Box>
      <Table columns={columns} data={pagedData} />
      <div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Menampilkan {pagedData.length} dari {data.length} transaksi</div>
        <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </Box>
  );
};

export default LaporanPenjualan;
