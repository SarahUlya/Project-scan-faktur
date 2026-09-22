import React from "react";
import { Box, TableCell, Typography, Button } from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { ShiftStatusBadge } from "../../ui/StatusBadge";
import { formatRupiahPos } from "../../../utils/posCalculations";
import { colors, radii, typography } from "@/theme/designTokens";

const actionButtonSx = {
  fontSize: typography.caption,
  borderRadius: `${radii.s}px`,
  px: 1.5,
};

const ShiftRow = ({ row, onViewSession }) => (
  <>
    <TableCell>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <AssignmentIndIcon
          sx={{ fontSize: 16, color: colors.textSecondary }}
        />
        <Typography
          sx={{
            fontWeight: typography.bold,
            fontSize: typography.body,
            color: colors.text,
          }}
        >
          #{row.id_shift}
        </Typography>
      </Box>
    </TableCell>

    <TableCell>
      <ShiftStatusBadge status={row.status} />
    </TableCell>

    <TableCell>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <AccessTimeIcon sx={{ fontSize: 16, color: colors.textMuted }} />
        <Typography
          sx={{
            fontSize: typography.caption,
            fontWeight: typography.semibold,
            color: colors.text,
          }}
        >
          {new Date(row.waktu_buka).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" — "}
          {row.waktu_tutup
            ? new Date(row.waktu_tutup).toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "..."}
        </Typography>
      </Box>
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
          {row.nama_kasir || "—"}
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
      {row.total_transaksi ?? 0}
    </TableCell>

    <TableCell
      sx={{
        fontWeight: typography.bold,
        color: colors.success,
        fontSize: typography.body,
      }}
    >
      Rp {formatRupiahPos(row.total_omzet ?? 0)}
    </TableCell>

    <TableCell>
      <Button
        size="small"
        onClick={() => onViewSession(row)}
        startIcon={<StorefrontIcon sx={{ fontSize: 14 }} />}
        sx={{
          ...actionButtonSx,
          color: colors.blue,
          bgcolor: `${colors.blue}15`,
          "&:hover": { bgcolor: `${colors.blue}25` },
        }}
      >
        Lihat Sesi
      </Button>
    </TableCell>
  </>
);

export default ShiftRow;