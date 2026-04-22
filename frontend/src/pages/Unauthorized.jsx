import { Box, Typography, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function UnauthorizedPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, textAlign: "center" }}>
        <WarningAmberIcon sx={{ fontSize: 50, color: "orange", mb: 2 }} />

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Akses Ditolak
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Kamu tidak memiliki izin untuk mengakses halaman ini.
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            component={Link}
            to="/"
          >
            Kembali ke Dashboard
          </Button>

          <Button
            variant="outlined"
            component={Link}
            to="/login"
            sx={{
              borderColor: "gray",
              color: "black",
            }}
          >
            Login sebagai akun lain
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}