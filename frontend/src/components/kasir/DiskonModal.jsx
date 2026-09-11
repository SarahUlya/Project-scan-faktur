import React from "react";
import { Box, Typography, Button, IconButton, Dialog, DialogContent, DialogActions, Divider, TextField, MenuItem, Paper } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import CloseIcon from "@mui/icons-material/Close";

const DiskonModal = ({ 
  open, onClose, kategoriDiskon, setKategoriDiskon, 
  tipeDiskon, setTipeDiskon, inputDiskon, setInputDiskon, 
  subtotal, setDiskonNominal, handleApplyDiskon 
}) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: "16px", width: "480px", p: 0, overflow: "hidden" } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: "50%", bgcolor: "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DiscountIcon sx={{ color: "#D81B60", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#1E293B", lineHeight: 1.2 }}>Terapkan Diskon</Typography>
            <Typography sx={{ fontSize: 12, color: "#64748B" }}>Tentukan potongan untuk nota atau per item</Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#94A3B8" }}><CloseIcon fontSize="small" /></IconButton>
      </Box>
      <Divider />
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", bgcolor: "#F1F5F9", p: "4px", borderRadius: "10px", mb: 2.5 }}>
          <Button fullWidth size="small" onClick={() => setKategoriDiskon("nota")} sx={{ bgcolor: kategoriDiskon === "nota" ? "#FFFFFF" : "transparent", color: kategoriDiskon === "nota" ? "#1E293B" : "#64748B", fontWeight: 700, borderRadius: "8px", textTransform: "none", boxShadow: kategoriDiskon === "nota" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>Diskon Nota</Button>
          <Button fullWidth size="small" onClick={() => setKategoriDiskon("item")} sx={{ bgcolor: kategoriDiskon === "item" ? "#FFFFFF" : "transparent", color: kategoriDiskon === "item" ? "#1E293B" : "#64748B", fontWeight: 700, borderRadius: "8px", textTransform: "none", boxShadow: kategoriDiskon === "item" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>Per Item</Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Pilihan Diskon Cepat</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" onClick={() => setTipeDiskon("%")} sx={{ minWidth: 28, height: 24, fontSize: 11, fontWeight: 800, bgcolor: tipeDiskon === "%" ? "#FFF0F5" : "transparent", color: tipeDiskon === "%" ? "#D81B60" : "#64748B" }}>%</Button>
            <Button size="small" onClick={() => setTipeDiskon("Rp")} sx={{ minWidth: 28, height: 24, fontSize: 11, fontWeight: 800, bgcolor: tipeDiskon === "Rp" ? "#FFF0F5" : "transparent", color: tipeDiskon === "Rp" ? "#D81B60" : "#64748B" }}>Rp</Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
          {[5, 10, 15, 20].map((num) => (
            <Button key={num} variant="outlined" onClick={() => { setTipeDiskon("%"); setInputDiskon(String(num)); }} sx={{ flex: 1, borderColor: "#E2E8F0", color: "#334155", fontWeight: 700, fontSize: 13, py: 1, borderRadius: "8px", "&:hover": { borderColor: "#D81B60", bgcolor: "#FFF0F5" } }}>{num}%</Button>
          ))}
          <Button variant="outlined" onClick={() => { setTipeDiskon("Rp"); setInputDiskon("5000"); }} sx={{ flex: 1.2, borderColor: "#E2E8F0", color: "#334155", fontWeight: 700, fontSize: 12, py: 1, borderRadius: "8px", "&:hover": { borderColor: "#D81B60", bgcolor: "#FFF0F5" } }}>Rp5.000</Button>
        </Box>

        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", mb: 1 }}>Nilai Potongan</Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField select size="small" value={tipeDiskon} onChange={(e) => setTipeDiskon(e.target.value)} sx={{ width: "90px", "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}>
            <MenuItem value="Rp">Rp</MenuItem>
            <MenuItem value="%">%</MenuItem>
          </TextField>
          <TextField fullWidth size="small" type="number" placeholder={tipeDiskon === "%" ? "Contoh: 10" : "Contoh: 15000"} value={inputDiskon} onChange={(e) => setInputDiskon(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} autoFocus />
        </Box>

        <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, fontSize: 13 }}>
            <Typography sx={{ color: "#64748B" }}>Subtotal</Typography>
            <Typography sx={{ fontWeight: 600, color: "#1E293B" }}>Rp{subtotal.toLocaleString("id-ID")}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, fontSize: 13 }}>
            <Typography sx={{ color: "#64748B" }}>Diskon</Typography>
            <Typography sx={{ fontWeight: 600, color: "#D81B60" }}>- Rp{tipeDiskon === "%" ? ((subtotal * (Number(inputDiskon) || 0)) / 100).toLocaleString("id-ID") : (Number(inputDiskon) || 0).toLocaleString("id-ID")}</Typography>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => { setDiskonNominal(0); onClose(); }} sx={{ color: "#EF4444", fontWeight: 700, textTransform: "none" }}>Hapus Diskon</Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onClose} sx={{ color: "#64748B", fontWeight: 700, textTransform: "none" }}>Batal</Button>
          <Button variant="contained" onClick={handleApplyDiskon} sx={{ bgcolor: "#D81B60", color: "#FFFFFF", fontWeight: 700, borderRadius: "8px", textTransform: "none", boxShadow: "none", px: 3, "&:hover": { bgcolor: "#C2185B" } }}>Terapkan</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DiskonModal;