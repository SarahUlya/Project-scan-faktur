import React from "react";
import { Box, TableCell, Typography, Button } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { StatusBadge } from "../../ui/StatusBadge";
import { formatRupiahPos } from "../../../utils/posCalculations";
import { colors, radii, typography } from "@/theme/designTokens";

const actionButtonSx = {
  fontSize: typography.caption,
  borderRadius: `${radii.s}px`,
  px: 1.5,
};

const TransaksiRow = ({ row, onDetail }) => (
  <>
    <TableCell>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TagIcon sx={{ fontSize: 16, color: colors.textMuted }} />
        <Typography
          sx={{
            fontWeight: typography.bold,
            fontSize: typography.body,
            color: colors.text,
          }}
        >
          {row.no_transaksi}
        </Typography>
      </Box>
    </TableCell>

    <TableCell>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <EventNoteIcon sx={{ fontSize: 16, color: colors.textMuted }} />
        <Typography
          sx={{
            fontSize: typography.body,
            fontWeight: typography.semibold,
            color: colors.text,
          }}
        >
          {new Date(row.tanggal_transaksi || row.created_at).toLocaleString(
            "id-ID",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
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
          {row.user?.nama || row.kasir?.nama || "Admin Utama"}
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
      Rp {formatRupiahPos(row.total || row.total_bayar)}
    </TableCell>

    <TableCell>
      <StatusBadge status={row.status} />
    </TableCell>

    <TableCell>
      <Button
        size="small"
        onClick={() => onDetail(row.id_transaksi || row.id)}
        startIcon={<RemoveRedEyeIcon sx={{ fontSize: 14 }} />}
        sx={{
          ...actionButtonSx,
          color: colors.primary,
          bgcolor: colors.primaryLight,
          "&:hover": { bgcolor: colors.primaryLight },
        }}
      >
        Detail
      </Button>
    </TableCell>
  </>
);

export default TransaksiRow;