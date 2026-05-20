import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { usePos } from "../../context/PosContext";
import { formatRupiahPos } from "../../utils/posCalculations";

const PosProductList = ({ produk, getNamaKategori }) => {
  const { addToCart } = usePos();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {produk.map((item) => {
        const habis = (item.stok || 0) <= 0;
        if (habis) return null;

        return (
          <Box
            key={item.id_produk}
            onClick={() => addToCart(item, 1)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.25,
              bgcolor: "#fff",
              borderRadius: 1.5,
              border: "1px solid #F1F5F9",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "#FFF8FA",
                boxShadow: "0 4px 12px rgba(233,30,99,0.08)",
                borderColor: "#E91E63",
              }
            }}
          >
            <Box sx={{ width: 40, height: 40, bgcolor: "#F8FAFC", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MedicationIcon sx={{ color: "#CBD5E1", fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }} noWrap>
                {item.nama_produk}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#94A3B8" }}>
                {getNamaKategori(item.id_kategori)} · Stok: <strong>{item.stok ?? 0}</strong>
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, color: "#E91E63", fontSize: 13, whiteSpace: "nowrap", marginRight: 1 }}>
              Rp {formatRupiahPos(item.harga_jual)}
            </Typography>
            <IconButton size="small" onClick={() => addToCart(item, 1)} sx={{ color: "#E91E63", padding: "6px" }}>
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
};

export default PosProductList;
