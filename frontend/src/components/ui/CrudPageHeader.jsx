import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Button from "./Button";

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
}) => {
  return (
    <Box sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 20px 40px rgba(233, 30, 99, 0.08)", p: 3, mb: 3 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Box sx={{ minWidth: 280, flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A" }}>
            {title}
          </Typography>
          <Typography sx={{ color: "#64748B", lineHeight: 1.6 }}>
            {description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "flex-end", minWidth: 280 }}>
          {!hideSearch && (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#CBD5E1" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  background: "#F8F8FB",
                  minWidth: 280,
                },
              }}
            />
          )}

          {onAction && (
            <Button
              color="pink"
              sx={{ px: 3, py: 1.5, minWidth: 160, display: "flex", alignItems: "center", gap: 1 }}
              startIcon={actionIcon || <AddIcon />}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CrudPageHeader;
