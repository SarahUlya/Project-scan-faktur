import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import AddIcon from "@mui/icons-material/Add";
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

const PosProductGrid = ({ produk, getNamaKategori }) => {
  const { addToCart } = usePos();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(190px,1fr))",
        gap: spacing.sm,
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
              background: colors.bgCard,
              borderRadius: `${radii.sm}px`,
              p: 1.5,
              border: `1px solid ${colors.border}`,
              height: 250,
              display: "flex",
              flexDirection: "column",
              cursor: nonaktif ? "not-allowed" : "pointer",
              opacity: nonaktif ? 0.5 : 1,
              transition: transitions.fast,
              position: "relative",
              overflow: "hidden",
              "&:hover": nonaktif
                ? {}
                : {
                    boxShadow: shadows.card,
                    borderColor: colors.primary,
                    transform: "translateY(-2px)",
                  },
            }}
          >
            {/* Product Image Area */}
            <Box
              sx={{
                height: 95,
                bgcolor: colors.bgMuted,
                borderRadius: `${radii.sm}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
                position: "relative",
              }}
            >
              <MedicationIcon
                sx={{ fontSize: 26, color: colors.primary, opacity: 0.7 }}
              />
            </Box>

            {/* Category */}
            <Typography
              sx={{
                fontSize: 10,
                color: colors.primary,
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 0.5,
                letterSpacing: 0.3,
              }}
            >
              {getNamaKategori(item.id_kategori)}
            </Typography>

            {/* Product Name */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 12,
                color: colors.text,
                lineHeight: 1.2,
                height: 34,
                mb: 0.75,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.nama_produk}
            </Typography>

            {/* Stock Row (Inline and Prominent) */}
            <Box
              sx={{
                mt: "auto",
              }}
            >
              <Typography sx={{ fontSize: 11, color: colors.textSecondary }}>
                Stok:{" "}
                <strong
                  style={{
                    color: colors.text,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {item.stok ?? 0}
                </strong>
              </Typography>
              {terbatas && (
                <Typography
                  sx={{
                    fontSize: 9,
                    color: colors.warning,
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Terbatas
                </Typography>
              )}
            </Box>

            {/* Price & Add Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{ color: colors.text, fontWeight: 800, fontSize: 12 }}
              >
                Rp {formatRupiahPos(item.harga_jual)}
              </Typography>
              {!nonaktif && (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: colors.bgCard,
                    color: colors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    "&:hover": {
                      bgcolor: colors.primary,
                      color: colors.bgCard,
                      boxShadow: shadows.card,
                      transform: "translateY(-1px)",
                    },
                    transition: transitions.fast,
                  }}
                >
                  <AddIcon sx={{ fontSize: "small" }} />
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
