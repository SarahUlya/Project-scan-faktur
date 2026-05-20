import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import AddIcon from "@mui/icons-material/Add";
import { usePos } from "../../context/PosContext";
import { formatRupiahPos } from "../../utils/posCalculations";

const PosProductGrid = ({ produk, getNamaKategori }) => {
  const { addToCart } = usePos();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 1.5,
      }}
    >
      {produk.map((item) => {
        const habis = (item.stok || 0) <= 0;
        if (habis) return null;
        
        const terbatas = item.stok > 0 && item.stok <= 10;
        const nonaktif = item.is_active === false;

        return (
          <Box
            key={item.id_produk}
            onClick={() => !nonaktif && addToCart(item, 1)}
            sx={{
              background: "#fff",
              borderRadius: 2,
              p: 1.5,
              border: "1px solid #F1F5F9",
              cursor: nonaktif ? "not-allowed" : "pointer",
              opacity: nonaktif ? 0.55 : 1,
              transition: "all 0.2s",
              "&:hover": nonaktif ? {} : { boxShadow: "0 6px 16px rgba(233,30,99,0.12)", borderColor: "#E91E63" },
            }}
          >
            <Box sx={{ position: "relative", mb: 1 }}>
              <Box
                sx={{
                  height: 80,
                  bgcolor: "#F8FAFC",
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MedicationIcon sx={{ fontSize: 32, color: "#CBD5E1" }} />
              </Box>
              {terbatas && (
                <Chip label="Terbatas" size="small" sx={{ position: "absolute", top: 4, left: 4, fontWeight: 700, fontSize: 9, bgcolor: "#FEF3C7", color: "#92400E" }} />
              )}
              <Typography sx={{ position: "absolute", bottom: 2, right: 4, fontSize: 9, fontWeight: 700, color: "#64748B" }}>
                Stok: {item.stok ?? 0}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 9, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", mb: 0.5 }}>
              {getNamaKategori(item.id_kategori)}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 12, color: "#1E293B", lineHeight: 1.2, minHeight: 28, mb: 0.5 }}>
              {item.nama_produk}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ color: "#E91E63", fontWeight: 800, fontSize: 13 }}>
                Rp {formatRupiahPos(item.harga_jual)}
              </Typography>
              {!nonaktif && (
                <Typography sx={{ color: "#E91E63", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", gap: 0.2 }}>
                  <AddIcon sx={{ fontSize: 14 }} /> Tambah
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default PosProductGrid;
