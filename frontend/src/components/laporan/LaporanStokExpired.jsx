import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";

const PAGE_SIZE = 25;

const mockStok = [
  { id: 1, nama: "Paracetamol 500mg", type: "Tablet • Kimia Farma", batch: "BCH-2023-012", exp: "2024-01-12", stok: 45, status: "EXPIRED" },
  { id: 2, nama: "Amoxicillin 250mg", type: "Sirup • Dexa Medica", batch: "BCH-2023-055", exp: "2024-04-15", stok: 12, status: "PERINGATAN" },
  { id: 3, nama: "Vitamin C 1000mg", type: "Suplemen • Sidomuncul", batch: "BCH-2024-102", exp: "2025-12-22", stok: 120, status: "AMAN" },
  { id: 4, nama: "Ibuprofen 400mg", type: "Kapsul • Phapros", batch: "BCH-2023-098", exp: "2024-02-05", stok: 8, status: "EXPIRED" },
  { id: 5, nama: "Betadine Solution", type: "Antiseptik • Mundipharma", batch: "BCH-2024-001", exp: "2024-06-30", stok: 32, status: "PERINGATAN" },
];

const LaporanStokExpired = () => {
  const [page, setPage] = useState(1);
  const data = mockStok;
  
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { 
      header: "NAMA PRODUK", 
      accessor: "nama",
      render: (row) => (
        <Box>
            <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>{row.nama}</Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: 12 }}>{row.type}</Typography>
        </Box>
      )
    },
    { 
      header: "KODE BATCH", 
      accessor: "batch",
      render: (row) => (
        <Typography sx={{ color: '#64748B', fontSize: 14, fontWeight: 500 }}>{row.batch}</Typography>
      )
    },
    { 
      header: "TANGGAL KADALUARSA", 
      accessor: "exp",
      render: (row) => (
        <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: 14 }}>
          {new Date(row.exp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
        </Typography>
      )
    },
    { 
      header: "SISA STOK", 
      accessor: "stok",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>
          {row.stok}
        </Typography>
      ),
      align: 'center'
    },
    { 
      header: "STATUS", 
      accessor: "status",
      render: (row) => {
        let bg = '#F1F5F9', color = '#64748B';
        if (row.status === 'EXPIRED') { bg = '#BE185D'; color = '#FFFFFF'; }
        if (row.status === 'PERINGATAN') { bg = '#F9A8D4'; color = '#BE185D'; } // Pink bg, dark pink text

        return (
          <span style={{ 
            background: bg, 
            color: color,
            padding: '4px 12px',
            borderRadius: 16,
            fontSize: 10,
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
        <div>Menampilkan {pagedData.length} dari {data.length} item stok</div>
        <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </Box>
  );
};

export default LaporanStokExpired;
