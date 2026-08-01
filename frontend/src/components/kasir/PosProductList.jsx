import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { usePos } from "../../context/PosContext";
import { formatRupiahPos } from "../../utils/posCalculations";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
} from "@/theme/designTokens";

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
              gap: spacing.md,
              p: "8px 12px",
              bgcolor: colors.bgCard,
              borderRadius: `${radii.sm}px`,
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
              transition: transitions.fast,
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                bgcolor: colors.bgMuted,
                boxShadow: shadows.card,
                borderColor: colors.primary,
                transform: "translateX(4px)",
              },
            }}
          >
            {/* Product Icon */}
            <Box
              sx={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, colors.primaryLight, colors.primary)",
                borderRadius: `${radii.sm}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <MedicationIcon sx={{ color: colors.primary, fontSize: 18 }} />
            </Box>

            {/* Product Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{ fontWeight: 700, fontSize: 12, color: colors.text }}
                noWrap
              >
                {item.nama_produk}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    color: colors.textSecondary,
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  {getNamaKategori(item.id_kategori)}
                </Typography>

                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    bgcolor: colors.border,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 10,
                    color: colors.textSecondary,
                    fontWeight: 500,
                  }}
                >
                  Stok
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: terbatas ? colors.stockMedium : colors.stockHigh,
                  }}
                >
                  {item.stok ?? 0}
                </Typography>
              </Box>
            </Box>

            {/* Price */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 14,
                color: colors.text,
                whiteSpace: "nowrap",
                letterSpacing: "-0.2px",
              }}
            >
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
                color: colors.primary,
                padding: `${spacing.xs}px`,
                transition: transitions.fast,
                "&:hover": {
                  background: `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.08)`,
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
