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
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 2,
      }}
    >
      {produk.map((item) => {
        const habis = (item.stok || 0) <= 0;
        const terbatas = item.stok > 0 && item.stok <= 10;
        const nonaktif = item.is_active === false;

        return (
          <Box
            key={item.id_produk}
            onClick={() => !habis && !nonaktif && addToCart(item, 1)}
            sx={{
              background: "#fff",
              borderRadius: 3,
              p: 2,
              border: "1px solid #F1F5F9",
              cursor: habis || nonaktif ? "not-allowed" : "pointer",
              opacity: habis || nonaktif ? 0.55 : 1,
              transition: "box-shadow 0.2s",
              "&:hover": habis || nonaktif ? {} : { boxShadow: "0 8px 24px rgba(233,30,99,0.1)" },
            }}
          >
            <Box sx={{ position: "relative", mb: 1.5 }}>
              <Box
                sx={{
                  height: 100,
                  bgcolor: "#F8FAFC",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MedicationIcon sx={{ fontSize: 40, color: "#CBD5E1" }} />
              </Box>
              {habis && (
                <Chip label="STOK KOSONG" size="small" sx={{ position: "absolute", top: 8, left: 8, fontWeight: 800, fontSize: 9, bgcolor: "#FEE2E2", color: "#DC2626" }} />
              )}
              {terbatas && !habis && (
                <Chip label="Stok Terbatas" size="small" sx={{ position: "absolute", top: 8, left: 8, fontWeight: 700, fontSize: 9, bgcolor: "#FEF3C7", color: "#D97706" }} />
              )}
              <Typography sx={{ position: "absolute", bottom: 4, right: 8, fontSize: 10, fontWeight: 700, color: "#64748B" }}>
                Stok: {item.stok ?? 0}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>
              {getNamaKategori(item.id_kategori)}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#1E293B", lineHeight: 1.3, minHeight: 36 }}>
              {item.nama_produk}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
              <Typography sx={{ color: "#E91E63", fontWeight: 800, fontSize: 15 }}>
                Rp {formatRupiahPos(item.harga_jual)}
              </Typography>
              {!habis && !nonaktif && (
                <Typography sx={{ color: "#E91E63", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", gap: 0.3 }}>
                  <AddIcon sx={{ fontSize: 16 }} /> Tambah
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
