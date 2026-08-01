import React from "react";
import { Box, Typography } from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import { colors, radii, spacing, typography } from "@/theme/designTokens";

const ProductCard = ({ item, getNamaKategori, getNamaSatuan }) => {
  return (
    <Box
      sx={{
        background: colors.bgCard,
        borderRadius: `${radii.md}px`,
        p: spacing.sm,
        border: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: 200,
      }}
    >
      <Box
        sx={{
          height: 120,
          bgcolor: colors.bgMuted,
          borderRadius: `${radii.sm}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: spacing.xs,
          width: "100%",
        }}
      >
        <MedicationIcon sx={{ fontSize: 48, color: colors.border }} />
      </Box>

      <Typography fontSize={typography.body}>
        {getNamaKategori(item.id_kategori)}
      </Typography>

      <Typography fontWeight={700}>
        {item.nama_produk}
      </Typography>

      <Typography fontSize={typography.body}>
        {getNamaSatuan(item.id_satuan)}
      </Typography>

      <Typography
        sx={{
          mt: spacing.xs,
          color: colors.primary,
          fontWeight: 700,
        }}
      >
        Rp {item.harga_jual}
      </Typography>
    </Box>
  );
};

export default ProductCard;