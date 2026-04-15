import { Box, Grid, Typography, Avatar } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import useDashboardData from "../hooks/useDashboardData";
import formatCurrency from "../utils/formatCurrency";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DashboardStat from "../components/ui/DashboardStat";

const DashboardPage = () => {
  const [dashboard] = useDashboardData();

  const columns = [
    {
      header: "PRODUK",
      accessor: "name",
      render: (row, idx) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              background: "#FCE7F3",
              color: "#E91E63",
              fontWeight: 700,
              width: 36,
              height: 36,
              fontSize: 18,
            }}
          >
            {idx + 1}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>{row.name}</Typography>
            <Typography sx={{ fontSize: 13, color: "#B0B0B0" }}>
              {row.type}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { header: "KATEGORI", accessor: "category" },
    {
      header: "TERJUAL",
      accessor: "sold",
      render: (row) => (
        <Typography sx={{ fontWeight: 700 }}>
          {row.sold.toLocaleString()} Unit
        </Typography>
      ),
      bold: true,
    },
    {
      header: "SISA STOK",
      accessor: "stock",
      render: (row) => (
        <Typography>{row.stock.toLocaleString()} Unit</Typography>
      ),
    },
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #FCE7F3 100%, #FCE7F3 100%)",
        minHeight: "100px",
      }}
    >
      <Box sx={{ p: 2, maxWidth: 1500, mx: "auto" }}>
        <Grid container spacing={3} sx={{ mt: 1, mb: 2}}>
          <Grid>
            <DashboardStat
              icon={
                <MonetizationOnIcon sx={{ color: "#E91E63", fontSize: 32 }} />
              }
              label="PENDAPATAN BULAN INI"
              value={formatCurrency(dashboard.revenue)}
              color="#222"
              bg="#FCE7F3"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardStat
              icon={<TrendingUpIcon sx={{ color: "#E91E63", fontSize: 32 }} />}
              label="ESTIMASI PROFIT"
              value={formatCurrency(dashboard.profit)}
              color="#222"
              bg="#FCE7F3"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <DashboardStat
              icon={
                <WarningAmberIcon sx={{ color: "#E91E63", fontSize: 28 }} />
              }
              label=""
              value={dashboard.notSold}
              color="#E91E63"
              bg="#FCE7F3"
              sublabel="PRODUK TIDAK LAKU > 30 HARI"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardStat
              icon={<EventBusyIcon sx={{ color: "#E91E63", fontSize: 28 }} />}
              label=""
              value={dashboard.expired}
              color="#E91E63"
              bg="#FCE7F3"
              sublabel="BATCH EXPIRED > 30 HARI"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardStat
              icon={
                <CalendarMonthIcon sx={{ color: "#E91E63", fontSize: 28 }} />
              }
              label=""
              value={dashboard.minStock}
              color="#E91E63"
              bg="#FCE7F3"
              sublabel="STOK DI BAWAH MINIMUM"
            />
          </Grid>
        </Grid>
        <Card sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
                Top 5 Produk Terlaris
              </Typography>
              <Typography sx={{ color: "#B0B0B0", fontSize: 14 }}>
                Data performa produk periode Januari 2024
              </Typography>
            </Box>
            <Button color="pink">LIHAT SEMUA LAPORAN</Button>
          </Box>
          <Table
            columns={columns}
            data={dashboard.bestProducts}
            highlightRows={[0]}
          />
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;
