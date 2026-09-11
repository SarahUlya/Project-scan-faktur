import React, { forwardRef } from "react";
import { Box, InputAdornment, IconButton } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { colors, radii, shadows } from "@/theme/designTokens";

/**
 * Reusable search input untuk pencarian produk & scan barcode fisik.
 * Height 48px, border radius 12px, dengan animasi smooth focus.
 */
const SearchBar = forwardRef(
  ({ placeholder, value, onChange, onKeyDown, onClear, autoFocus }, ref) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: 48,
          px: 1.5,
          borderRadius: `${radii.sm || 12}px`,
          border: `1.5px solid ${colors.border}`,
          bgcolor: colors.bgCard || "#FFFFFF",
          boxShadow: `0 1px 3px ${colors.shadow || "rgba(0,0,0,0.05)"}`,
          transition: "all 150ms ease",
          "&:focus-within": {
            borderColor: colors.primary || "#D81B60",
            boxShadow: `0 0 0 3px ${colors.primaryLight || "#FCE4EC"}`,
          },
        }}
      >
        {/* Left Icon: Barcode Scanner */}
        <InputAdornment position="start" sx={{ mr: 1, color: colors.primary || "#D81B60" }}>
          <QrCodeScannerIcon sx={{ fontSize: 22 }} />
        </InputAdornment>

        {/* Real Input Element */}
        <Box
          component="input"
          ref={ref}
          type="text"
          placeholder={placeholder || "Scan barcode fisik di sini..."}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          sx={{
            flex: 1,
            border: "none",
            outline: "none",
            bgcolor: "transparent",
            fontSize: 14,
            fontWeight: 600,
            color: colors.text || "#1E293B",
            fontFamily: "inherit",
            "&::placeholder": {
              color: colors.textSecondary || "#94A3B8",
              fontWeight: 500,
            },
          }}
        />

        {/* Right Icon: Clear Button / Search Visual */}
        {value ? (
          <IconButton
            size="small"
            onClick={() => {
              if (onClear) onClear();
              else if (onChange) onChange({ target: { value: "" } });
            }}
            sx={{
              p: 0.5,
              color: colors.textSecondary || "#94A3B8",
              "&:hover": { color: colors.primary || "#D81B60" },
            }}
          >
            <ClearIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : (
          <SearchIcon sx={{ fontSize: 20, color: colors.textSecondary || "#94A3B8", ml: 1 }} />
        )}
      </Box>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;