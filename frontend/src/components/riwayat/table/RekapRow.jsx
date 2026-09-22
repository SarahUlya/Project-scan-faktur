import React from "react";
import { Box, TableCell, Typography, Button, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { formatRupiahPos } from "../../../utils/posCalculations";
import { colors, radii, typography } from "@/theme/designTokens";

const actionButtonSx = {
  fontSize: typography.caption,
  borderRadius: `${radii.s}px`,
  px: 1.5,
};

const RekapRow = ({ row, onViewDetail }) => (
  <>
    <TableCell>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <CalendarMonthIcon sx={{ fontSize: 16, color: colors.textMuted }} />
        <Typography
          sx={{
            fontWeight: typography.bold,
            fontSize: typography.body,
            color: colors.text,
          }}
        >
          {new Date(row.tanggal).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Typography>
      </Box>
    </TableCell>

    <TableCell
      sx={{
        fontWeight: typography.bold,
        fontSize: typography.body,
        color: colors.text,
      }}
    >
      {row.totalTransaksi} Transaksi
    </TableCell>

    <TableCell
      sx={{
        fontWeight: typography.bold,
        color: colors.success,
        fontSize: typography.body,
      }}
    >
      Rp {formatRupiahPos(row.omzet)}
    </TableCell>

    <TableCell>
      {row.dibatalkan > 0 ? (
        <Chip
          label={`${row.dibatalkan} Dibatalkan`}
          size="small"
          sx={{ bgcolor: colors.dangerLight, color: colors.danger }}
        />
      ) : (
        <Typography sx={{ fontSize: typography.body, color: colors.textMuted }}>
          —
        </Typography>
      )}
    </TableCell>

    <TableCell>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <PersonOutlineIcon sx={{ fontSize: 16, color: colors.textMuted }} />
        <Typography
          sx={{
            fontSize: typography.body,
            fontWeight: typography.bold,
            color: colors.text,
          }}
        >
          {row.kasir}
        </Typography>
      </Box>
    </TableCell>

    <TableCell>
      <Button
        size="small"
        onClick={() => onViewDetail(row.tanggal)}
        startIcon={<RemoveRedEyeIcon sx={{ fontSize: 14 }} />}
        sx={{
          ...actionButtonSx,
          color: colors.blue,
          bgcolor: `${colors.blue}15`,
          "&:hover": { bgcolor: `${colors.blue}25` },
        }}
      >
        Lihat Detail
      </Button>
    </TableCell>
  </>
);

export default RekapRow;