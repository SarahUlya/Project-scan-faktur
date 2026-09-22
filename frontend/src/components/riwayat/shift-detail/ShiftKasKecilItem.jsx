import React from "react";
import { Box, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { colors, radii, typography, transitions } from "../../../theme/designTokens";
import { formatDateTime, formatRupiah } from "../../../utils/shiftDetailHelpers";

const ShiftKasKecilItem = ({ item }) => {
  const tipe = String(item.tipe || item.jenis || "").toLowerCase();
  const isMasuk = tipe.includes("masuk") || tipe.includes("in");
  const nominal = Number(item.nominal ?? item.jumlah ?? 0);

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
            bgcolor: isMasuk ? colors.successLight : colors.dangerLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isMasuk ? colors.success : colors.danger,
            flexShrink: 0,
          }}
        >
          {isMasuk ? (
            <ArrowUpwardIcon sx={{ fontSize: 15 }} />
          ) : (
            <ArrowDownwardIcon sx={{ fontSize: 15 }} />
          )}
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
            {item.keterangan || (isMasuk ? "Kas Masuk" : "Kas Keluar")}
          </Typography>
          <Typography
            sx={{
              fontSize: typography.tiny,
              color: colors.textSecondary,
              mt: 0.25,
            }}
          >
            {formatDateTime(item.waktu_transaksi || item.created_at)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        <Typography
          sx={{
            fontSize: typography.caption,
            fontWeight: typography.bold,
            color: isMasuk ? colors.success : colors.danger,
            fontFamily: "monospace",
          }}
        >
          {isMasuk ? "+" : "−"} {formatRupiah(nominal)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ShiftKasKecilItem;