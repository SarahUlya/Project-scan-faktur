import React from "react";
import Button from "../ui/Button";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Typography } from "@mui/material";

const HapusSupplierConfirm = ({ open, onClose, onDelete, supplier }) => {
  if (!open) return null;
  return (
    <Box sx={{ minWidth: 340, maxWidth: 420, textAlign: 'center' }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ 
          background: "#FDF2F8", 
          borderRadius: "50%", 
          width: 72, 
          height: 72, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          mb: 1,
          border: '8px solid #FCE7F3'
        }}>
          <DeleteOutlineIcon sx={{ fontSize: 32, color: "#E91E63" }} />
        </Box>
        
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B', m: 0 }}>
          Konfirmasi Hapus Supplier
        </Typography>
        
        <Typography sx={{ color: "#64748B", fontSize: 14, px: 2, lineHeight: 1.6 }}>
          Apakah Anda yakin ingin menghapus supplier ini? Tindakan ini tidak dapat dibatalkan.
        </Typography>

        <Box sx={{ 
          background: "#F8FAFC", 
          border: '1px solid #F1F5F9',
          borderRadius: 3, 
          p: 2, 
          width: "100%", 
          display: "flex", 
          alignItems: "center", 
          gap: 2, 
          mt: 2,
          mb: 3
        }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#E91E63', background: '#FCE7F3', width: '100%', height: '100%', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {supplier?.inisial || 'SP'}
            </span>
          </Box>
          <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>{supplier?.nama}</Typography>
            <Typography sx={{ color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>ID: {supplier?.id}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <Button type="button" variant="outlined" sx={{ flex: 1, fontWeight: 700, fontSize: 15, borderRadius: 2, borderColor: '#F1F5F9', color: '#1E293B', '&:hover': { bgcolor: '#F8FAFC', borderColor: '#E2E8F0' } }} onClick={onClose}>
            Batal
          </Button>
          <Button type="button" sx={{ flex: 1, fontWeight: 700, fontSize: 15, borderRadius: 2, bgcolor: '#E91E63', color: '#fff', '&:hover': { bgcolor: '#D81B60' }, boxShadow: '0 4px 14px rgba(233,30,99,0.3)' }} onClick={() => onDelete && onDelete(supplier.id)}>
            Hapus Supplier
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: "#E91E63", mt: 3, bgcolor: '#FDF2F8', py: 1, px: 2, borderRadius: 2 }}>
          <InfoOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>
            AKSI PERMANEN
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HapusSupplierConfirm;
