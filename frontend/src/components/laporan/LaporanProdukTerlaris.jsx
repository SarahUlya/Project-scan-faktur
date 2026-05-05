import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";

const PAGE_SIZE = 25;

const mockTerlaris = [
  { id: 1, nama: "Paracetamol 500mg", kategori: "Obat Bebas", terjual: 1240, omzet: 12400000 },
  { id: 2, nama: "Vitamin C IPI", kategori: "Vitamin & Suplemen", terjual: 850, omzet: 6375000 },
  { id: 3, nama: "Amoxicillin 500mg", kategori: "Antibiotik", terjual: 620, omzet: 15500000 },
  { id: 4, nama: "Betadine Solution 15ml", kategori: "Alat Kesehatan", terjual: 480, omzet: 9120000 },
  { id: 5, nama: "Masker Medis 3-Ply", kategori: "Alat Kesehatan", terjual: 310, omzet: 1550000 },
];

const LaporanProdukTerlaris = () => {
  const [page, setPage] = useState(1);
  const data = mockTerlaris;
  
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const maxTerjual = Math.max(...data.map(d => d.terjual));

  const columns = [
    { 
      header: "RANK", 
      accessor: "id",
      render: (row, idx) => (
        <Box sx={{ width: 32, height: 32, background: '#E91E63', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
          {(page - 1) * PAGE_SIZE + idx + 1}
        </Box>
      ),
      align: 'center',
      width: '80px'
    },
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
      header: "JUMLAH TERJUAL", 
      accessor: "terjual",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>
          {row.terjual.toLocaleString('id-ID')}
        </Typography>
      ),
      align: 'center'
    },
    { 
      header: "TOTAL OMZET", 
      accessor: "omzet",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>
          Rp {row.omzet.toLocaleString('id-ID')}
        </Typography>
      ),
      align: 'right'
    },
  ];

  return (
    <Box>
      {/* Visualisasi Bar Chart */}
      <Box sx={{ px: 3, py: 3, borderBottom: '2px solid #F1F5F9' }}>
        <Typography sx={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, letterSpacing: 1, mb: 3 }}>VISUALISASI TOP 5 PRODUK</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {data.slice(0, 5).map((item, idx) => {
            const widthPercent = (item.terjual / maxTerjual) * 100;
            return (
              <Box key={idx} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 13 }}>{item.nama}</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#E91E63', fontSize: 13 }}>{item.terjual.toLocaleString('id-ID')} Sold</Typography>
                </Box>
                <Box sx={{ width: '100%', background: '#F8FAFC', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                   <Box sx={{ width: `${widthPercent}%`, background: '#E91E63', height: '100%', borderRadius: 4 }}></Box>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Tabel */}
      <Table columns={columns} data={pagedData} />
      <div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Menampilkan {pagedData.length} dari {data.length} produk terjual</div>
        <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </Box>
  );
};

export default LaporanProdukTerlaris;
