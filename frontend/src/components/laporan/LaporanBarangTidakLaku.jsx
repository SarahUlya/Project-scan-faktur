import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";
import useLaporanTransaksi from "../../hooks/useLaporanTransaksi";
import usePosProducts from "../../hooks/usePosProducts";

const PAGE_SIZE = 25;

const LaporanBarangTidakLaku = () => {
  const [page, setPage] = useState(1);
  const { getProdukTidakLaku } = useLaporanTransaksi();
  const { produk } = usePosProducts();

  const data = useMemo(() => {
    const list = getProdukTidakLaku(produk);
    return list.map((p, i) => {
      const terakhir = p.terakhirTerjual === "-" ? null : new Date(p.terakhirTerjual);
      const durasi = terakhir
        ? Math.max(0, Math.ceil((Date.now() - terakhir.getTime()) / (1000 * 60 * 60 * 24)))
        : "-";

      return {
        id: i + 1,
        nama: p.nama,
        kategori: p.kategori,
        stok: p.stok,
        terakhir: p.terakhirTerjual,
        durasi,
      };
    });
  }, [produk, getProdukTidakLaku]);
  
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
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
      render: (row) => {
        if (!row.terakhir || row.terakhir === "-") {
          return <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>-</Typography>;
        }
        return (
          <Typography sx={{ color: '#475569', fontSize: 14 }}>
            {new Date(row.terakhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Typography>
        );
      },
      align: 'center'
    },
    { 
      header: "DURASI TIDAK LAKU", 
      accessor: "durasi",
      render: (row) => (
        <Box sx={{ 
          background: '#FCE4EC', 
          color: '#D81B60', 
          px: 1.5, 
          py: 0.5, 
          borderRadius: 2, 
          display: 'inline-block',
          fontWeight: 800, 
          fontSize: 13 
        }}>
          {typeof row.durasi === 'number' ? `${row.durasi} Hari` : row.durasi}
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
