export const colors = {
  bg: "#F1F5F9",
  bgCard: "#FFFFFF",
  bgMuted: "#F8FAFC",
  bgSidebar: "#0F172A",
  bgSidebarHover: "rgba(255,255,255,0.06)",
  bgSidebarActive: "#E91E63",

  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  textOnDark: "#F8FAFC",

  border: "#E2E8F0",
  borderLight: "#F1F5F9",

  primary: "#E91E63",
  primaryHover: "#D81B60",
  primaryLight: "#FDF2F8",

  accent: "#E91E63",
  danger: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",

  brand: "#BE185D",
};

export const shadows = {
  card: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
  elevated: "0 4px 16px rgba(15, 23, 42, 0.08)",
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const fieldInputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: `${radii.sm}px`,
    bgcolor: colors.bgMuted,
    fontSize: 14,
    "& fieldset": { borderColor: colors.border },
    "&:hover fieldset": { borderColor: "#CBD5E1" },
    "&.Mui-focused fieldset": { borderColor: colors.primary },
  },
};

export const pageHeaderSx = {
  title: { fontWeight: 700, color: colors.text, fontSize: 22 },
  subtitle: { color: colors.textSecondary, fontSize: 14, mt: 0.5 },
};

export const statCardSx = {
  background: colors.bgCard,
  borderRadius: `${radii.md}px`,
  border: `1px solid ${colors.borderLight}`,
  boxShadow: shadows.card,
  p: 2.5,
};
