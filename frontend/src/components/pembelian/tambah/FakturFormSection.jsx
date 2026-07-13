import React from "react";
import { Box, Typography } from "@mui/material";

const FakturFormSection = ({ title, subtitle, children }) => (
  <Box
    sx={{
      background: "#fff",
      borderRadius: 2,
      border: "1px solid #F1F5F9",
      mb: 2,
      overflow: "hidden",
    }}
  >
    <Box sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid #F1F5F9" }}>
      <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{title}</Typography>
      {subtitle && (
        <Typography sx={{ fontSize: 12, color: "#64748B", mt: 0.25 }}>{subtitle}</Typography>
      )}
    </Box>
    <Box sx={{ p: 2.5 }}>{children}</Box>
  </Box>
);

export const FormField = ({ label, required, children, sx = {} }) => (
  <Box sx={sx}>
    <Typography
      component="label"
      sx={{
        display: "block",
        color: "#64748B",
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        mb: 0.5,
      }}
    >
      {label}
      {required && <Box component="span" sx={{ color: "#DC2626", ml: 0.25 }}>*</Box>}
    </Typography>
    {children}
  </Box>
);

export default FakturFormSection;
