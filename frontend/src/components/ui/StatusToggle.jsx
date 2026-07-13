import React from "react";
import { Box, Typography, Switch } from "@mui/material";

/**
 * Reusable Status Toggle Component
 * Standardized design untuk aktif/nonaktif di semua form
 */
const StatusToggle = ({
  value = true,
  onChange,
  label = "STATUS",
  variant = "horizontal", // horizontal atau vertical
  disabled = false,
}) => {
  const isActive = value;

  return (
    <Box
      sx={{
        display: variant === "vertical" ? "block" : "flex",
        alignItems: variant === "vertical" ? "flex-start" : "center",
        gap: variant === "vertical" ? 1 : 2,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "#94A3B8",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          display: "block",
          mb: variant === "vertical" ? 1 : 0,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: isActive ? "rgba(233, 30, 99, 0.05)" : "rgba(148, 163, 184, 0.05)",
          px: 2,
          py: 1,
          borderRadius: 2,
          border: "1px solid",
          borderColor: isActive ? "#FCE4EC" : "#E2E8F0",
          transition: "all 0.2s ease",
        }}
      >
        <Switch
          checked={isActive}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#E91E63",
              "&:hover": {
                backgroundColor: "rgba(233, 30, 99, 0.08)",
              },
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#E91E63",
            },
            "& .MuiSwitch-track": {
              backgroundColor: "#E2E8F0",
            },
          }}
        />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 13,
            color: isActive ? "#E91E63" : "#94A3B8",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            minWidth: 80,
          }}
        >
          {isActive ? "AKTIF" : "NON-AKTIF"}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatusToggle;
