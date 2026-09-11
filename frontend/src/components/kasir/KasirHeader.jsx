import React from "react";
import { Box, Typography, Chip, Button, IconButton, Badge } from "@mui/material";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const KasirHeader = ({ isPrinterReady, namaKasirAktif, holdListLength, onOpenHold, onOpenKasKecil, onOpenTutupShift, onOpenLogout }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <Chip icon={<LocalPrintshopIcon style={{ fontSize: 16, color: isPrinterReady ? "#2E7D32" : "#D32F2F" }} />} label={isPrinterReady ? "Printer: Ready" : "Printer: Offline"} sx={{ bgcolor: isPrinterReady ? "#E8F5E9" : "#FFEBEE", color: isPrinterReady ? "#2E7D32" : "#D32F2F", fontWeight: 700, fontSize: 12 }} />
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#64748B" }}>Kasir: <span style={{ color: "#1E293B" }}>{namaKasirAktif}</span></Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <IconButton size="small" onClick={onOpenHold} sx={{ bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", p: 1 }}>
          <Badge badgeContent={holdListLength} color="error"><ReceiptLongIcon sx={{ fontSize: 20, color: "#64748B" }} /></Badge>
        </IconButton>
        <Button variant="contained" startIcon={<AccountBalanceWalletIcon />} onClick={onOpenKasKecil} sx={{ bgcolor: "#FCE4EC", color: "#D81B60", boxShadow: "none", fontWeight: 700, borderRadius: "8px", "&:hover": { bgcolor: "#F8BBD0" } }}>Kas Kecil</Button>
        <Button variant="contained" startIcon={<LockIcon />} onClick={onOpenTutupShift} sx={{ bgcolor: "#FF9800", color: "#FFFFFF", boxShadow: "none", fontWeight: 700, borderRadius: "8px", "&:hover": { bgcolor: "#F57C00" } }}>Tutup Shift</Button>
        <IconButton size="small" onClick={onOpenLogout} sx={{ bgcolor: "#FFEEEF", color: "#D81B60", borderRadius: "8px", p: 1 }}><LogoutIcon sx={{ fontSize: 20 }} /></IconButton>
      </Box>
    </Box>
  );
};

export default KasirHeader;