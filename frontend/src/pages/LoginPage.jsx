import {  Box, Button, TextField, Typography, Paper, IconButton,  InputAdornment, Checkbox, FormControlLabel, Alert} from "@mui/material";
import {  Visibility, VisibilityOff, LocalPharmacy as LocalPharmacyIcon} from "@mui/icons-material";
import { useLogin } from "../hooks/useLogin";


const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ffe4ec, #fff)",
  },
  paper: { p: 5, borderRadius: 4, width: 350 },
  brandIcon: { fontSize: 40, color: "#ec407a" },
  label: { fontSize: 12, mb: 0.5, color: "#888" },
  submitBtn: { mt: 3, py: 1.5, borderRadius: 2, background: "#ec407a", "&:hover": { background: "#d81b60" } },
  accentText: { fontSize: 12, color: "#ec407a", cursor: "pointer" }
};

export default function LoginPage() {
  const {
    username, setUsername,
    password, setPassword,
    error, setError,
    rememberMe, setRememberMe,
    showPassword, setShowPassword,
    handleLogin
  } = useLogin();

  return (
    <Box sx={styles.container}>
      <Paper elevation={6} sx={styles.paper}>

        {/* Header Section */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <LocalPharmacyIcon sx={styles.brandIcon} />
        </Box>
        <Typography variant="h5" align="center" fontWeight="bold">
          Apotek Ampuh Tayu
        </Typography>
        <Typography align="center" color="text.secondary" mb={3}>
          Pharmacy Management System
        </Typography>

        {/* Form Section */}
        <form onSubmit={handleLogin} autoComplete="off">

          <Typography sx={styles.label}>Username</Typography>
          <TextField
            fullWidth
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            inputProps={{
              autoComplete: 'username', 
            }}
            sx={{ mb: 2 }}
          />

          <Typography sx={styles.label}>Password</Typography>
          <TextField
            autoComplete="off"
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            InputProps={{
              autoComplete: 'current-password',
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: "#ec407a", "&.Mui-checked": { color: "#ec407a" } }}
                />
              }
              label={<Typography sx={{ fontSize: 13 }}>Ingat saya</Typography>}
            />
            <Typography sx={styles.accentText}>Lupa Password?</Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.submitBtn}
            disabled={!username || !password}
          >
            Masuk ke Dashboard
          </Button>
        </form>

      </Paper>
    </Box>
    
  );
}