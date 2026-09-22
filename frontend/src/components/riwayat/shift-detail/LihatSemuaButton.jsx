import React from "react";
import { Box } from "@mui/material";
import { colors, radii, typography, transitions } from "../../../theme/designTokens";

const LihatSemuaButton = ({ idShift, count, type = "transaksi" }) => {
  const handleClick = () => {
    window.location.href = `/riwayat?shift=${idShift}&tab=0`;
  };

  return (
    <Box
      component="button"
      onClick={handleClick}
      sx={{
        width: "100%",
        mt: 1,
        px: 2,
        py: 1,
        bgcolor: colors.bgMuted,
        border: `1px dashed ${colors.border}`,
        borderRadius: `${radii.md}px`,
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: typography.bold,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: transitions.fast,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        "&:hover": {
          bgcolor: colors.primaryLight,
          borderColor: colors.primary,
          borderStyle: "solid",
        },
      }}
    >
      Lihat semua {count} {type} di halaman Riwayat →
    </Box>
  );
};

export default LihatSemuaButton;