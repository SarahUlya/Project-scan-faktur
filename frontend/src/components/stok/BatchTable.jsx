import React, { useState } from "react";
import Table from "../ui/Table";

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
        <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'all 0.2s', display: 'inline-flex' }} onMouseEnter={e => e.currentTarget.style.color='#EC4899'} onMouseLeave={e => e.currentTarget.style.color='#94A3B8'} onClick={() => onShowDetail(row)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
       <div style={{ padding: '20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
         <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 16 }}>Data Batch & Expired <span style={{ color: '#64748B', fontWeight: 500 }}>(FEFO Sorted)</span></div>
         <div style={{ background: '#FDF2F8', color: '#EC4899', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>OTOMATIS UPDATE DARI POS/PEMBELIAN</div>
       </div>
       <Table columns={columns} data={sortedBatch} />
    </div>
  );
};

export default BatchTable;
