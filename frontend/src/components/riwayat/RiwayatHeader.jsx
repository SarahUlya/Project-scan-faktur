import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { colors, typography, pageHeaderSx } from "@/theme/designTokens";

const RiwayatHeader = ({
  showFilter,
  onToggleFilter,
  onExportPDF,    // ⚡ opsional — fallback kalau actions tidak diisi
  actions,        // ⚡ React node — menggantikan tombol Export PDF
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {/* KIRI: Judul */}
      <Box>
        <Typography sx={pageHeaderSx.title}>
          Riwayat Transaksi & Shift
        </Typography>
        <Typography sx={{ ...pageHeaderSx.subtitle, fontSize: typography.body }}>
          Melacak semua transaksi penjualan dan rekapitulasi sesi kasir.
        </Typography>
      </Box>

      {/* KANAN: Filter + Actions */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={onToggleFilter}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            color: colors.text,
            borderColor: colors.border,
            bgcolor: colors.bgCard,
            "&:hover": {
              borderColor: colors.borderHover,
              bgcolor: colors.bgMuted,
            },
          }}
        >
          Filter
        </Button>

        {/* ⚡ Slot actions — kalau diisi, ganti tombol Export PDF default */}
        {actions ? (
          actions
        ) : onExportPDF ? (
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={onExportPDF}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              bgcolor: colors.text,
              color: colors.textOnDark,
              boxShadow: "none",
              "&:hover": { bgcolor: colors.text, boxShadow: "none" },
            }}
          >
            Export PDF
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
};

export default RiwayatHeader;