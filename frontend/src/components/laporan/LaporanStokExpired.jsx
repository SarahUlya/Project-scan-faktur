import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../data/db";

const PAGE_SIZE = 25;

const computeStatus = (dateString) => {
  if (!dateString) return "AMAN";
  const now = new Date();
  const exp = new Date(dateString);
  if (isNaN(exp.getTime())) return "AMAN";
  if (exp < now) return "EXPIRED";
  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 30 ? "PERINGATAN" : "AMAN";
};

const LaporanStokExpired = () => {
  const [page, setPage] = useState(1);
  const batchData = useLiveQuery(async () => {
    const batches = await db.batchProduk.toArray();
    return await Promise.all(
      batches.map(async (batch) => {
        const produk = await db.produk.get(batch.produk_id);
        return {
          id: batch.id,
          nama: produk?.nama || batch.produk_id,
          type: produk?.satuan || "-",
          batch: batch.kodeBatch || "-",
          exp: batch.expired || "",
          stok: batch.stok || 0,
          status: computeStatus(batch.expired),
        };
      })
    );
  }, [], []);

  const data = useMemo(() => {
    return (batchData || []).sort((a, b) => new Date(a.exp || 0) - new Date(b.exp || 0));
  }, [batchData]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
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
      render: (row) => {
        if (!row.exp) {
          return <Typography sx={{ fontWeight: 700, color: '#64748B', fontSize: 14 }}>-</Typography>;
        }
        return (
          <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: 14 }}>
            {new Date(row.exp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Typography>
        );
      }
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
        let bg = '#F1F5F9';
        let color = '#64748B';
        if (row.status === 'EXPIRED') {
          bg = '#BE185D';
          color = '#FFFFFF';
        }
        if (row.status === 'PERINGATAN') {
          bg = '#F9A8D4';
          color = '#BE185D';
        }

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
        );
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
