import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Button from "./Button";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
 pageHeaderSx,
} from "@/theme/designTokens";

const CrudPageHeader = ({
  title,
  description,
  searchValue,
  onSearch,
  searchPlaceholder = "Cari...",
  actionLabel,
  onAction,
  actionIcon,
  hideSearch = false,
}) => (
  <Box sx={{ bgcolor: colors.bgCard, borderRadius: 2, border: `1px solid ${colors.borderLight}`, p: 2.5, mb: 2.5 }}>
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
      <Box sx={{ minWidth: 240, flex: 1 }}>
        <Typography sx={pageHeaderSx.titletitle}>{title}</Typography>
        <Typography sx={pageHeaderSx.subtitle}>{description}</Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
        {!hideSearch && (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.textMuted, fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: colors.bgMuted, minWidth: 260 },
            }}
          />
        )}
        {onAction && (
          <Button color="primary" startIcon={actionIcon || <AddIcon />} onClick={onAction} sx={{ px: 2.5 }}>
            {actionLabel}
          </Button>
        )}
      </Box>
    </Box>
  </Box>
);

export default CrudPageHeader;
