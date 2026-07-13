import React from "react";
import { Box } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import Button from "../ui/Button";
import { colors } from "../../theme/designTokens";

/**
 * Tombol cetak + export PDF laporan stok (reusable)
 */
const StokPrintActions = ({
  onPrint,
  onExportPdf,
  printLabel = "Cetak",
  pdfLabel = "PDF",
  size = "medium",
  variant = "outlined",
  disabled = false,
}) => (
  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
    <Button
      variant={variant}
      size={size}
      startIcon={<PrintIcon />}
      onClick={onPrint}
      disabled={disabled}
      sx={variant === "outlined" ? { borderColor: colors.border, color: colors.textSecondary } : {}}
    >
      {printLabel}
    </Button>
    <Button
      color="primary"
      size={size}
      startIcon={<PictureAsPdfOutlinedIcon />}
      onClick={onExportPdf}
      disabled={disabled}
    >
      {pdfLabel}
    </Button>
  </Box>
);

export default StokPrintActions;
