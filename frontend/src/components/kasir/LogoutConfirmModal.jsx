import React from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const LogoutConfirmModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: "14px", p: 1, width: "400px" } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#FFEEEF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HelpOutlineIcon sx={{ color: "#D81B60" }} />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#1E293B" }}>Konfirmasi Logout</Typography>
      </DialogTitle>
      <DialogContent><Typography sx={{ color: "#64748B", fontSize: 14 }}>Apakah Anda yakin ingin keluar dari kasir?</Typography></DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#64748B", fontWeight: 700 }}>Batal</Button>
        <Button variant="contained" onClick={onConfirm} sx={{ bgcolor: "#D81B60", color: "#FFFFFF", fontWeight: 700, borderRadius: "8px", boxShadow: "none" }}>Ya, Logout</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmModal;