import React from "react";
import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { colors, radii, typography } from "../../../theme/designTokens";
import { formatRupiah } from "../../../utils/shiftDetailHelpers";

/* ── Sub — RincianRow ─────────────────────────────────────────── */
const RincianRow = ({ label, value, icon, bold, color, sub, isLast }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 1,
      py: bold ? 1 : 0.75,
      borderBottom: isLast ? "none" : `1px dashed ${colors.borderLight}`,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      {icon}
      <Typography
        sx={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          fontWeight: bold ? typography.bold : typography.medium,
        }}
      >
        {label}
      </Typography>
    </Box>
    <Box sx={{ textAlign: "right" }}>
      <Typography
        sx={{
          fontSize: bold ? typography.body : typography.caption,
          fontWeight: typography.bold,
          color: color || colors.text,
          fontFamily: "monospace",
        }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography
          sx={{
            fontSize: 10,
            color: colors.textMuted,
            fontWeight: typography.medium,
          }}
        >
          {sub}
        </Typography>
      )}
    </Box>
  </Box>
);

/* ── Main ─────────────────────────────────────────────────────── */
const ShiftRincianKeuangan = ({
  modalAwal,
  totalOmzet,
  kasMasuk,
  kasKeluar,
  saldoSistem,
  modalAkhir,
  selisih,
  selisihInfo,
  isOpen,
  loadingKas,
}) => {
  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
        <Typography
          sx={{
            fontSize: typography.body,
            fontWeight: typography.bold,
            color: colors.text,
          }}
        >
          Rincian Keuangan
        </Typography>
        {loadingKas && (
          <CircularProgress size={12} sx={{ color: colors.textMuted }} />
        )}
      </Box>

      <Box
        sx={{
          bgcolor: colors.bgMuted,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: `${radii.md + 4}px`,
          p: 2,
        }}
      >
        <RincianRow label="Modal Awal" value={formatRupiah(modalAwal)} />

        <RincianRow
          label="Penjualan Tunai"
          value={`+ ${formatRupiah(totalOmzet)}`}
          color={totalOmzet > 0 ? colors.success : colors.textMuted}
        />

        <RincianRow
          label="Kas Masuk"
          icon={
            <ArrowUpwardIcon
              sx={{
                fontSize: 12,
                color: kasMasuk > 0 ? colors.success : colors.textMuted,
              }}
            />
          }
          value={`+ ${formatRupiah(kasMasuk)}`}
          color={kasMasuk > 0 ? colors.success : colors.textMuted}
        />

        <RincianRow
          label="Kas Keluar"
          icon={
            <ArrowDownwardIcon
              sx={{
                fontSize: 12,
                color: kasKeluar > 0 ? colors.danger : colors.textMuted,
              }}
            />
          }
          value={`− ${formatRupiah(kasKeluar)}`}
          color={kasKeluar > 0 ? colors.danger : colors.textMuted}
          isLast
        />

        <Divider sx={{ my: 1.5, borderColor: colors.border }} />

        <RincianRow
          label="Saldo Sistem (Harapan)"
          value={formatRupiah(saldoSistem)}
          bold
          color={colors.text}
        />

        <RincianRow
          label="Uang Fisik di Laci"
          value={modalAkhir != null ? formatRupiah(modalAkhir) : "—"}
          bold
          color={modalAkhir != null ? colors.primary : colors.textMuted}
          sub={modalAkhir == null ? "belum dihitung" : undefined}
          isLast
        />

        {!isOpen && selisih != null && (
          <>
            <Divider sx={{ my: 1.5, borderColor: colors.border }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  sx={{
                    fontSize: typography.caption,
                    color: colors.textSecondary,
                    fontWeight: typography.bold,
                  }}
                >
                  Selisih Kas
                </Typography>
                <Box
                  sx={{
                    bgcolor: selisihInfo.chipBg,
                    color: selisihInfo.color,
                    fontSize: 9,
                    fontWeight: typography.bold,
                    px: 0.6,
                    py: 0.15,
                    borderRadius: `${radii.xs}px`,
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  {selisihInfo.label}
                </Box>
              </Box>
              <Typography
                sx={{
                  fontSize: typography.body,
                  fontWeight: typography.bold,
                  color: selisihInfo.color,
                  fontFamily: "monospace",
                }}
              >
                {selisih === 0
                  ? "Rp 0"
                  : `${selisih > 0 ? "+" : "−"} ${formatRupiah(
                      Math.abs(selisih)
                    )}`}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ShiftRincianKeuangan;