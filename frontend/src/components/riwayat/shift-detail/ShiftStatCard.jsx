import React from "react";
import { Box, Typography } from "@mui/material";
import { colors, radii, typography } from "../../../theme/designTokens";

const ShiftStatCard = ({ label, value, sub, highlight, valueColor }) => (
  <Box
    sx={{
      bgcolor: colors.bgMuted,
      border: highlight
        ? `1px solid ${colors.successLight}`
        : `1px solid ${colors.border}`,
      borderRadius: `${radii.md + 4}px`,
      p: 1.75,
      textAlign: "center",
      background: highlight
        ? `linear-gradient(180deg, #FFFFFF 0%, ${colors.successLight}66 100%)`
        : colors.bgMuted,
    }}
  >
    <Typography
      sx={{
        fontSize: typography.tiny,
        fontWeight: typography.bold,
        color: colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        mb: 0.25,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: highlight ? 17 : 22,
        fontWeight: typography.bold,
        color: valueColor || colors.text,
        lineHeight: 1.2,
        letterSpacing: "-0.3px",
      }}
    >
      {value}
    </Typography>
    {sub && (
      <Typography
        sx={{
          fontSize: typography.tiny,
          color: colors.textSecondary,
          fontWeight: typography.medium,
          mt: 0.25,
        }}
      >
        {sub}
      </Typography>
    )}
  </Box>
);

export default ShiftStatCard;