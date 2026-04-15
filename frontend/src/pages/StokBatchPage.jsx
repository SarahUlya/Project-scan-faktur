import React, { useState } from "react";
import BatchTable from "../components/stok/BatchTable";
import Modal from "../components/ui/Modal";
import useProdukDb from "../hooks/useProdukDb";
import { Box } from "@mui/material";
import Button from "../components/ui/Button";

// Komponen modal detail batch (Detail Kartu Stok Otomatis)
const DetailBatchModal = ({ batch, onClose }) => {
  if (!batch) return null;
  return (
    <div style={{ width: 800, padding: 0 }}>
      {/* Modal Header */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, background: '#FDF2F8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1E293B', letterSpacing: '-0.01em' }}>
              Detail Kartu Stok Otomatis
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
               <span style={{ fontSize: 10, fontWeight: 800, background: '#FDF2F8', color: '#EC4899', padding: '4px 8px', borderRadius: 6, letterSpacing: '0.05em' }}>STOCK MOVEMENT LOG</span>
               <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>• Terupdate Real-time</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Kop Surat Apotek */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottom: '1px dashed #E2E8F0', paddingBottom: 24 }}>
          <div style={{ display: 'flex', gap: 16 }}>
             <div style={{ width: 56, height: 56, background: '#FDF2F8', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
             </div>
             <div>
               <h3 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Apotek Ampuh Tayu</h3>
               <div style={{ color: '#64748B', fontSize: 13, lineHeight: '1.5' }}>
                  Jl. Raya Tayu - Juwana No. 45, Pati, Jawa Tengah<br/>
                  Telepon: (0295) 123-4567 • Email: ampuh@tayu.com
               </div>
             </div>
          </div>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Tanggal Cetak</div>
             <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</div>
          </div>
        </div>

        {/* Info Produk */}
        <div style={{ background: '#F8FAFC', borderRadius: 16, padding: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Nama Produk</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 8 }}>
               {batch.namaProduk} <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>({batch.kategori})</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Kode Batch & Expired</div>
             <div style={{ fontSize: 15, fontWeight: 800, color: '#E11D48' }}>
               {batch.kodeBatch} <span style={{ color: '#E11D48', margin: '0 8px', opacity: 0.5 }}>|</span> {new Date(batch.expired).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year:'numeric'})}
             </div>
          </div>
        </div>

      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
               <th style={{ padding: '12px 0', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Tanggal & Waktu</th>
               <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Aktivitas / Referensi</th>
               <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center' }}>Masuk</th>
               <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center' }}>Keluar</th>
               <th style={{ padding: '12px 0', fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700, textAlign: 'right' }}>Saldo Akhir</th>
            </tr>
          </thead>
          <tbody>
            {(batch.history && batch.history.length > 0) ? batch.history.map((log, idx) => {
              const LogIcon = log.tipe === 'in' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              ) : log.tipe === 'out' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>
              );

              return (
              <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '16px 0', verticalAlign: 'top' }}>
                  <div style={{ color: '#0F172A', fontWeight: 600, fontSize: 13 }}>{new Date(log.tanggal).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</div>
                  <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>{new Date(log.tanggal).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})} WIB</div>
                </td>
                <td style={{ padding: '16px 16px', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ marginTop: 2 }}>{LogIcon}</div>
                    <div>
                      <div style={{ color: '#1E293B', fontWeight: 600, fontSize: 14 }}>{log.aktivitas}</div>
                      {log.referensi && <div style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>{log.referensi}</div>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 16px', verticalAlign: 'top', textAlign: 'center' }}>
                  {log.masuk > 0 ? <span style={{ color: '#10B981', fontWeight: 600, background: '#D1FAE5', padding: '4px 8px', borderRadius: 6 }}>+{log.masuk}</span> : <span style={{ color: '#CBD5E1' }}>-</span>}
                </td>
                <td style={{ padding: '16px 16px', verticalAlign: 'top', textAlign: 'center' }}>
                  {log.keluar > 0 ? <span style={{ color: '#EF4444', fontWeight: 600, background: '#FEE2E2', padding: '4px 8px', borderRadius: 6 }}>-{log.keluar}</span> : <span style={{ color: '#CBD5E1' }}>-</span>}
                </td>
                <td style={{ padding: '16px 0', verticalAlign: 'top', textAlign: 'right' }}>
                  <div style={{ color: '#0F172A', fontWeight: 700, fontSize: 15 }}>{log.saldoAkhir} Unit</div>
                </td>
              </tr>
              );
            }) : null}
            {(!batch.history || batch.history.length === 0) && (
              <tr><td colSpan="5" style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>Belum ada log pergerakan stok.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 20 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Total Masuk</div>
            <div style={{ color: '#10B981', fontWeight: 700, fontSize: 16 }}>
              {batch.history ? batch.history.reduce((a, b) => a + (b.masuk || 0), 0) : 0} Unit
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Total Keluar</div>
            <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 16 }}>
              {batch.history ? batch.history.reduce((a, b) => a + (b.keluar || 0), 0) : 0} Unit
            </div>
          </div>
          <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: 24 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Sisa Saat Ini</div>
            <div style={{ color: '#1E293B', fontWeight: 800, fontSize: 18 }}>
              {batch.stok} Unit
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ padding: '10px 20px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', color: '#1E293B', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export Excel
          </button>
          <Button color="pink" sx={{ padding: '10px 24px', borderRadius: 2 }}>
             Cetak Kartu
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};

