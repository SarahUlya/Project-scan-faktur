import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePembelianDb from "../hooks/usePembelianDb";
import useProdukDb from "../hooks/useProdukDb";
import useSupplierDb from "../hooks/useSupplierDb";

const TambahFakturPage = () => {
  const navigate = useNavigate();
  const { addPembelian } = usePembelianDb();
  const { produk } = useProdukDb();
  const { supplier } = useSupplierDb();
  
  const [fakturInfo, setFakturInfo] = useState({ supplier_id: '', supplier_name: '', no_faktur: '', tanggal: '' });
  const [items, setItems] = useState([{ id: 1, produk_id: '', no_batch: '', exp_date: '', qty: 0, harga_satuan: 0, total: 0 }]);

  const handleTambahBaris = () => {
    setItems([...items, { id: Date.now(), produk_id: '', no_batch: '', exp_date: '', qty: 0, harga_satuan: 0, total: 0 }]);
  };

  const handleHapusBaris = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculate total
        if (field === 'qty' || field === 'harga_satuan') {
           updated.total = updated.qty * updated.harga_satuan;
        }
        return updated;
      }
      return item;
    }));
  };

  const grandTotal = items.reduce((acc, curr) => acc + curr.total, 0);

  const handleSimpan = async () => {
    if (!fakturInfo.supplier_id || !fakturInfo.tanggal) {
      alert("Harap isi Supplier dan Tanggal Faktur!");
      return;
    }
    
    const validItems = items.filter(it => it.produk_id && it.qty > 0);
    if (validItems.length === 0) {
      alert("Harap isi minimal 1 item produk dengan Qty > 0");
      return;
    }

    const payloadInfo = {
      ...fakturInfo,
      total: grandTotal
    };

    try {
      await addPembelian(payloadInfo, validItems);
      alert("Faktur berhasil disimpan! Stok masuk dan history log fefo otomatis terupdate.");
      navigate('/pembelian');
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat menyimpan faktur.");
    }
  };

  return (
    <Box>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, color: '#EC4899', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
             <span style={{ cursor: 'pointer' }} onClick={() => navigate('/pembelian')}>PEMBELIAN</span>
             <span style={{ color: '#94A3B8' }}>&gt;</span>
             <span>TAMBAH FAKTUR</span>
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 28, color: '#1E293B' }}>Tambah Data Faktur</h2>
          <div style={{ color: '#64748B', fontWeight: 500, fontSize: 16, marginTop: 4 }}>
            Input faktur pembelian barang secara manual atau menggunakan OCR
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={() => navigate('/pembelian')} style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
            Batal
          </button>
          <button onClick={handleSimpan} style={{ padding: '14px 24px', borderRadius: 12, background: '#EC4899', color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Simpan Faktur
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, background: '#FDF2F8', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 7 19 7"/><path d="M14 21v-4"/><path d="M6 14v7"/><circle cx="10" cy="14" r="2"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>Scan Data Faktur (OCR)</div>
            <div style={{ color: '#64748B', fontSize: 15 }}>Otomatiskan input data dengan mengambil foto faktur. Sistem akan mendeteksi supplier, nomor faktur, dan daftar item secara otomatis.</div>
          </div>
        </div>
        <button style={{ padding: '14px 24px', borderRadius: 12, background: '#EC4899', color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap' }}>
           Mulai Scan OCR
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Informasi Utama Faktur</h3>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
             <label style={{ display: 'block', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Supplier</label>
             <select onChange={(e) => {
               const supParams = e.target.value.split('|');
               setFakturInfo({...fakturInfo, supplier_id: supParams[0], supplier_name: supParams[1]});
             }} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 15, color: '#1E293B', outline: 'none' }}>
                <option value="">Pilih Supplier</option>
                {supplier.map(s => (
                  <option key={s.id} value={`${s.id}|${s.nama}`}>{s.nama}</option>
                ))}
             </select>
          </div>
          <div style={{ flex: 1 }}>
             <label style={{ display: 'block', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>No. Faktur</label>
             <input type="text" placeholder="Contoh: INV/2024/001" onChange={(e) => setFakturInfo({...fakturInfo, no_faktur: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 15, color: '#1E293B', outline: 'none' }} />
          </div>
          <div style={{ flex: 1 }}>
             <label style={{ display: 'block', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Tanggal Faktur</label>
             <input type="date" onChange={(e) => setFakturInfo({...fakturInfo, tanggal: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 15, color: '#1E293B', outline: 'none' }} />
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Daftar Item Barang</h3>
          </div>
          <button onClick={handleTambahBaris} style={{ padding: '8px 16px', borderRadius: 8, background: '#FDF2F8', color: '#EC4899', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
             TAMBAH BARIS
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 12px', color: '#94A3B8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9' }}>Nama Produk</th>
                <th style={{ padding: '16px 12px', color: '#94A3B8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9', width: 140 }}>No. Batch</th>
                <th style={{ padding: '16px 12px', color: '#94A3B8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9', width: 160 }}>Exp. Date</th>
                <th style={{ padding: '16px 12px', color: '#94A3B8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9', width: 80 }}>Qty</th>
                <th style={{ padding: '16px 12px', color: '#94A3B8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9', width: 140, textAlign: 'right' }}>Harga Satuan (Rp)</th>
                <th style={{ padding: '16px 12px', color: '#94A3B8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9', width: 140, textAlign: 'right' }}>Total (Rp)</th>
                <th style={{ padding: '16px 12px', color: '#94A3B8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #F1F5F9', textAlign: 'center', width: 60 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: index === items.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px' }}>
                     <select onChange={e => updateItem(item.id, 'produk_id', e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', color: '#64748B', outline: 'none' }}>
                        <option value="">Cari produk...</option>
                        {produk.map(p => (
                          <option key={p.id} value={p.id}>{p.nama}</option>
                        ))}
                     </select>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <input type="text" placeholder="BATCH-..." onChange={e => updateItem(item.id, 'no_batch', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', color: '#1E293B', outline: 'none' }} />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <input type="date" onChange={e => updateItem(item.id, 'exp_date', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', color: '#1E293B', outline: 'none' }} />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <input type="number" placeholder="0" min="0" value={item.qty || ''} onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', color: '#1E293B', outline: 'none', textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <input type="number" placeholder="0" min="0" value={item.harga_satuan || ''} onChange={e => updateItem(item.id, 'harga_satuan', parseInt(e.target.value) || 0)} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', color: '#1E293B', outline: 'none', textAlign: 'right' }} />
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: '#1E293B' }}>
                    {item.total.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => handleHapusBaris(item.id)} style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 8 }} onMouseEnter={e => e.currentTarget.style.color='#EF4444'} onMouseLeave={e => e.currentTarget.style.color='#CBD5E1'}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 24, borderTop: '2px solid #F1F5F9' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
             <div style={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>GRAND TOTAL</div>
             <div style={{ color: '#E11D48', fontWeight: 800, fontSize: 24 }}>Rp {grandTotal.toLocaleString('id-ID')}</div>
           </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
        <div style={{ color: '#94A3B8', fontSize: 13 }}>&copy; 2024 Apotek Ampuh Tayu Management System</div>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#10B981', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ display: 'inline-block', width: 8, height: 8, background: '#10B981', borderRadius: '50%' }}></span> System Online</span>
          <span style={{ color: '#94A3B8' }}>Versi 1.0.0-PRO</span>
        </div>
      </div>

    </Box>
  );
};

export default TambahFakturPage;
