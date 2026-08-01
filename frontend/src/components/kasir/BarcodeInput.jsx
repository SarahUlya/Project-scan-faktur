import React, { forwardRef } from "react";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  zIndex,
  fieldInputSx,
  pageHeaderSx,
  statCardSx,
} from "@/theme/designTokens";

const BarcodeInput = forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      autoFocus
      style={{
        width: 190,
        height: 48,
        padding: "11px 14px",
        borderRadius: radii.sm,
        border: `1.5px solid ${colors.border}`,
        fontSize: typography.body,
        outline: "none",
        background: colors.bgCard,
        color: colors.text,
        fontWeight: 600,
        transition: "all .15s",
        boxShadow: "0 2px 4px " + colors.shadow,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = colors.primary;
        e.target.style.boxShadow = "0 0 0 2px " + colors.shadowFocus;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = colors.border;
        e.target.style.boxShadow = "0 1px 3px " + colors.shadow;
      }}
    />
  );
});

export default BarcodeInput;
