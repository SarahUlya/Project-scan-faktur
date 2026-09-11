import React, { useState } from "react";
import {
  Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Paper, Divider, TextField, MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const HoldTransaksiModal = ({ open, onClose, holdList = [], onRecall, onDelete, activeCart = [], onSaveHold }) => {
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [alasanHold, setAlasanHold] = useState("Ambil dompet / uang tertinggal");

  // Jika activeCart dikirim (artinya mode ingin menahan keranjang aktif saat ini)
  const isCreatingHold = Boolean(activeCart && activeCart.length > 0 && onSaveHold);

  const subtotalCart = activeCart?.reduce((acc, item) => acc + ((item.harga || item.harga_jual || 0) * item.qty), 0) || 0;

  const handleSimpan = () => {
    if (onSaveHold) {
      onSaveHold({ nama: namaPelanggan || "Umum", alasan: alasanHold });
      setNamaPelanggan("");
      setAlasanHold("Ambil dompet / uang tertinggal");
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      PaperProps={{ sx: { borderRadius: "16px", width: "480px", p: 0, overflow: "hidden" } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: "50%", bgcolor: "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PauseCircleOutlineIcon sx={{ color: "#D81B60", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#1E293B", lineHeight: 1.2 }}>
              {isCreatingHold ? "Tahan Transaksi (Hold)" : "Daftar Transaksi Ditahan (Hold)"}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#64748B" }}>
              {isCreatingHold ? "Simpan keranjang saat ini untuk melayani pelanggan lain terlebih dahulu." : "Pilih transaksi yang ingin dilanjutkan atau dihapus"}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#94A3B8" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      <DialogContent sx={{ px: 3, py: 2, maxHeight: "400px", overflowY: "auto" }}>
        {isCreatingHold ? (
          <Box>
            {/* Ringkasan Keranjang Saat Ini */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", mb: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Ringkasan Keranjang</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#D81B60" }}>Rp{subtotalCart.toLocaleString("id-ID")}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1 }}>
                {activeCart.map((it, idx) => (
                  <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B" }}>
                    <span>• {it.nama_produk || it.nama} ({it.qty}x)</span>
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>Rp{(((it.harga || it.harga_jual || 0) * it.qty)).toLocaleString("id-ID")}</span>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Input Nama Pelanggan */}
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", mb: 1 }}>Nama / Identitas Pelanggan (Opsional)</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Contoh: Ibu Ani / Antrean 04" 
              value={namaPelanggan} 
              onChange={(e) => setNamaPelanggan(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} 
            />

            {/* Alasan Catatan Tahan */}
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", mb: 1 }}>Alasan / Catatan Tahan</Typography>
            <TextField 
              select 
              fullWidth 
              size="small" 
              value={alasanHold} 
              onChange={(e) => setAlasanHold(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
            >
              <MenuItem value="Ambil dompet / uang tertinggal">Ambil dompet / uang tertinggal</MenuItem>
              <MenuItem value="Ambil resep dokter tertinggal">Ambil resep dokter tertinggal</MenuItem>
              <MenuItem value="Ganti produk / ambil obat lain">Ganti produk / ambil obat lain</MenuItem>
              <MenuItem value="Lainnya">Lainnya</MenuItem>
            </TextField>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#94A3B8", px: 0.5 }}>
              <span>Ref Tag: <b>#HOLD-00{holdList.length + 1}</b></span>
              <span>{new Date().toLocaleTimeString("id-ID", {hour: '2-digit', minute:'2-digit'})} WIB</span>
            </Box>
          </Box>
        ) : (
          /* Daftar Hold yang sudah ada (List Recall) */
          holdList.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography sx={{ color: "#94A3B8", fontSize: 14, fontWeight: 600 }}>
                Tidak ada transaksi yang sedang ditahan.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {holdList.map((holdItem, index) => {
                const totalItems = holdItem.cart?.reduce((acc, item) => acc + item.qty, 0) || 0;
                const totalAmount = holdItem.cart?.reduce((acc, item) => acc + ((item.harga || item.harga_jual || 0) * item.qty), 0) || 0;
                
                return (
                  <Paper 
                    key={index} 
                    elevation={0} 
                    sx={{ 
                      p: 2, borderRadius: "10px", border: "1px solid #E2E8F0", 
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      bgcolor: "#F8FAFC", transition: "all 0.2s",
                      "&:hover": { borderColor: "#CBD5E1", bgcolor: "#F1F5F9" }
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#1E293B" }}>
                        {holdItem.nama ? `Hold: ${holdItem.nama}` : `Hold #${index + 1}`} • <span style={{ color: "#64748B", fontSize: 12 }}>{holdItem.time || "Baru saja"}</span>
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#475569", mt: 0.5 }}>
                        <b>{totalItems}</b> Item • Total: <b style={{ color: "#D81B60" }}>Rp{totalAmount.toLocaleString("id-ID")}</b> {holdItem.alasan && `• (${holdItem.alasan})`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button 
                        variant="contained" size="small" 
                        startIcon={<PlayArrowIcon sx={{ fontSize: "16px !important" }} />}
                        onClick={() => onRecall(index)}
                        sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 700, fontSize: 12, textTransform: "none", boxShadow: "none", borderRadius: "6px", "&:hover": { bgcolor: "#C8E6C9" } }}
                      >
                        Recall
                      </Button>
                      <IconButton size="small" onClick={() => onDelete(index)} sx={{ color: "#EF4444", bgcolor: "#FEE2E2", borderRadius: "6px", p: 1, "&:hover": { bgcolor: "#FDCBCE" } }}>
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={onClose} sx={{ color: "#64748B", fontWeight: 700, textTransform: "none" }}>
          Batal [Esc]
        </Button>
        {isCreatingHold && (
          <Button 
            variant="contained" 
            onClick={handleSimpan} 
            sx={{ bgcolor: "#D81B60", color: "#FFFFFF", fontWeight: 700, borderRadius: "8px", textTransform: "none", boxShadow: "none", px: 3, "&:hover": { bgcolor: "#C2185B" } }}
          >
            Simpan & Tahan [Enter]
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default HoldTransaksiModal;