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
        gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
        gap: 2,
      }}
    >
      {produk.map((item) => {
        console.log(item.nama_produk, item.stok);
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
              borderRadius: "12px",
              p: 1.5,
              border: "1px solid #E2E8F0",
              cursor: nonaktif ? "not-allowed" : "pointer",
              opacity: nonaktif ? 0.5 : 1,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              "&:hover": nonaktif ? {} : {
                boxShadow: "0 12px 24px rgba(15, 118, 110,0.15)",
                borderColor: "#0F766E",
                transform: "translateY(-4px)",
              },
            }}
          >
            {/* Background Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "100%",
                background: "linear-gradient(135deg, rgba(15, 118, 110,0) 0%, rgba(15, 118, 110,0.02) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Product Image Area */}
            <Box
              sx={{
                height: 90,
                bgcolor: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
                position: "relative",
              }}
            >
              <MedicationIcon sx={{ fontSize: 40, color: "#0F766E", opacity: 0.7 }} />
            </Box>

            {/* Badge Area */}
            {terbatas && (
              <Chip
                label="⚠️ Terbatas"
                size="small"
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  fontWeight: 700,
                  fontSize: 10,
                  bgcolor: "#FEF3C7",
                  color: "#92400E",
                  height: 24,
                }}
              />
            )}

            {/* Stock Badge */}
            <Typography
              sx={{
                position: "absolute",
                bottom: 12,
                right: 10,
                fontSize: 10,
                fontWeight: 700,
                color: "#94A3B8",
                background: "#F8FAFC",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            >
              {item.stok ?? 0}
            </Typography>

            {/* Category */}
            <Typography sx={{ fontSize: 10, color: "#0F766E", fontWeight: 700, textTransform: "uppercase", mb: 0.5, letterSpacing: 0.3 }}>
              {getNamaKategori(item.id_kategori)}
            </Typography>

            {/* Product Name */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 13,
                color: "#1E293B",
                lineHeight: 1.3,
                minHeight: 32,
                mb: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.nama_produk}
            </Typography>

            {/* Price & Add Button */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
              <Typography sx={{ color: "#0F766E", fontWeight: 800, fontSize: 13 }}>
                Rp {formatRupiahPos(item.harga_jual)}
              </Typography>
              {!nonaktif && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.3,
                    color: "#0F766E",
                    fontWeight: 700,
                    fontSize: 11,
                    opacity: 0.7,
                    transition: "all 0.2s",
                  }}
                >
                  <AddIcon sx={{ fontSize: 14 }} />
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default PosProductGrid;
