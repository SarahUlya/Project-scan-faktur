import React from "react";
import { Box, Typography } from "@mui/material";
import { colors, radii, typography } from "../../../theme/designTokens";

const ShiftInfoBox = ({ label, icon, value, subValue, rightIcon, empty }) => (
  <Box>
    <Typography
      sx={{
        fontSize: typography.tiny + 1,
        fontWeight: typography.bold,
        color: colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        mb: 0.75,
      }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        bgcolor: empty ? `${colors.bgMuted}99` : colors.bgMuted,
        border: empty
          ? `1px dashed ${colors.border}`
          : `1px solid ${colors.borderLight}`,
        borderRadius: `${radii.md}px`,
        p: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        minHeight: 52,
      }}
    >
      {icon && (
        <Box
          component="span"
          sx={{ display: "flex", color: colors.textMuted, flexShrink: 0 }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {subValue && (
          <Typography
            sx={{
              fontSize: typography.caption,
              color: colors.textMuted,
              fontWeight: typography.medium,
              lineHeight: 1.2,
            }}
          >
            {subValue}
          </Typography>
        )}
        <Typography
          sx={{
            fontSize: typography.body,
            fontWeight: typography.bold,
            color: empty ? colors.textMuted : colors.text,
            lineHeight: 1.3,
            fontStyle: empty ? "italic" : "normal",
          }}
        >
          {value}
        </Typography>
      </Box>
      {rightIcon && (
        <Box sx={{ display: "flex", color: colors.textMuted, flexShrink: 0 }}>
          {rightIcon}
        </Box>
      )}
    </Box>
  </Box>
);

export default ShiftInfoBox;