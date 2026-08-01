import React from "react";
import { Button as MuiButton } from "@mui/material";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
} from "@/theme/designTokens";

const Button = ({ children, color = "primary", variant = "contained", sx = {}, ...props }) => {
  const colorStyles =
    color === "primary"
      ? {
          background: colors.primary,
          color: colors.textOnDark,
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": { background: colors.primaryHover },
        }
      : color === "pink"
        ? {
            background: colors.primary,
            color: colors.textOnDark,
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { background: colors.primaryHover },
          }
        : {};

  return (
    <MuiButton variant={variant} sx={{ textTransform: "none", ...colorStyles, ...sx }} {...props}>
      {children}
    </MuiButton>
  );
};

export default Button;
