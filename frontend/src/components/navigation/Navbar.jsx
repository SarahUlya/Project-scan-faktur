import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import usePeriodLabel from "../../hooks/usePeriodLabel";
import { useLocation } from "react-router-dom";

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
  // Tambahkan mapping lain jika ada halaman baru
};

const Navbar = () => {
  const periodLabel = usePeriodLabel();
  const location = useLocation();
  const path = location.pathname;
  const config = NAVBAR_MAP[path] || {
    title: "Dashboard Overview",
    desc: "Sistem Manajemen Apotek Ampuh Tayu",
    showPeriod: true,
  };
  return (
    <AppBar position="static" sx={{ boxShadow: 'none', fontFamily: 'Inter, sans-serif' }}>
      <Toolbar sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', fontFamily: 'Inter, sans-serif'}}>
            {config.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
            {config.desc}
          </Typography>
        </Box>
        {config.showPeriod && (
        <Box sx={{ display: 'flex' }}>
          <Box sx={{
            background: '#fff',
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(233,30,99,0.07)',
            fontWeight: 600,
            color: '#E91E63',
            fontSize: 15,
            fontFamily: 'Inter, sans-serif',
          }}>
            <FilterListIcon sx={{ m: 1, color: '#E91E63' }} />
            <Typography component="span" sx={{ color: '#64748B', fontWeight: 500, fontFamily: 'Inter, sans-serif', fontSize: 15 }}>
              Periode:
            </Typography>
            <Box component="span" sx={{ fontWeight: 700, color: '#E91E63', ml: 2, fontFamily: 'Inter, sans-serif', fontSize: 15 }}>
              {periodLabel}
            </Box>
            <IconButton size="small" sx={{ color: '#E91E63', display: 'flex'}}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
        </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;