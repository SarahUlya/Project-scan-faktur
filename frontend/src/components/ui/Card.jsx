import React from "react";
import { Paper } from "@mui/material";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
} from "@/theme/designTokens";

const Card = ({ children, sx = {}, ...props }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: `${radii.md}px`,
      p: 3,
      background: colors.bgCard,
      border: `1px solid ${colors.borderLight}`,
      boxShadow: shadows.card,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Paper>
);

export default Card;
