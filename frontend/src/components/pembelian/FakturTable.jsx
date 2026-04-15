import React from "react";
import formatCurrency from "../../utils/formatCurrency";

const statusStyle = {
  LUNAS: { background: '#D1FAE5', color: '#10B981' },
  "BELUM BAYAR": { background: '#FEE2E2', color: '#EF4444' },
};

const FakturTable = ({ data = [], loading }) => {
  if (loading) {
     return <div style={{ background: '#fff', borderRadius: 20, padding: 40, textAlign: 'center', color: '#94A3B8' }}>Memuat data faktur...</div>;
  }

  return (
    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: 10 }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '24px 20px', color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9' }}>No. Faktur</th>
              <th style={{ padding: '24px 20px', color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9' }}>Supplier</th>
              <th style={{ padding: '24px 20px', color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9' }}>Tanggal</th>
              <th style={{ padding: '24px 20px', color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9', textAlign: 'right' }}>Total</th>
              <th style={{ padding: '24px 20px', color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '24px 20px', color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Belum ada faktur</td></tr>
            ) : data.map((row, idx) => (
              <tr key={row.id} style={{ borderBottom: idx === data.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                <td style={{ padding: '20px 20px', fontWeight: 700, color: '#1E293B', fontSize: 15 }}>{row.no_faktur || row.id}</td>
                <td style={{ padding: '20px 20px' }}>
                  <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 15 }}>{row.supplier}</div>
                  <div style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>{row.supplierType || 'Distributor'}</div>
                </td>
                <td style={{ padding: '20px 20px', color: '#475569', fontWeight: 500, fontSize: 15 }}>
                  <div style={{ whiteSpace: 'nowrap' }}>{new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</div>
                  <div style={{ whiteSpace: 'nowrap' }}>{new Date(row.tanggal).getFullYear()}</div>
                </td>
                <td style={{ padding: '20px 20px', textAlign: 'right', fontWeight: 800, color: '#1E293B', fontSize: 16 }}>{formatCurrency(row.total)}</td>
                <td style={{ padding: '20px 20px', textAlign: 'center' }}>
                  <span style={{
                    borderRadius: 20,
                    padding: '4px 12px',
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: 0.5,
                    ...statusStyle[row.status]
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: '20px 20px', textAlign: 'center' }}>
                  <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 8, display: 'inline-flex', verticalAlign: 'middle', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#EC4899'} onMouseLeave={e => e.currentTarget.style.color='#94A3B8'}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 8, display: 'inline-flex', verticalAlign: 'middle', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#EC4899'} onMouseLeave={e => e.currentTarget.style.color='#94A3B8'}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Menampilkan {data.length > 0 ? 1 : 0} - {data.length} dari {data.length} data</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 12px', background: '#F1F5F9', border: 'none', borderRadius: 8, color: '#94A3B8', cursor: 'pointer', fontWeight: 600 }}>&lt;</button>
          <button style={{ padding: '8px 14px', background: '#EC4899', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>1</button>
          <button style={{ padding: '8px 12px', background: '#F8FAFC', border: 'none', borderRadius: 8, color: '#64748B', cursor: 'pointer', fontWeight: 600 }}>&gt;</button>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: 13, marginTop: 16 }}>
         &copy; 2024 Apotek Ampuh Tayu Management System • Versi 1.0.0-PRO
      </div>
    </div>
  );
};

export default FakturTable;
