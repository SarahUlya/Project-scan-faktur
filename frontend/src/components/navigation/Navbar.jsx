import { AppBar, Toolbar, Typography, Box, IconButton, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import usePeriodLabel from "../../hooks/usePeriodLabel";
import { useLocation, useNavigate } from "react-router-dom";


const NAVBAR_MAP = {
  "/": {
    title: "Dashboard Overview",
    desc: "Sistem Manajemen Apotek Ampuh Tayu",
    showPeriod: true,
  },
  "/produk": {
    title: "Master Data Produk",
    desc: "Manajemen katalog obat dan perlengkapan medis.",
    showPeriod: false,
  },
  "/supplier": {
    title: "Data Supplier",
    desc: "Manajemen data supplier.",
    showPeriod: false,
  },
  "/stok-batch": {
    title: "Monitoring Stok & Batch FEFO",
    desc: "First-Expired-First-Out (FEFO) Inventory Management.",
    showPeriod: false,
  },
  "/laporan": {
    title: "Laporan & Rekapitulasi",
    desc: "Analisa data performa Apotek Ampuh Tayu.",
    showPeriod: true,
  },
  "/riwayat": {
    title: "Riwayat Transaksi",
    desc: "Daftar rekaman transaksi penjualan Apotek Ampuh Tayu.",
    showPeriod: true,
  },
  "/user-management": {
    title: "Manajemen User",
    desc: "Kelola data pengguna dan hak akses sistem.",
    showPeriod: true,
  },
};

const Navbar = () => {
  const periodLabel = usePeriodLabel();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("isLogin");
  localStorage.removeItem("rememberedUsername"); 
  navigate("/login");
};
  const path = location.pathname;
  const config = NAVBAR_MAP[path] || {
    title: "Dashboard Overview",
    desc: "Sistem Manajemen Apotek Ampuh Tayu",
    showPeriod: true,
  };


  return (
    <AppBar position="static" sx={{ boxShadow: 'none', fontFamily: 'Inter, sans-serif' }}>
      <Toolbar sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>

        {/* KIRI */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
            {config.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
            {config.desc}
          </Typography>
        </Box>

        {/* KANAN */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {config.showPeriod && (
            <Box
              sx={{
                background: "#fff",
                borderRadius: 2,
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 6px rgba(233,30,99,0.08)",
              }}
            >
              <FilterListIcon sx={{ mr: 1, color: "#E91E63" }} />
              <Typography sx={{ color: "#64748B", fontSize: 14 }}>
                Periode:
              </Typography>
              <Box sx={{ fontWeight: 700, color: "#E91E63", ml: 1 }}>
                {periodLabel}
              </Box>
              <IconButton size="small" sx={{ color: "#E91E63" }}>
                <KeyboardArrowDownIcon />
              </IconButton>
            </Box>
          )}

          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              borderColor: "#ec407a",
              color: "#ec407a",
              borderRadius: 2,
              px: 2,
              fontWeight: 600,
              textTransform: "none",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#ec407a",
                color: "#fff",
                borderColor: "#ec407a",
              },
            }}
          >
            Logout
          </Button>

        </Box>
      </Toolbar>
    </AppBar>

  );
};

export default Navbar;