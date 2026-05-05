import React, { useState } from "react";
import BatchTable from "../components/stok/BatchTable";
import Modal from "../components/ui/Modal";
import useProdukDb from "../hooks/useProdukDb";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import Button from "../components/ui/Button";
import PaginationControls from "../components/ui/PaginationControls";
import DetailBatchModal from "../components/stok/DetailBatchModal";
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from "@mui/icons-material/Search";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const PAGE_SIZE = 25;

const StokBatchPage = () => {
  const [detailBatch, setDetailBatch] = useState(null);
  const { produk, loading } = useProdukDb();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(produk.length / PAGE_SIZE);
  const pagedProduk = produk.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B' }}>
            Monitoring Stok & Batch FEFO
          </Typography>
          <Typography sx={{ color: '#64748B', mt: 0.5 }}>
            First-Expired-First-Out (FEFO) Inventory Management
          </Typography>
        </Box>
        <Button variant="outlined" sx={{ 
          borderRadius: 3, 
          borderColor: '#FCE7F3', 
          color: '#E91E63', 
          fontWeight: 700, 
          px: 3, 
          height: 44,
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          '&:hover': { bgcolor: '#FDF2F8', borderColor: '#FBCFE8' } 
        }}>
          <PrintIcon fontSize="small" />
          Cetak Laporan Stok
        </Button>
      </Box>

      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <Box sx={{ flex: 1, background: '#fff', borderRadius: 4, p: 3, position: 'relative', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
          <Box sx={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, background: '#FFF1F2', borderRadius: '50%' }}></Box>
          <Box sx={{ width: 48, height: 48, background: '#FFE4E6', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F43F5E', mb: 2, position: 'relative' }}>
             <Inventory2OutlinedIcon />
          </Box>
          <Typography sx={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, mb: 1, position: 'relative' }}>TOTAL PRODUK TERDATA</Typography>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography sx={{ fontSize: 36, fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>{loading ? '-' : produk.length}</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>SKU</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, background: '#fff', borderRadius: 4, p: 3, position: 'relative', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
          <Box sx={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, background: '#FFF1F2', borderRadius: '50%' }}></Box>
          <Box sx={{ width: 48, height: 48, background: '#FFE4E6', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F43F5E', mb: 2, position: 'relative' }}>
             <EventBusyOutlinedIcon />
          </Box>
          <Typography sx={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, mb: 1, position: 'relative' }}>BATCH MENDEKATI EXPIRED (&lt;30 HARI)</Typography>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography sx={{ fontSize: 36, fontWeight: 800, color: '#E11D48', lineHeight: 1 }}>
               {loading ? '-' : produk.flatMap(p => p.batch).filter(b => b && Math.ceil((new Date(b.expired) - new Date()) / (1000 * 60 * 60 * 24)) <= 30 && Math.ceil((new Date(b.expired) - new Date()) / (1000 * 60 * 60 * 24)) > 0).length}
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#FDA4AF' }}>Batch</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, background: '#fff', borderRadius: 4, p: 3, position: 'relative', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
          <Box sx={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, background: '#FFF7ED', borderRadius: '50%' }}></Box>
          <Box sx={{ width: 48, height: 48, background: '#FFEDD5', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', mb: 2, position: 'relative' }}>
             <WarningAmberOutlinedIcon />
          </Box>
          <Typography sx={{ color: '#94A3B8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, mb: 1, position: 'relative' }}>PRODUK STOK RENDAH</Typography>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 1 }}>
             <Typography sx={{ fontSize: 36, fontWeight: 800, color: '#F97316', lineHeight: 1 }}>
               {loading ? '-' : produk.filter(p => (p.batch || []).reduce((a, b) => a + (b.stok || 0), 0) < (p.stokMinimum || 50)).length}
             </Typography>
             <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#FDBA74' }}>Item</Typography>
          </Box>
        </Box>
      </div>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Cari Nama Produk atau Kode Batch..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94A3B8' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: '#F8FAFC', width: 400, height: 44, '& fieldset': { border: 'none' } }
          }}
        />
        <select style={{ padding: '0 20px', borderRadius: 12, border: 'none', background: '#F8FAFC', fontSize: 14, color: '#475569', fontWeight: 600, outline: 'none', minWidth: 160, height: 44 }}>
          <option>Semua Kategori</option>
        </select>
        <select style={{ padding: '0 20px', borderRadius: 12, border: 'none', background: '#F8FAFC', fontSize: 14, color: '#475569', fontWeight: 600, outline: 'none', minWidth: 160, height: 44 }}>
          <option>Semua Status</option>
        </select>
      </Box>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Box sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 10px 40px rgba(233, 30, 99, 0.05)", overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
              <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>Data Batch & Expired (FEFO Sorted)</Typography>
              <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#E91E63', bgcolor: '#FDF2F8', px: 1.5, py: 0.5, borderRadius: 1, letterSpacing: 0.5 }}>OTOMATIS UPDATE DARI POS/PEMBELIAN</Typography>
            </Box>
            <BatchTable produk={pagedProduk} onShowDetail={setDetailBatch} />
            <div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>Menampilkan {pagedProduk.length} dari {produk.length} produk</div>
              <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </Box>
        </>
      )}
      <Modal open={!!detailBatch} onClose={() => setDetailBatch(null)} width={800}>
        <DetailBatchModal batch={detailBatch} />
      </Modal>
    </Box>
  );
};

export default StokBatchPage;
