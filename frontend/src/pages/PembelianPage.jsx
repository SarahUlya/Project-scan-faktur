import React from "react";
import FakturTable from "../components/pembelian/FakturTable";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePembelianDb from "../hooks/usePembelianDb";

const PembelianPage = () => {
  const navigate = useNavigate();
  const { pembelian, loading } = usePembelianDb();

  const totalFaktur = pembelian.length;
  const totalPembelian = pembelian.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const lunas = pembelian.filter(p => p.status === 'LUNAS').length;
  const belumBayar = pembelian.filter(p => p.status !== 'LUNAS').length;

  return (
    <Box>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 28, color: '#1E293B' }}>Daftar Data Faktur</h2>
          <div style={{ color: '#64748B', fontWeight: 500, fontSize: 15, marginTop: 4 }}>
            Manajemen invoice pembelian barang ke supplier
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input type="text" placeholder="Cari faktur..." style={{ width: 260, padding: '14px 16px 14px 44px', borderRadius: 14, border: 'none', background: '#fff', fontSize: 15, outline: 'none', color: '#1E293B', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }} />
          </div>
          <button onClick={() => navigate('/pembelian/tambah')} style={{ padding: '14px 24px', borderRadius: 14, background: '#EC4899', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Data Faktur
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>TOTAL FAKTUR</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1E293B' }}>{loading ? '-' : totalFaktur}</div>
        </div>
        <div style={{ flex: 1.5, background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>TOTAL PEMBELIAN</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1E293B' }}>{loading ? '-' : `Rp ${totalPembelian.toLocaleString('id-ID')}`}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ color: '#10B981', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>SUDAH LUNAS</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#10B981' }}>{loading ? '-' : lunas}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>BELUM BAYAR</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#EF4444' }}>{loading ? '-' : belumBayar}</div>
        </div>
      </div>

      <FakturTable data={pembelian} loading={loading} />
    </Box>
  );
};

export default PembelianPage;
