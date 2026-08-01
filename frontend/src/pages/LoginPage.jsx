import { Box, Button, TextField, Typography, Paper, IconButton, InputAdornment, Checkbox, FormControlLabel, Alert } from "@mui/material";
import { Visibility, VisibilityOff, LocalPharmacyOutlined } from "@mui/icons-material";
import { useLogin } from "../hooks/useLogin";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  zIndex,
  fieldInputSx,
  pageHeaderSx,
  statCardSx,
} from "../theme/designTokens";
export default function LoginPage() {
  const {
    username, setUsername,
    password, setPassword,
    error, setError,
    rememberMe, setRememberMe,
    showPassword, setShowPassword,
    handleLogin,
  } = useLogin();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: colors.bg, p: 2 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, width: 380, border: `1px solid ${colors.borderLight}` }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <LocalPharmacyOutlined sx={{ fontSize: 40, color: colors.primary }} />
        </Box>
        <Typography variant="h6" align="center" sx={{ fontWeight: 700, color: colors.text }}>
          Apotek Ampuh Tayu
        </Typography>
        <Typography align="center" sx={{ color: colors.textSecondary, mb: 3, fontSize: 14 }}>
          Pharmacy Management System
        </Typography>

        <form onSubmit={handleLogin} autoComplete="off">
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, mb: 0.5 }}>Username</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            sx={{ mb: 2 }}
          />

          <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, mb: 0.5 }}>Password</Typography>
          <TextField
            fullWidth
            size="small"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} size="small" />}
            label={<Typography sx={{ fontSize: 13, color: colors.textSecondary }}>Ingat saya</Typography>}
            sx={{ mt: 1 }}
          />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2.5,
              py: 1.25,
              bgcolor: colors.primary,
              fontWeight: 600,
              "&:hover": { bgcolor: colors.primaryHover },
            }}
          >
            Masuk
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
