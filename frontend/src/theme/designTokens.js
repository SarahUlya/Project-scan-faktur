/* ==========================================================================
 * DESIGN TOKENS
 * Project : Scan Faktur
 * Author  : Bayu
 * ==========================================================================
 */

/* ==========================================================================
 * COLORS
 * ========================================================================== */

export const colors = {
  /* ---------- Background ---------- */
  bg: "#F1F5F9",
  bgCard: "#FFFFFF",
  bgMuted: "#F8FAFC",

  /* ---------- Sidebar ---------- */
  bgSidebar: "#1E293B",
  bgSidebarHover: "rgba(255,255,255,0.06)",
  bgSidebarActive: "#E91E63",

  /* ---------- Text ---------- */
  text: "#1E293B",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  textOnDark: "#FFFFFF",
  textLight: "#CBD5E1",
  textDark: "#0F172A",

  /* ---------- Border ---------- */
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  borderHover: "#CBD5E1",
  borderStrong:"#CBD5E1",

  /* ---------- Brand ---------- */
  primary: "#E91E63",
  primaryHover: "#D81B60",
  primaryLight: "#FDF2F8",
  brand: "#BE185D",
  accent: "#E91E63",

  /* ---------- Status ---------- */
  success: "#22C55E",
  successLight: "#DCFCE7",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  danger: "#EF4444",
  dangerLight: "#FEE2E2",
  blue: "#3B82F6",

  /* ---------- Surface ---------- */
  surface: "#FCFDFE",
  surfaceHover: "#F8FAFC",
  surfacePink: "#FFF5F8",

  /* ---------- Button ---------- */
  buttonBg: "#FFF5F8",
  buttonHover: "#E91E63",
  buttonBorder: "#F8BBD0",
};

/* ==========================================================================
 * BORDER RADIUS
 * ========================================================================== */

export const radii = {
  s: 4,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
};

/* ==========================================================================
 * SPACING (MUI Scale)
 * ========================================================================== */

export const spacing = {
  xs: 0.5,
  sm: 0.75,
  md: 1.5,
  lg: 2,
  xl: 2.5,
  xxl: 3,
};

/* ==========================================================================
 * TYPOGRAPHY
 * ========================================================================== */

export const typography = {
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,

  title: 22,

  bodyLg: 16,
  body: 14,
  caption: 12,

  tiny:10,
  small:11,
  caption:12,
  body:14,
  bodyLg:16,
  subtitle:18,
  title:22,

  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/* ==========================================================================
 * SHADOWS
 * ========================================================================== */

export const shadows = {
  card: "0 1px 3px rgba(15,23,42,.06), 0 1px 2px rgba(15,23,42,.04)",
  elevated: "0 4px 16px rgba(15,23,42,.08)",
  floating: "0 8px 24px rgba(15,23,42,.12)",
  hover: "0 6px 18px rgba(15,23,42,.10)",
};

/* ==========================================================================
 * TRANSITIONS
 * ========================================================================== */

export const transitions = {
  fast: "all .15s ease",
  normal: "all .25s ease",
  slow: "all .35s ease",
};

/* ==========================================================================
 * Z-INDEX
 * ========================================================================== */

export const zIndex = {
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

/* ==========================================================================
 * REUSABLE SX
 * ========================================================================== */

export const fieldInputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: colors.bgMuted,
    borderRadius: `${radii.sm}px`,
    fontSize: typography.body,

    "& fieldset": {
      borderColor: colors.border,
    },

    "&:hover fieldset": {
      borderColor: colors.borderHover,
    },

    "&.Mui-focused fieldset": {
      borderColor: colors.primary,
    },
  },
};

export const pageHeaderSx = {
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: typography.bold,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: typography.medium,
    mt: spacing.xs,
  },
};

export const statCardSx = {
  background: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: `${radii.md}px`,
  boxShadow: shadows.card,
  p: spacing.xl,
};

export const posCardSx={
    bgcolor:colors.bgCard,
    borderRadius:radii.md,
    border:`1px solid ${colors.border}`,
    boxShadow:shadows.card,
    transition:transitions.fast,

    "&:hover":{
        borderColor:colors.primary,
        boxShadow:shadows.hover,
    }
}
