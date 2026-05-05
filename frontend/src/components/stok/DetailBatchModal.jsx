import React from "react";
import Button from "../ui/Button";
import { Box, Typography, Divider } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const DetailBatchModal = ({ batch }) => {
  if (!batch) return null;

  return (
    <Box sx={{ minWidth: 600, maxWidth: 800 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ width: 48, height: 48, background: '#FCE7F3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E63' }}>
          <ShowChartIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B' }}>
            Detail Kartu Stok Otomatis
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 800, background: '#FDF2F8', color: '#E91E63', padding: '2px 8px', borderRadius: 1, letterSpacing: 0.5 }}>
              STOCK MOVEMENT LOG
            </Typography>
            <Typography sx={{ color: "#64748B", fontSize: 13 }}>
              • Terupdate Real-time
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ background: '#F8FAFC', borderRadius: 3, p: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 3, border: '1px solid #F1F5F9' }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            NAMA PRODUK
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 1 }}>
            {batch.namaProduk} <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>({batch.kategori})</span>
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            KODE BATCH & EXPIRED
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#E91E63' }}>
            {batch.kodeBatch} <span style={{ margin: '0 8px', color: '#FCE7F3' }}>|</span> {new Date(batch.expired).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year:'numeric'})}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ overflowX: 'auto', mb: 3, border: '1px solid #F1F5F9', borderRadius: 3 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
               <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Tanggal & Waktu</th>
               <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Aktivitas / Referensi</th>
               <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center' }}>Masuk</th>
               <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center' }}>Keluar</th>
               <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700, textAlign: 'right' }}>Saldo Akhir</th>
            </tr>
          </thead>
          <tbody>
            {(batch.history && batch.history.length > 0) ? batch.history.map((log, idx) => {
              const LogIcon = log.tipe === 'in' ? (
                <ArrowDownwardIcon sx={{ color: '#10B981', fontSize: 18 }} />
              ) : log.tipe === 'out' ? (
                <ArrowUpwardIcon sx={{ color: '#E91E63', fontSize: 18 }} />
              ) : (
                <CompareArrowsIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
              );

              return (
              <tr key={idx} style={{ borderBottom: idx === batch.history.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                <td style={{ padding: '16px', verticalAlign: 'top' }}>
                  <Box sx={{ color: '#0F172A', fontWeight: 700, fontSize: 13 }}>{new Date(log.tanggal).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</Box>
                  <Box sx={{ color: '#94A3B8', fontSize: 12, mt: 0.5, fontWeight: 600 }}>{new Date(log.tanggal).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})} WIB</Box>
                </td>
                <td style={{ padding: '16px', verticalAlign: 'top' }}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ mt: 0.2 }}>{LogIcon}</Box>
                    <Box>
                      <Box sx={{ color: '#1E293B', fontWeight: 700, fontSize: 14 }}>{log.aktivitas}</Box>
                      {log.referensi && <Box sx={{ color: '#94A3B8', fontSize: 12, mt: 0.5, fontWeight: 600 }}>{log.referensi}</Box>}
                    </Box>
                  </Box>
                </td>
                <td style={{ padding: '16px', verticalAlign: 'top', textAlign: 'center' }}>
                  {log.masuk > 0 ? <Typography sx={{ color: '#10B981', fontWeight: 700, fontSize: 14 }}>+{log.masuk}</Typography> : <Typography sx={{ color: '#CBD5E1', fontSize: 14 }}>-</Typography>}
                </td>
                <td style={{ padding: '16px', verticalAlign: 'top', textAlign: 'center' }}>
                  {log.keluar > 0 ? <Typography sx={{ color: '#EF4444', fontWeight: 700, fontSize: 14 }}>-{log.keluar}</Typography> : <Typography sx={{ color: '#CBD5E1', fontSize: 14 }}>-</Typography>}
                </td>
                <td style={{ padding: '16px', verticalAlign: 'top', textAlign: 'right' }}>
                  <Box sx={{ color: '#0F172A', fontWeight: 800, fontSize: 15 }}>{log.saldoAkhir} Unit</Box>
                </td>
              </tr>
              );
            }) : null}
            {(!batch.history || batch.history.length === 0) && (
              <tr><td colSpan="5" style={{ padding: 24, textAlign: 'center', color: '#94A3B8', fontWeight: 600 }}>Belum ada pergerakan stok.</td></tr>
            )}
          </tbody>
        </table>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', mb: 0.5, letterSpacing: 0.5 }}>Total Masuk</Typography>
            <Typography sx={{ color: '#10B981', fontWeight: 800, fontSize: 16 }}>
              {batch.history ? batch.history.reduce((a, b) => a + (b.masuk || 0), 0) : 0} Unit
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', mb: 0.5, letterSpacing: 0.5 }}>Total Keluar</Typography>
            <Typography sx={{ color: '#EF4444', fontWeight: 800, fontSize: 16 }}>
              {batch.history ? batch.history.reduce((a, b) => a + (b.keluar || 0), 0) : 0} Unit
            </Typography>
          </Box>
          <Box sx={{ borderLeft: '2px solid #F1F5F9', pl: 3 }}>
            <Typography sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', mb: 0.5, letterSpacing: 0.5 }}>Sisa Saat Ini</Typography>
            <Typography sx={{ color: '#1E293B', fontWeight: 800, fontSize: 16 }}>
              {batch.stok} Unit
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" sx={{ fontWeight: 700, borderRadius: 2, borderColor: '#F1F5F9', color: '#1E293B', '&:hover': { bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }, display: 'flex', gap: 1, alignItems: 'center' }}>
            <DownloadIcon fontSize="small" />
            Export Excel
          </Button>
          <Button sx={{ fontWeight: 700, borderRadius: 2, bgcolor: '#E91E63', color: '#fff', '&:hover': { bgcolor: '#D81B60' }, boxShadow: '0 4px 14px rgba(233,30,99,0.3)', display: 'flex', gap: 1, alignItems: 'center' }}>
            <PrintIcon fontSize="small" />
            Cetak Kartu
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DetailBatchModal;
