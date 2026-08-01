import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "../../ui/Button";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
} from "@/theme/designTokens";

const SummaryRow = ({ label, value, highlight, mono }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5 }}>
    <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>{label}</Typography>
    <Typography
      sx={{
        fontSize: highlight ? 16 : 13,
        fontWeight: highlight ? 700 : 500,
        color: highlight ? colors.primary : colors.text,
        fontFamily: mono ? "monospace" : "inherit",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const FakturSummaryPanel = ({
  supplierName,
  kodeBatch,
  itemCount,
  subtotal,
  ppn,
  nilaiPpn,
  cashback,
  grandTotal,
  onSimpan,
  onBatal,
}) => (
  <Box sx={{ position: { md: "sticky" }, top: 24, alignSelf: "flex-start", width: "100%" }}>
    <Box sx={{ background: colors.bgCard, borderRadius: 2, border: `1px solid ${colors.borderLight}`, overflow: "hidden" }}>
      <Box sx={{ px: 2, py: 1.5, bgcolor: colors.bgSidebar }}>
        <Typography sx={{ color: colors.textMuted, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
          Grand Total
        </Typography>
        <Typography sx={{ color: colors.bgCard, fontWeight: 700, fontSize: 20, mt: 0.25 }}>
          Rp {grandTotal.toLocaleString("id-ID")}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {supplierName && (
          <Box sx={{ mb: 1.5, p: 1.25, bgcolor: colors.bgMuted, borderRadius: 1.5 }}>
            <Typography sx={{ fontSize: 11, color: colors.textMuted, fontWeight: 600 }}>Supplier</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{supplierName}</Typography>
          </Box>
        )}

        {kodeBatch && (
          <Box sx={{ mb: 1.5, p: 1.25, bgcolor: colors.primaryLight, borderRadius: 1.5 }}>
            <Typography sx={{ fontSize: 11, color: colors.primary, fontWeight: 600 }}>Kode Batch</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.primary, fontFamily: "monospace" }}>
              {kodeBatch}
            </Typography>
          </Box>
        )}

        <SummaryRow label={`Item (${itemCount})`} value={`${itemCount} produk`} />
        <Divider sx={{ my: 1 }} />
        <SummaryRow label="Subtotal" value={`Rp ${subtotal.toLocaleString("id-ID")}`} />
        <SummaryRow label={`PPN ${nilaiPpn}%`} value={`Rp ${ppn.toLocaleString("id-ID")}`} />
        {cashback > 0 && (
          <SummaryRow label="Cashback" value={`- Rp ${Number(cashback).toLocaleString("id-ID")}`} />
        )}
      </Box>

      <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Button fullWidth onClick={onSimpan} startIcon={<SaveOutlinedIcon />} color="primary" sx={{ py: 0.8, fontWeight: 600 }}>
          Simpan Faktur
        </Button>
        <Button fullWidth variant="outlined" onClick={onBatal} startIcon={<ArrowBackIcon />} sx={{ py: 1, borderColor: colors.textOnDark, color: colors.textOnDark, "&:hover": { borderColor: colors.textOnDark } }}>
          Batal
        </Button>
      </Box>
    </Box>
  </Box>
);

export default FakturSummaryPanel;
