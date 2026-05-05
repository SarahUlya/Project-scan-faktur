import { AppBar, Toolbar, Typography, Box, IconButton, TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import usePeriodLabel from "../../hooks/usePeriodLabel";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";


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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const path = location.pathname;
  const config = NAVBAR_MAP[path] || {
    title: "Dashboard Overview",
    desc: "Sistem Manajemen Apotek Ampuh Tayu",
    showPeriod: true,
  };


  const productSearch = searchParams.get("search") || "";

  const updateSearch = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const openAddModal = () => {
    const params = new URLSearchParams(searchParams);
    params.set("add", "true");
    navigate(`${path}?${params.toString()}`);
  };

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: 'none',
        fontFamily: 'Inter, sans-serif',
        background: 'transparent',
      }}
    >
      <Toolbar
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 80,
          gap: 2,
          flexWrap: "wrap",
        }}
      >

        {/* KIRI */}
        <Box
          sx={{
            display: path === "/produk" ? "none" : "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 280,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
            {config.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
            {config.desc}
          </Typography>
        </Box>

        {/* KANAN */}
        <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
          {path !== "/produk" && (
            config.showPeriod && (
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: 3,
                  px: 2.5,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 20px 40px rgba(233, 30, 99, 0.08)",
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
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>

  );
};

export default Navbar;