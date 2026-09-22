import React from "react";
import { Chip } from "@mui/material";
import { colors, typography } from "@/theme/designTokens";
import { getStatusStyle, getShiftStyle } from "../../utils/statusHelpers";

/**
 * StatusBadge — untuk status transaksi (LUNAS, BATAL, dll)
 */
export const StatusBadge = ({ status, size = "small" }) => {
  const { bg, color, label } = getStatusStyle(status);
  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: bg,
        color,
        fontWeight: typography.bold,
        fontSize: typography.tiny,
        height: 22,
      }}
    />
  );
};

/**
 * ShiftStatusBadge — untuk status shift (OPEN, CLOSED)
 */
export const ShiftStatusBadge = ({ status, size = "small" }) => {
  const { bg, color, label } = getShiftStyle(status);
  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: bg,
        color,
        fontWeight: typography.bold,
        fontSize: typography.tiny,
        height: 22,
      }}
    />
  );
};

export default StatusBadge;