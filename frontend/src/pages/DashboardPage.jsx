import { useMemo } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import KeyboardTabOutlinedIcon from "@mui/icons-material/KeyboardTabOutlined";
import useLaporanTransaksi from "../hooks/useLaporanTransaksi";
import Table from "../components/ui/Table";
import { colors, pageHeaderSx, statCardSx } from "../theme/designTokens";
import formatCurrency from "../utils/formatCurrency";

const StatCard = ({ icon, title, value, accent }) => (
  <Box sx={{ ...statCardSx, display: "flex", alignItems: "center", gap: 2 }}>
    <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: colors.bgMuted, display: "flex", alignItems: "center", justifyContent: "center", color: accent || colors.primary }}>
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase" }}>{title}</Typography>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>{value}</Typography>
    </Box>
  </Box>
);

const DashboardPage = () => {
  const { produkTerlaris, totalOmzet, jumlahTransaksi } = useLaporanTransaksi();

  const topProducts = useMemo(() => {
    return (produkTerlaris || []).slice(0, 5).map((item, idx) => ({
      name: item.nama || `Produk ${idx + 1}`,
      type: item.kategori || "Umum",
      sold: item.terjual || 0,
      stock: item.stok || 0,
    }));
  }, [produkTerlaris]);

  const columns = [
    {
      header: "Produk",
      accessor: "name",
      render: (row, idx) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: colors.primaryLight, color: colors.primary }}>{idx + 1}</Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{row.name}</Typography>
            <Typography sx={{ fontSize: 12, color: colors.textMuted }}>{row.type}</Typography>
          </Box>
        </Box>
      ),
    },
    { header: "Kategori", accessor: "category", render: (row) => <Typography sx={{ fontSize: 14, color: colors.textSecondary }}>{row.category}</Typography> },
    { header: "Terjual", accessor: "sold", align: "center", render: (row) => <Typography sx={{ fontWeight: 600 }}>{row.sold.toLocaleString()} unit</Typography> },
    { header: "Sisa Stok", accessor: "stock", align: "center", render: (row) => <Typography sx={{ color: colors.textSecondary }}>{row.stock.toLocaleString()} unit</Typography> },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={pageHeaderSx.title}>Dashboard</Typography>
        <Typography sx={pageHeaderSx.subtitle}>Ringkasan operasional apotek</Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mb: 2 }}>
        <StatCard icon={<AccountBalanceWalletOutlinedIcon />} title="Pendapatan Bulan Ini" value={formatCurrency(totalOmzet)} />
        <StatCard icon={<InsertChartOutlinedIcon />} title="Transaksi Selesai" value={jumlahTransaksi.toString()} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
        <StatCard icon={<AssignmentLateOutlinedIcon />} title="Produk Terdata" value={produkTerlaris.length.toString()} accent={colors.warning} />
        <StatCard icon={<EventBusyOutlinedIcon />} title="Produk Terlaris" value={topProducts.length.toString()} accent={colors.danger} />
        <StatCard icon={<KeyboardTabOutlinedIcon sx={{ transform: "rotate(180deg)" }} />} title="Top 5 Tampil" value={topProducts.length.toString()} accent={colors.warning} />
      </Box>

      <Box sx={{ bgcolor: colors.bgCard, borderRadius: 2, border: `1px solid ${colors.borderLight}`, p: 2.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 15, mb: 0.5 }}>Top 5 Produk Terlaris</Typography>
        <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 2 }}>Performa produk periode berjalan</Typography>
        <Table columns={columns} data={topProducts} />
      </Box>
    </Box>
  );
};

export default DashboardPage;
