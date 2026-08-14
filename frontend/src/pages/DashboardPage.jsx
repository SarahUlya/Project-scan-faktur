import { useMemo } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import KeyboardTabOutlinedIcon from "@mui/icons-material/KeyboardTabOutlined";
import useLaporanTransaksi from "../hooks/useLaporanTransaksi";
import useProdukDb from "../hooks/useProdukDb";
import Table from "../components/ui/Table";
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
} from "@/theme/designTokens";
import formatCurrency from "../utils/formatCurrency";
import DashboardLoadingSkeleton from "../components/common/DashboardLoadingSkeleton";
const StatCard = ({ icon, title, value, accent }) => (
  <Box sx={{ ...statCardSx, display: "flex", alignItems: "center", gap: 2 }}>
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2,
        bgcolor: colors.bgMuted,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: accent || colors.primary,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: colors.textMuted,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 700,
          color: colors.text,
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const DashboardPage = () => {
  const { produkTerlaris, totalOmzet, jumlahTransaksi, loading } =
    useLaporanTransaksi();

  const { produk, loading: produkLoading } = useProdukDb();
  const isLoading = loading || produkLoading;
  const totalUnitTerjual = useMemo(() => {
    return (produkTerlaris || []).reduce(
      (sum, item) => sum + Number(item.total_terjual || 0),
      0,
    );
  }, [produkTerlaris]);
  const topProducts = useMemo(() => {
    return (produkTerlaris || []).slice(0, 5).map((item) => {
      const dataProduk = (produk || []).find(
        (p) => p.id_produk === item.id_produk,
      );
      return {
        id: item.id_produk,
        name: item.nama_produk || "-",
        type: item.kategori || "-",
        sold: Number(item.total_terjual || 0),
        stock: Number(dataProduk?.stok || 0),
      };
    });
  }, [produkTerlaris, produk]);
  const columns = [
    {
      header: "Produk",
      accessor: "name",
      render: (row, idx) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 12,
              bgcolor: colors.primaryLight,
              color: colors.primary,
            }}
          >
            {idx + 1}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              {row.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
              {row.type}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      header: "Kategori",
      accessor: "type",
      render: (row) => (
        <Typography sx={{ fontSize: 14, color: colors.textSecondary }}>
          {row.type}
        </Typography>
      ),
    },
    {
      header: "Terjual",
      accessor: "sold",
      align: "center",
      render: (row) => (
        <Typography sx={{ fontWeight: 600 }}>
          {row.sold.toLocaleString()} unit
        </Typography>
      ),
    },
    {
      header: "Sisa Stok",
      accessor: "stock",
      align: "center",
      render: (row) => (
        <Typography sx={{ color: colors.textSecondary }}>
          {row.stock.toLocaleString()} unit
        </Typography>
      ),
    },
  ];
  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }
  return (
    <Box>
      <Box
        sx={{
          background: colors.bgCard,
          borderRadius: 3,
          p: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: typography.title, color: colors.text }}
            >
              Dashboard
            </Typography>

            <Typography sx={{ fontSize: typography.body, color: colors.textSecondary, mt: 1 }}>
              Pantau ringkasan operasional dan penjualan produk terlaris.
            </Typography>
          </Box>
        </Box>
      </Box>


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          mb: 2,
        }}
      >
        <StatCard
          icon={<AccountBalanceWalletOutlinedIcon />}
          title="Pendapatan Bulan Ini"
          value={formatCurrency(totalOmzet ?? 0)}
        />
        <StatCard
          icon={<InsertChartOutlinedIcon />}
          title="Transaksi Selesai"
          value={(jumlahTransaksi ?? 0).toLocaleString()}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          icon={<AssignmentLateOutlinedIcon />}
          title="Produk Terjual"
          value={(produkTerlaris || []).length.toLocaleString()}
          accent={colors.warning}
        />

        <StatCard
          icon={<EventBusyOutlinedIcon />}
          title="Unit Terjual"
          value={totalUnitTerjual.toLocaleString()}
          accent={colors.danger}
        />

        <StatCard
          icon={
            <KeyboardTabOutlinedIcon sx={{ transform: "rotate(180deg)" }} />
          }
          title="Produk Terlaris"
          value={topProducts[0]?.name || "-"}
          accent={colors.primary}
        />
      </Box>

      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: 2,
          border: `1px solid ${colors.borderLight}`,
          p: 2.5,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: 15, mb: 0.5 }}>
          Top 5 Produk Terlaris
        </Typography>
        <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 2 }}>
          Performa produk periode berjalan
        </Typography>

        {topProducts.length > 0 ? (
          <Table columns={columns} data={topProducts} />
        ) : (
          <Typography
            sx={{
              textAlign: "center",
              py: 5,
              color: colors.textMuted,
            }}
          >
            Belum ada data penjualan.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
