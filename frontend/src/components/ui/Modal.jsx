import React from "react";
import { Box, Modal as MuiModal } from "@mui/material";
import { colors, radii, shadows } from "@/theme/designTokens";

const Modal = ({ open, onClose, children, width = 500 }) => {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: radii.s,
          boxShadow: shadows.floating,
          width: "100%",
          maxWidth: width,
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          outline: "none",
          p: 3, 
        }}
      >
        {children}
      </Box>
    </MuiModal>
  );
};

export default Modal;