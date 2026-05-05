import React from "react";
import formatCurrency from "../../utils/formatCurrency";
import { IconButton, Box } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

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
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      title="Lihat detail faktur"
                      sx={{
                        color: "#64748B",
                        border: "1px solid #F3F6F9",
                        bgcolor: "#fff",
                        '&:hover': { bgcolor: "#f8f4f8" },
                      }}
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Cetak faktur"
                      sx={{
                        color: "#64748B",
                        border: "1px solid #F3F6F9",
                        bgcolor: "#fff",
                        '&:hover': { bgcolor: "#f8f4f8" },
                      }}
                    >
                      <PrintOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FakturTable;
