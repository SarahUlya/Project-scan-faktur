import React from "react";
import { Box, Typography } from "@mui/material";
import { colors } from "../../../theme/designTokens";

const steps = [
  { value: "informasi", label: "Informasi Faktur" },
  { value: "barang", label: "Daftar Barang" },
];

const FakturStepIndicator = ({ activeStep, onChange, itemCount }) => {
  const activeIndex = steps.findIndex((s) => s.value === activeStep);

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
      {steps.map((step, index) => {
        const isActive = activeStep === step.value;
        const isDone = index < activeIndex;

        return (
          <Box
            key={step.value}
            onClick={() => onChange(step.value)}
            sx={{
              flex: 1,
              px: 2,
              py: 1.25,
              borderRadius: 2,
              cursor: "pointer",
              border: `1px solid ${isActive ? colors.primary : colors.borderLight}`,
              bgcolor: isActive ? colors.primaryLight : colors.bgCard,
              transition: "all 0.15s",
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: isActive ? colors.primary : colors.textMuted }}>
              Langkah {index + 1}
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: colors.text }}>
              {step.label}
              {step.value === "barang" && itemCount > 0 && (
                <Box component="span" sx={{ ml: 1, fontSize: 11, color: colors.primary, fontWeight: 700 }}>
                  ({itemCount})
                </Box>
              )}
              {isDone && (
                <Box component="span" sx={{ ml: 1, fontSize: 11, color: colors.success }}>✓</Box>
              )}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default FakturStepIndicator;
