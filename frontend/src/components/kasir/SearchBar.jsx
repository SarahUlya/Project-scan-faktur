import React from "react";
import { Box, } from "@mui/material";
import { forwardRef } from "react";
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

/**
 * Reusable search input used for both product search and barcode input.
 * Height is fixed to 48px, border radius 12px, fast transition (150ms).
 */
const SearchBar = forwardRef(
  ({ placeholder, value, onChange, onKeyDown, autoFocus }, ref) => {
    const commonStyle = {
      flex: 1,
      minWidth: 200,
      height: 48,
      padding: "11px 14px",
      borderRadius: 12,
      border: "1.5px solid " + colors.border,
      fontSize: 13,
      outline: "none",
      backgroundColor: colors.bgCard,
      color: colors.text,
      fontWeight: 500,
      transition: "all 150ms ease",
    };

    const handleFocus = (e) => {
      e.target.style.borderColor = colors.primary;
      e.target.style.boxShadow = "0 0 0 2px " + colors.primaryLight;
    };
    const handleBlur = (e) => {
      e.target.style.borderColor = colors.border;
      e.target.style.boxShadow = "0 1px 3px " + colors.shadow;
    };

    return (
      <Box
        ref={ref}
        component="input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        style={commonStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }
);

export default SearchBar;
