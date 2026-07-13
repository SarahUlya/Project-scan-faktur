import { createTheme } from "@mui/material/styles";
import { colors, radii } from "./designTokens";

const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: colors.primary, dark: "#0D5C56", light: colors.primaryHover },
    secondary: { main: colors.textSecondary },
    background: { default: colors.bg, paper: colors.bgCard },
    text: { primary: colors.text, secondary: colors.textSecondary },
    error: { main: colors.danger },
    success: { main: colors.success },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: radii.sm },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: radii.sm },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: radii.sm },
      },
    },
  },
});

export default appTheme;
