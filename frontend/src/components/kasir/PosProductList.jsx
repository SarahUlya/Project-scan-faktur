import React from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { usePos } from "../../context/PosContext";
import { formatRupiahPos } from "../../utils/posCalculations";

const PosProductList = ({ produk, getNamaKategori }) => {
  const { addToCart } = usePos();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {produk.map((item) => {
        const habis = (item.stok || 0) <= 0;
        return (
          <Box
            key={item.id_produk}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              bgcolor: "#fff",
              borderRadius: 2,
              border: "1px solid #F1F5F9",
              opacity: habis ? 0.5 : 1,
            }}
          >
            <Box sx={{ width: 48, height: 48, bgcolor: "#F8FAFC", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MedicationIcon sx={{ color: "#CBD5E1" }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#1E293B" }} noWrap>
                {item.nama_produk}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#94A3B8" }}>
                {getNamaKategori(item.id_kategori)} · Stok: <strong>{item.stok ?? 0}</strong>
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, color: "#E91E63", fontSize: 14, whiteSpace: "nowrap" }}>
              Rp {formatRupiahPos(item.harga_jual)}
            </Typography>
            {habis ? (
              <Chip label="Kosong" size="small" sx={{ fontWeight: 700, fontSize: 10 }} />
            ) : (
              <IconButton size="small" onClick={() => addToCart(item, 1)} sx={{ color: "#E91E63" }}>
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default PosProductList;
