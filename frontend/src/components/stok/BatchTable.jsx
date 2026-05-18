import React, { useState } from "react";
import Table from "../ui/Table";
import { IconButton } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const checkStatus = (expiredDateStr) => {
  const expiredDate = new Date(expiredDateStr);
  const now = new Date('2024-01-01'); 
  const diffTime = expiredDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return { label: 'EXPIRED', color: '#E11D48', bg: '#FFE4E6' };
  if (diffDays <= 30) return { label: 'PERINGATAN', color: '#EC4899', bg: '#FCE7F3' };
  return { label: 'AMAN', color: '#64748B', bg: '#F1F5F9' };
};


const BatchTable = ({ produk, onShowDetail }) => {

  const allBatch = produk
    .flatMap((p) =>
      (p.batch || []).map((b) => ({
        ...b,
        produkId: p.id,
        namaProduk: p.nama,
        kategori: p.kategori,
      }))
    );

  const sortedBatch = [...allBatch].sort(
    (a, b) => new Date(a.expired) - new Date(b.expired)
  );

  const columns = [
    { 
      header: "NAMA PRODUK", 
      accessor: "namaProduk",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 15 }}>{row.namaProduk}</div>
          <div style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>{row.kategori}</div>
        </div>
      )
    },
    { 
      header: "KODE BATCH", 
      accessor: "kodeBatch",
      render: (row) => (
        <span style={{ color: '#64748B', fontWeight: 500 }}>{row.kodeBatch}</span>
      )
    },
    { 
      header: "TANGGAL EXPIRED", 
      accessor: "expired",
      render: (row) => {
        const isExpired = new Date(row.expired) < new Date('2024-01-01');
        return (
          <span style={{ color: isExpired ? '#E11D48' : '#1E293B', fontWeight: isExpired ? 700 : 600 }}>
            {new Date(row.expired).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year:'numeric'})}
          </span>
        )
      }
    },
    { 
      header: "SISA STOK", 
      accessor: "stok", 
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#1E293B' }}>{row.stok} <span style={{fontWeight: 600, color: '#64748B'}}>Unit</span></span>
      )
    },
    { 
      header: "STATUS", 
      accessor: "status",
      align: "center",
      render: (row) => {
        const st = checkStatus(row.expired);
        return (
          <span style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>
            {st.label}
          </span>
        )
      }
    },
    {
      header: "AKSI",
      accessor: "aksi",
      align: "center",
      render: (row) => (
        <IconButton
          size="small"
          onClick={() => onShowDetail(row)}
          title="Lihat detail batch"
          sx={{
            color: "#64748B",
            border: "1px solid #F3F6F9",
            bgcolor: "#fff",
            '&:hover': { bgcolor: "#f8f4f8" },
          }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Table columns={columns} data={sortedBatch} />
  );
};

export default BatchTable;
