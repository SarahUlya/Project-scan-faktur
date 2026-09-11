import React from "react";
import { Box, Typography, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";

const RiwayatHeader = ({ showFilter, onToggleFilter, onExportPDF }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1E293B", mb: 0.5 }}>
          Riwayat Transaksi & Shift
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          Melacak semua transaksi penjualan dan rekapitulasi sesi kasir.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button 
          variant={showFilter ? "contained" : "outlined"} 
          onClick={onToggleFilter} 
          startIcon={showFilter ? <CloseIcon /> : <FilterListIcon />} 
          sx={{ 
            borderColor: "#E2E8F0", fontWeight: 700, textTransform: "none", 
            bgcolor: showFilter ? "#D81B60" : "#FFF", color: showFilter ? "#FFF" : "#475569" 
          }}
        >
          {showFilter ? "Tutup Filter" : "Filter"}
        </Button>
        <Button 
          variant="outlined" 
          onClick={onExportPDF} 
          startIcon={<PictureAsPdfIcon />} 
          sx={{ borderColor: "#E2E8F0", color: "#475569", fontWeight: 700, textTransform: "none", bgcolor: "#FFF" }}
        >
          Export PDF
        </Button>
      </Box>
    </Box>
  );
};

export default RiwayatHeader;