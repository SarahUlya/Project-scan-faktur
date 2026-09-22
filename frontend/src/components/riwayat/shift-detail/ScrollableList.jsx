import React from "react";
import { Box, Typography } from "@mui/material";
import { colors, typography } from "../../../theme/designTokens";

const ScrollableList = ({ children, maxHeight = 240, hint }) => (
  <Box sx={{ position: "relative" }}>
    <Box
      sx={{
        maxHeight,
        overflowY: "auto",
        pr: 0.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-track": {
          bgcolor: colors.bgMuted,
          borderRadius: 3,
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: colors.border,
          borderRadius: 3,
          "&:hover": { bgcolor: colors.borderHover },
        },
      }}
    >
      {children}
    </Box>

    {hint && (
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 24,
          background: `linear-gradient(180deg, transparent 0%, ${colors.bgCard} 100%)`,
          pointerEvents: "none",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          pb: 0.25,
        }}
      >
        <Typography
          sx={{
            fontSize: 9,
            color: colors.textMuted,
            fontWeight: typography.semibold,
            letterSpacing: "0.3px",
          }}
        >
          {hint}
        </Typography>
      </Box>
    )}
  </Box>
);

export default ScrollableList;