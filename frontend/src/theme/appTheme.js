import { createTheme } from "@mui/material/styles";
import { colors, radii, typography } from "./designTokens";

const appTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.brand,
      contrastText: colors.textOnDark,
    },

    secondary: {
      main: colors.textSecondary,
    },

    background: {
      default: colors.bg,
      paper: colors.bgCard,
    },

    text: {
      primary: colors.text,
      secondary: colors.textSecondary,
      disabled: colors.textMuted,
    },

    error: { main: colors.danger, light: colors.dangerLight },
    success: { main: colors.success, light: colors.successLight },
    warning: { main: colors.warning, light: colors.warningLight },
    info: { main: colors.blue },
    divider: colors.border,
  },

  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',

    // Header
    h1: { fontSize: typography.h1, fontWeight: typography.bold },
    h2: { fontSize: typography.h2, fontWeight: typography.bold },
    h3: { fontSize: typography.h3, fontWeight: typography.bold },
    h4: { fontSize: typography.h4, fontWeight: typography.bold },
    h5: { fontSize: typography.h5, fontWeight: typography.bold },
    h6: { fontSize: typography.subtitle, fontWeight: typography.semibold },

    // Body
    body1: { fontSize: typography.body, fontWeight: typography.regular },
    body2: { fontSize: typography.caption, fontWeight: typography.regular },

    // Caption
    caption: { fontSize: typography.small, color: colors.textSecondary },

    // Button
    button: {
      textTransform: "none",
      fontWeight: typography.semibold,
    },
  },

  shape: {
    borderRadius: radii.s, // ✅ Global radius kecil
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: typography.semibold,
          borderRadius: radii.s, // ✅
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          "&:hover": { backgroundColor: colors.primaryHover },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radii.s, // ✅
          fontSize: typography.body,
          "& fieldset": { borderColor: colors.border },
          "&:hover fieldset": { borderColor: colors.borderHover },
          "&.Mui-focused fieldset": { borderColor: colors.primary },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: typography.bold,
          fontSize: typography.tiny,
          borderRadius: radii.xs, // ✅
          height: 22,
        },
        sizeSmall: {
          fontSize: typography.tiny,
          height: 22,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radii.s, // ✅
          border: `1px solid ${colors.borderLight}`,
          boxShadow: "0 1px 3px rgba(15,23,42,.06)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        rounded: { borderRadius: radii.s }, // ✅
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: typography.small,
          fontWeight: typography.bold,
          color: colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        },
        body: {
          fontSize: typography.body,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: typography.caption,
          borderRadius: radii.xs, // ✅
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: radii.s }, // ✅
      },
    },
  },
});

export default appTheme;