const StokBatchPage = () => {
  const [detailBatch, setDetailBatch] = useState(null);
  const { produk, loading } = useProdukDb();

  return (
    <Box>
      {/* Header & Subjudul */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 28, color: '#1E293B' }}>Monitoring Stok & Batch FEFO</h2>
          <div style={{ color: '#64748B', fontWeight: 500, fontSize: 15, marginTop: 4 }}>
            First-Expired-First-Out (FEFO) Inventory Management
          </div>
        </div>
        <button style={{ padding: '12px 24px', borderRadius: 12, background: '#fff', border: '1px solid #FCE7F3', color: '#EC4899', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(236, 72, 153, 0.1)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
          Cetak Laporan Stok
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: 24, paddingBottom: 32, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, background: '#FDF2F8', borderRadius: '50%', opacity: 0.8 }}></div>
          <div style={{ width: 48, height: 48, background: '#FCE7F3', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899', marginBottom: 24, position: 'relative' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, position: 'relative' }}>TOTAL PRODUK TERDATA</div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>{loading ? '-' : produk.length}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>SKU</span>
          </div>
        </div>

        <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: 24, paddingBottom: 32, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, background: '#FEF2F2', borderRadius: '50%', opacity: 0.8 }}></div>
          <div style={{ width: 48, height: 48, background: '#FEE2E2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: 24, position: 'relative' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
          </div>
          <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, position: 'relative' }}>BATCH MENDEKATI EXPIRED (&lt;30 HARI)</div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: '#EF4444', lineHeight: 1 }}>
               {loading ? '-' : produk.flatMap(p => p.batch).filter(b => b && Math.ceil((new Date(b.expired) - new Date()) / (1000 * 60 * 60 * 24)) <= 30 && Math.ceil((new Date(b.expired) - new Date()) / (1000 * 60 * 60 * 24)) > 0).length}
            </span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#FCA5A5' }}>Batch</span>
          </div>
        </div>

        <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: 24, paddingBottom: 32, position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, background: '#FFF7ED', borderRadius: '50%', opacity: 0.8 }}></div>
          <div style={{ width: 48, height: 48, background: '#FFEDD5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', marginBottom: 24, position: 'relative' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/><path d="M17.5 15.5 12 18l-5.5-2.5"/></svg>
          </div>
          <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, position: 'relative' }}>PRODUK STOK RENDAH</div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 8 }}>
             <span style={{ fontSize: 36, fontWeight: 800, color: '#F97316', lineHeight: 1 }}>
               {loading ? '-' : produk.filter(p => (p.batch || []).reduce((a, b) => a + (b.stok || 0), 0) < (p.stokMinimum || 50)).length}
             </span>
             <span style={{ fontSize: 16, fontWeight: 700, color: '#FDBA74' }}>Item</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input type="text" placeholder="Cari Nama Produk atau Kode Batch..." style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 14, border: 'none', background: '#F8FAFC', fontSize: 15, outline: 'none', color: '#1E293B' }} />
        </div>
        <select style={{ padding: '0 20px', borderRadius: 14, border: 'none', background: '#F8FAFC', fontSize: 15, color: '#475569', fontWeight: 500, outline: 'none', minWidth: 160 }}>
          <option>Semua Kategori</option>
        </select>
        <select style={{ padding: '0 20px', borderRadius: 14, border: 'none', background: '#F8FAFC', fontSize: 15, color: '#475569', fontWeight: 500, outline: 'none', minWidth: 160 }}>
          <option>Semua Status</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <BatchTable produk={produk} onShowDetail={setDetailBatch} />
      )}
      <Modal open={!!detailBatch} onClose={() => setDetailBatch(null)}>
        <DetailBatchModal batch={detailBatch} onClose={() => setDetailBatch(null)} />
      </Modal>
    </Box>
  );
};

export default StokBatchPage;
