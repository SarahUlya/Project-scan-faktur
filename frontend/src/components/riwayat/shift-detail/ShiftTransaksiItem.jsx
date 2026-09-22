import React from "react";
import { Box, Typography } from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { colors, radii, typography, transitions } from "../../../theme/designTokens";
import { formatDateTime, formatRupiah } from "../../../utils/shiftDetailHelpers";

const ShiftTransaksiItem = ({ trx }) => {
  const statusUpper = String(trx.status || "").toUpperCase();
  const isLunas =
    statusUpper.includes("LUNAS") || statusUpper.includes("SELESAI");
  const isBatal = statusUpper.includes("BATAL");

  const chipBg = isLunas
    ? colors.successLight
    : isBatal
    ? colors.dangerLight
    : colors.bgMuted;
  const chipColor = isLunas
    ? colors.success
    : isBatal
    ? colors.danger
    : colors.textSecondary;
  const chipLabel = isLunas ? "LUNAS" : isBatal ? "BATAL" : statusUpper || "-";

  return (
    <Box
      sx={{
        bgcolor: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: `${radii.md}px`,
        p: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        transition: transitions.fast,
        "&:hover": { borderColor: colors.borderHover },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.25,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: `${radii.sm}px`,
            bgcolor: colors.bgMuted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.textSecondary,
            flexShrink: 0,
          }}
        >
          <PointOfSaleIcon sx={{ fontSize: 15 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: typography.caption,
              fontWeight: typography.bold,
              color: colors.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {trx.no_transaksi || trx.id_transaksi || "-"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mt: 0.25,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{ fontSize: typography.tiny, color: colors.textSecondary }}
            >
              {formatDateTime(trx.tanggal_transaksi || trx.created_at)}
            </Typography>
            {trx.metode_bayar && (
              <>
                <Typography
                  sx={{ fontSize: typography.tiny, color: colors.textMuted }}
                >
                  •
                </Typography>
                <Typography
                  sx={{
                    fontSize: typography.tiny,
                    color: colors.textSecondary,
                    fontWeight: typography.medium,
                  }}
                >
                  {trx.metode_bayar}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        <Typography
          sx={{
            fontSize: typography.caption,
            fontWeight: typography.bold,
            color: colors.text,
            fontFamily: "monospace",
          }}
        >
          {formatRupiah(trx.total || trx.total_bayar || 0)}
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            bgcolor: chipBg,
            color: chipColor,
            fontWeight: typography.bold,
            fontSize: typography.tiny,
            px: 0.75,
            py: 0.15,
            borderRadius: `${radii.xs}px`,
            textTransform: "uppercase",
            mt: 0.25,
          }}
        >
          {chipLabel}
        </Box>
      </Box>
    </Box>
  );
};

export default ShiftTransaksiItem;