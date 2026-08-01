import React from "react";
import { Box, Typography } from "@mui/material";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
} from "@/theme/designTokens";


const FakturFormSection = ({ title, subtitle, children }) => (
  <Box
    sx={{
      background: colors.bgCard,
      borderRadius: 2,
      border: "1px solid" + colors.bg,
      mb: 2,
      overflow: "hidden",
    }}
  >
    <Box sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid" + colors.bg }}>
      <Typography sx={{ fontWeight: 600, fontSize: 14, color: colors.text }}>{title}</Typography>
      {subtitle && (
        <Typography sx={{ fontSize: 12, color: colors.textSecondary, mt: 0.25 }}>{subtitle}</Typography>
      )}
    </Box>
    <Box sx={{ p: 2.5 }}>{children}</Box>
  </Box>
);

export const FormField = ({ label, required, children, sx = {} }) => (
  <Box sx={sx}>
    <Typography
      component="label"
      sx={{
        display: "block",
        color: colors.textSecondary,
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        mb: 0.5,
      }}
    >
      {label}
      {required && <Box component="span" sx={{ color: colors.error, ml: 0.25 }}>*</Box>}
    </Typography>
    {children}
  </Box>
);

export default FakturFormSection;
