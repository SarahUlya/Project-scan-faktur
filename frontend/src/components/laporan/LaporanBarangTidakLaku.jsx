import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";

const PAGE_SIZE = 25;

const mockTidakLaku = [
  { id: 1, nama: "Salep Kulit 88 5gr", kategori: "Obat Luar", stok: 45, terakhir: "2023-12-12", durasi: 50 },
  { id: 2, nama: "Thermometer Digital Omron", kategori: "Alat Kesehatan", stok: 8, terakhir: "2023-12-20", durasi: 42 },
  { id: 3, nama: "Bodrex Tablet 10s", kategori: "Obat Bebas", stok: 120, terakhir: "2024-01-15", durasi: 16 },
  { id: 4, nama: "Kasa Steril Husada 16x16", kategori: "Alat Medis", stok: 24, terakhir: "2024-01-01", durasi: 30 },
  { id: 5, nama: "Promag Tablet 12s", kategori: "Obat Bebas", stok: 65, terakhir: "2024-01-10", durasi: 21 },
];

const LaporanBarangTidakLaku = () => {
  const [page, setPage] = useState(1);
  const data = mockTidakLaku;
  
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { 
      header: "NAMA PRODUK", 
      accessor: "nama",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>{row.nama}</Typography>
      )
    },
    { 
      header: "KATEGORI", 
      accessor: "kategori",
      render: (row) => (
        <Typography sx={{ color: '#64748B', fontSize: 14 }}>{row.kategori}</Typography>
      )
    },
    { 
      header: "STOK SAAT INI", 
      accessor: "stok",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>
          {row.stok} <span style={{ fontWeight: 600, color: '#94A3B8', fontSize: 13 }}>Unit</span>
        </Typography>
      ),
      align: 'center'
    },
    { 
      header: "PENJUALAN TERAKHIR", 
      accessor: "terakhir",
      render: (row) => (
        <Typography sx={{ color: '#475569', fontSize: 14 }}>
          {new Date(row.terakhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Typography>
      ),
      align: 'center'
    },
    { 
      header: "DURASI TIDAK LAKU", 
      accessor: "durasi",
      render: (row) => (
        <Box sx={{ 
          background: '#FDF2F8', 
          color: '#E91E63', 
          px: 1.5, 
          py: 0.5, 
          borderRadius: 2, 
          display: 'inline-block',
          fontWeight: 800, 
          fontSize: 13 
        }}>
          {row.durasi} Hari
        </Box>
      ),
      align: 'right'
    },
  ];

  return (
    <Box>
      <Table columns={columns} data={pagedData} />
      <div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Menampilkan {pagedData.length} dari {data.length} item tidak laku</div>
        <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </Box>
  );
};

export default LaporanBarangTidakLaku;
