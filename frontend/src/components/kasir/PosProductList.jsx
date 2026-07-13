import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
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
        if (habis) return null;

        const terbatas = item.stok > 0 && item.stok <= 10;

        return (
          <Box
            key={item.id_produk}
            onClick={() => addToCart(item, 1)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: "12px 14px",
              bgcolor: "#fff",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(90deg, rgba(15, 118, 110,0.02) 0%, transparent 100%)",
                pointerEvents: "none",
              },
              "&:hover": {
                bgcolor: "#FFF8FA",
                boxShadow: "0 8px 16px rgba(15, 118, 110,0.12)",
                borderColor: "#0F766E",
                transform: "translateX(4px)",
              }
            }}
          >
            {/* Product Icon */}
            <Box
              sx={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <MedicationIcon sx={{ color: "#0F766E", fontSize: 22 }} />
            </Box>

            {/* Product Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }} noWrap>
                {item.nama_produk}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.3 }}>
                <Typography sx={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>
                  {getNamaKategori(item.id_kategori)}
                </Typography>
                <Box sx={{ width: 1, height: 1, bgcolor: "#E2E8F0", borderRadius: "50%" }} />
                <Typography sx={{ fontSize: 11, color: "#64748B" }}>
                  Stok: <strong style={{ color: terbatas ? "#F59E0B" : "#10B981" }}>{item.stok ?? 0}</strong>
                </Typography>
                {terbatas && (
                  <>
                    <Box sx={{ width: 1, height: 1, bgcolor: "#E2E8F0", borderRadius: "50%" }} />
                    <Typography sx={{ fontSize: 10, color: "#F59E0B", fontWeight: 700, textTransform: "uppercase" }}>
                      ⚠️ Terbatas
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            {/* Price */}
            <Typography sx={{ fontWeight: 800, color: "#0F766E", fontSize: 13, whiteSpace: "nowrap" }}>
              Rp {formatRupiahPos(item.harga_jual)}
            </Typography>

            {/* Add Button */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item, 1);
              }}
              sx={{
                color: "#0F766E",
                padding: "6px",
                transition: "all 0.2s",
                "&:hover": {
                  background: "rgba(15, 118, 110, 0.08)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
};

export default PosProductList;
