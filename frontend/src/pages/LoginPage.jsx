import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LocalPharmacyOutlined,
} from "@mui/icons-material";
import { useLogin } from "../hooks/useLogin";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
} from "../theme/designTokens";

export default function LoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    setError,
    rememberMe,
    setRememberMe,
    showPassword,
    setShowPassword,
    handleLogin,
  } = useLogin();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: colors.bg,
        p: spacing.xxl,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: spacing.xxl,
          borderRadius: radii.s,
          width: 400,
          bgcolor: colors.bgCard,
          border: `1px solid ${colors.borderLight}`,
          boxShadow: shadows.elevated,
        }}
      >
        {/* ==================== LOGO & TITLE ==================== */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: spacing.lg }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: radii.s,
              bgcolor: colors.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalPharmacyOutlined
              sx={{ fontSize: 32, color: colors.primary }}
            />
          </Box>
        </Box>

        <Typography
          align="center"
          sx={{
            fontWeight: typography.bold,
            fontSize: typography.h5,
            color: colors.text,
          }}
        >
          Apotek Ampuh Tayu
        </Typography>
        <Typography
          align="center"
          sx={{
            color: colors.textSecondary,
            mb: spacing.xxl,
            mt: 0.5,
            fontSize: typography.body,
          }}
        >
          Pharmacy Management System
        </Typography>

        {/* ==================== FORM ==================== */}
        <form onSubmit={handleLogin} autoComplete="off">
          <Typography
            sx={{
              fontSize: typography.caption,
              fontWeight: typography.semibold,
              color: colors.textSecondary,
              mb: 0.5,
            }}
          >
            Username
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            sx={{
              mb: spacing.lg,
              "& .MuiOutlinedInput-root": {
                bgcolor: colors.bgMuted,
                borderRadius: radii.s,
                fontSize: typography.body,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.borderHover },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
            }}
          />

          <Typography
            sx={{
              fontSize: typography.caption,
              fontWeight: typography.semibold,
              color: colors.textSecondary,
              mb: 0.5,
            }}
          >
            Password
          </Typography>
          <TextField
            fullWidth
            size="small"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: colors.bgMuted,
                borderRadius: radii.s,
                fontSize: typography.body,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.borderHover },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                size="small"
                sx={{
                  color: colors.border,
                  "&.Mui-checked": { color: colors.primary },
                }}
              />
            }
            label={
              <Typography
                sx={{ fontSize: typography.body, color: colors.textSecondary }}
              >
                Ingat saya
              </Typography>
            }
            sx={{ mt: 1 }}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: spacing.lg,
                borderRadius: radii.s,
                fontSize: typography.body,
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: spacing.xl,
              py: 1.25,
              bgcolor: colors.primary,
              color: colors.textOnDark,
              fontWeight: typography.bold,
              fontSize: typography.body,
              textTransform: "none",
              borderRadius: radii.s,
              boxShadow: "none",
              "&:hover": {
                bgcolor: colors.primaryHover,
                boxShadow: "none",
              },
            }}
          >
            Masuk
          </Button>
        </form>
      </Paper>
    </Box>
  );
}