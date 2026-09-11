import React from "react";
import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";

const RingkasanBelanja = ({ subtotal, diskonNominal, pajakNominal, totalBayar, cartLength, onOpenDiskon, onProsesTransaksi }) => {
  return (
    <Box sx={{ width: "340px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: "10px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 2 }}>Ringkasan</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography sx={{ color: "#64748B", fontSize: 14 }}>Subtotal</Typography>
          <Typography sx={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>Rp{subtotal.toLocaleString("id-ID")}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography sx={{ color: "#64748B", fontSize: 14 }}>Diskon <span style={{ color: "#D81B60", cursor:"pointer", fontWeight: 700 }} onClick={onOpenDiskon}>[F4]</span></Typography>
          <Typography sx={{ fontWeight: 600, color: "#D81B60", fontSize: 14 }}>- Rp{diskonNominal.toLocaleString("id-ID")}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
          <Typography sx={{ color: "#64748B", fontSize: 14 }}>Pajak</Typography>
          <Typography sx={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>Rp{pajakNominal.toLocaleString("id-ID")}</Typography>
        </Box>
        <Divider sx={{ mb: 2.5 }} />
        <Typography sx={{ color: "#64748B", fontWeight: 600, fontSize: 14, mb: 1 }}>Total Bayar</Typography>
        <Typography variant="h3" sx={{ fontWeight: 900, color: "#D81B60", fontSize: 34, textAlign: "right" }}>Rp{totalBayar.toLocaleString("id-ID")}</Typography>
      </Paper>

      <Button 
        variant="contained" 
        disabled={cartLength === 0} 
        startIcon={<PaymentsIcon />} 
        onClick={onProsesTransaksi} 
        sx={{ bgcolor: "#D81B60", color: "#FFFFFF", py: 2, borderRadius: "10px", fontSize: 16, fontWeight: 800, textTransform: "uppercase", boxShadow: "none", "&:hover": { bgcolor: "#C2185B" } }}
      >
        PROSES TRANSAKSI [F8]
      </Button>
    </Box>
  );
};

export default RingkasanBelanja;