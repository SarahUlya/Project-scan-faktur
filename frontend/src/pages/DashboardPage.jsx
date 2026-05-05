import { Box, Typography, Avatar } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import KeyboardTabOutlinedIcon from '@mui/icons-material/KeyboardTabOutlined';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useDashboardData from "../hooks/useDashboardData";
import formatCurrency from "../utils/formatCurrency";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";

const BigStatCard = ({ icon, title, value }) => (
  <Box sx={{ 
    flex: 1, 
    background: '#fff', 
    borderRadius: 5, 
    p: 4, 
    position: 'relative', 
    overflow: 'hidden', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #FDF2F8'
  }}>
    <Box sx={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, background: '#FFF1F2', borderRadius: '50%' }}></Box>
    <Box sx={{ width: 44, height: 44, background: '#FCE7F3', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E63', mb: 3, position: 'relative' }}>
       {icon}
    </Box>
    <Typography sx={{ color: '#94A3B8', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, mb: 1, position: 'relative' }}>{title}</Typography>
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 1 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#94A3B8' }}>Rp</Typography>
      <Typography sx={{ fontSize: 36, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{value}</Typography>
    </Box>
  </Box>
);

const MediumStatCard = ({ icon, number, label, color, bg, borderColor }) => (
  <Box sx={{ 
    flex: 1, 
    background: bg, 
    borderRadius: 4, 
    p: 3, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 2.5,
    border: `1px solid ${borderColor}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
  }}>
    <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
       {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: 28, fontWeight: 900, color: color, lineHeight: 1.2 }}>{number}</Typography>
      <Typography sx={{ color: color, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
    </Box>
  </Box>
);

const DashboardPage = () => {
  const [dashboard] = useDashboardData();

  const columns = [
    {
      header: "PRODUK",
      accessor: "name",
      render: (row, idx) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              background: "#FCE7F3",
              color: "#E91E63",
              fontWeight: 800,
              width: 32,
              height: 32,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            {idx + 1}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>{row.name}</Typography>
            <Typography sx={{ fontSize: 13, color: "#94A3B8" }}>
              {row.type}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { 
      header: "KATEGORI", 
      accessor: "category",
      render: (row) => <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: 15 }}>{row.category}</Typography>
    },
    {
      header: "TERJUAL",
      accessor: "sold",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 15 }}>
          {row.sold.toLocaleString()} <span style={{ color: '#64748B', fontWeight: 600 }}>Unit</span>
        </Typography>
      ),
      align: "center"
    },
    {
      header: "SISA STOK",
      accessor: "stock",
      render: (row) => (
        <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: 15 }}>{row.stock.toLocaleString()} Unit</Typography>
      ),
      align: "center"
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: '#FAFAFA' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
            Dashboard Overview
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: 15 }}>
            Sistem Manajemen Apotek Ampuh Tayu
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, background: '#fff', px: 2, py: 1.5, borderRadius: 12, border: '1px solid #F1F5F9', cursor: 'pointer' }}>
           <Box sx={{ color: '#94A3B8' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
           </Box>
           <Typography sx={{ color: '#64748B', fontSize: 14, fontWeight: 600 }}>Periode: <span style={{ color: '#E91E63', fontWeight: 700 }}>Bulan Ini (Januari 2024)</span></Typography>
           <KeyboardArrowDownIcon sx={{ color: '#94A3B8' }} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <BigStatCard 
          icon={<AccountBalanceWalletOutlinedIcon />} 
          title="PENDAPATAN BULAN INI" 
          value="128.940.000" 
        />
        <BigStatCard 
          icon={<InsertChartOutlinedIcon />} 
          title="ESTIMASI PROFIT" 
          value="32.235.000" 
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <MediumStatCard 
          icon={<AssignmentLateOutlinedIcon fontSize="large" />} 
          number="14" 
          label="PRODUK TIDAK LAKU > 30 HARI" 
          color="#F97316" 
          bg="#FFF7ED" 
          borderColor="#FED7AA" 
        />
        <MediumStatCard 
          icon={<EventBusyOutlinedIcon fontSize="large" />} 
          number="8" 
          label="BATCH EXPIRED < 30 HARI" 
          color="#E11D48" 
          bg="#FFF1F2" 
          borderColor="#FECDD3" 
        />
        <MediumStatCard 
          icon={<KeyboardTabOutlinedIcon fontSize="large" sx={{ transform: 'rotate(180deg)' }} />} 
          number="23" 
          label="STOK DI BAWAH MINIMUM" 
          color="#D97706" 
          bg="#FEF3C7" 
          borderColor="#FDE68A" 
        />
      </Box>

      <Box sx={{ background: "#fff", borderRadius: 5, p: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: '1px solid #F1F5F9' }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
            px: 1
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#1E293B', mb: 0.5 }}>
              Top 5 Produk Terlaris
            </Typography>
            <Typography sx={{ color: "#94A3B8", fontSize: 13, fontWeight: 500 }}>
              Data performa produk periode Januari 2024
            </Typography>
          </Box>
          <Box sx={{ 
            background: '#FDF2F8', 
            color: '#E91E63', 
            px: 2, 
            py: 1.5, 
            borderRadius: 8, 
            fontSize: 12, 
            fontWeight: 800, 
            letterSpacing: 0.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': { background: '#FCE7F3' }
          }}>
            LIHAT SEMUA LAPORAN
            <ArrowRightAltIcon fontSize="small" />
          </Box>
        </Box>
        <Table
          columns={columns}
          data={dashboard.bestProducts}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;
