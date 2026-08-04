import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import id from "date-fns/locale/id";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import useRiwayat from "../hooks/useRiwayat";
import PaginationControls from "../components/ui/PaginationControls";
import DetailTransaksiModal from "../components/riwayat/DetailTransaksiModal";
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
import RiwayatLoadingSkeleton from "../components/riwayat/RiwayatLoadingSkeleton";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { formatRupiahPos } from "../utils/posCalculations";


const ID_MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, jun: 5,
  jul: 6, agu: 7, sep: 8, okt: 9, nov: 10, des: 11,
};

const parseIndonesianDateString = (str) => {
  if (!str || typeof str !== "string") return null;
  // Matches things like "21 Jul 2026" or "21 Jul 2026 09.21"
  const match = str
    .trim()
    .match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})(?:\s+(\d{1,2})[.:](\d{2}))?/);
  if (!match) return null;

  const [, day, monthRaw, year, hour = "0", minute = "0"] = match;
  const monthKey = monthRaw.toLowerCase().slice(0, 3);
  const monthIndex = ID_MONTHS[monthKey];
  if (monthIndex === undefined) return null;

  const date = new Date(
    Number(year),
    monthIndex,
    Number(day),
    Number(hour),
    Number(minute)
  );
  return isNaN(date.getTime()) ? null : date;
};

const getItemDate = (item) => {
  if (!item) return null;

  const candidates = [
    item.tanggal_transaksi,
    item.tanggal,
    item.created_at,
    item.createdAt,
    item.tanggal_input,
    item.waktu, // display field used by the WAKTU column — often "21 Jul 2026"
  ];

  for (const raw of candidates) {
    if (!raw) continue;

    // Try native parsing first (handles ISO strings, timestamps, etc.)
    const native = new Date(raw);
    if (!isNaN(native.getTime())) return native;

    // Fall back to Indonesian display-string parsing ("21 Jul 2026")
    const parsedId = parseIndonesianDateString(String(raw));
    if (parsedId) return parsedId;
  }

  return null;
};

const RiwayatPage = () => {
  const { data, loading, refreshData } = useRiwayat();
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // raw input, debounced into searchQuery
  const [dateError, setDateError] = useState("");

  const PAGE_SIZE = 10; // Jumlah transaksi per halaman

  // Debug: Log data untuk melihat struktur
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("=== DATA TRANSAKSI DETAIL ===");
      console.log("Total data:", data.length);
      console.log("Sample data pertama:", data[0]);
      console.log("Properti yang tersedia:", Object.keys(data[0]));

      const statuses = [...new Set(data.map(item => item.status || item.status_transaksi || "undefined"))];
      console.log("Status yang tersedia:", statuses);
    }
  }, [data]);

  // Debounce search input -> searchQuery (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Validate date range whenever it changes
  useEffect(() => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setDateError("Tanggal Mulai tidak boleh setelah Tanggal Akhir");
    } else {
      setDateError("");
    }
  }, [startDate, endDate]);

  // Format tanggal untuk display
  const formatDate = (dateString) => {
    const date = getItemDate({ waktu: dateString }) || new Date(dateString);
    if (!dateString || isNaN(date?.getTime?.())) return "-";
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateFull = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    } catch {
      return "-";
    }
  };

  // Normalize status
  const normalizeStatus = (status) => {
    if (!status) return "SELESAI";
    const statusUpper = String(status).toUpperCase().trim();

    if (statusUpper.includes("BATAL") || statusUpper === "CANCELLED" || statusUpper === "CANCEL") {
      return "DIBATALKAN";
    }
    if (statusUpper.includes("MENUNGGU") || statusUpper.includes("PENDING") || statusUpper.includes("WAITING")) {
      return "MENUNGGU_PEMBATALAN";
    }
    if (statusUpper.includes("SELESAI") || statusUpper === "COMPLETED" || statusUpper === "DONE" || statusUpper === "SUCCESS") {
      return "SELESAI";
    }
    return "SELESAI";
  };

  // Quick date presets
  const applyPreset = (preset) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (preset === "today") {
      // start/end already today
    } else if (preset === "7days") {
      start.setDate(now.getDate() - 6);
    } else if (preset === "thisMonth") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filter by search query (no transaksi)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const noTransaksi = String(item.no_transaksi || item.no_faktur || "").toLowerCase();
        return noTransaksi.includes(q);
      });
    }

    // Filter by status
    if (statusFilter !== "SEMUA") {
      filtered = filtered.filter((item) => {
        const rawStatus = item.status || item.status_transaksi || "SELESAI";
        return normalizeStatus(rawStatus) === statusFilter;
      });
    }

    // Filter by date range (uses unified getItemDate helper)
    if (startDate && endDate && !dateError) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const date = getItemDate(item);
        if (!date) return false;
        return date >= start && date <= end;
      });
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((item) => {
        const date = getItemDate(item);
        if (!date) return false;
        return date >= start;
      });
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => {
        const date = getItemDate(item);
        if (!date) return false;
        return date <= end;
      });
    }

    return filtered;
  }, [data, statusFilter, startDate, endDate, searchQuery, dateError]);

  // Group by date dengan pagination per transaksi
  const groupedData = useMemo(() => {
    const groups = {};

    filteredData.forEach((item) => {
      const date = getItemDate(item);
      const dateKey = date ? date.toISOString().split("T")[0] : "no-date";

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          transactions: [],
          totalTransactions: 0,
          totalOmzet: 0,
          totalCancelled: 0,
          totalCancelledNominal: 0,
        };
      }

      groups[dateKey].transactions.push(item);
      groups[dateKey].totalTransactions += 1;

      const total = Number(item.total || item.total_bayar || 0);
      const rawStatus = item.status || item.status_transaksi || "SELESAI";
      const normalizedStatus = normalizeStatus(rawStatus);

      if (normalizedStatus === "DIBATALKAN") {
        groups[dateKey].totalCancelled += 1;
        groups[dateKey].totalCancelledNominal += total;
      } else {
        groups[dateKey].totalOmzet += total;
      }
    });

    // Sort dates descending
    return Object.values(groups).sort((a, b) => {
      if (a.date === "no-date") return 1;
      if (b.date === "no-date") return -1;
      return b.date.localeCompare(a.date);
    });
  }, [filteredData]);

  // Summary statistics
  const summary = useMemo(() => {
    let totalTransactions = 0;
    let totalOmzet = 0;
    let totalCancelled = 0;
    let totalCancelledNominal = 0;

    filteredData.forEach((item) => {
      totalTransactions += 1;
      const total = Number(item.total || item.total_bayar || 0);
      const rawStatus = item.status || item.status_transaksi || "SELESAI";
      const normalizedStatus = normalizeStatus(rawStatus);

      if (normalizedStatus === "DIBATALKAN") {
        totalCancelled += 1;
        totalCancelledNominal += total;
      } else {
        totalOmzet += total;
      }
    });

    return {
      totalTransactions,
      totalOmzet,
      totalCancelled,
      totalCancelledNominal,
    };
  }, [filteredData]);

  // Pagination - semua transaksi yang sudah digroup
  const allTransactions = useMemo(() => {
    const flat = [];
    groupedData.forEach(group => {
      group.transactions.forEach(transaction => {
        flat.push({
          ...transaction,
          _groupDate: group.date,
          _groupTransactions: group.totalTransactions,
          _groupOmzet: group.totalOmzet,
          _groupCancelled: group.totalCancelled,
        });
      });
    });
    return flat;
  }, [groupedData]);

  const totalPages = Math.max(1, Math.ceil(allTransactions.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

  // Re-group paginated transactions by date
  const paginatedGroupedData = useMemo(() => {
    const groups = {};

    paginatedTransactions.forEach((item) => {
      const dateKey = item._groupDate;

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          transactions: [],
          totalTransactions: 0,
          totalOmzet: 0,
          totalCancelled: 0,
          totalCancelledNominal: 0,
        };
      }

      groups[dateKey].transactions.push(item);
      groups[dateKey].totalTransactions += 1;

      const total = Number(item.total || item.total_bayar || 0);
      const rawStatus = item.status || item.status_transaksi || "SELESAI";
      const normalizedStatus = normalizeStatus(rawStatus);

      if (normalizedStatus === "DIBATALKAN") {
        groups[dateKey].totalCancelled += 1;
        groups[dateKey].totalCancelledNominal += total;
      } else {
        groups[dateKey].totalOmzet += total;
      }
    });

    // Sort dates descending
    return Object.values(groups).sort((a, b) => {
      if (a.date === "no-date") return 1;
      if (b.date === "no-date") return -1;
      return b.date.localeCompare(a.date);
    });
  }, [paginatedTransactions]);

  const handleRefresh = async () => {
    await refreshData();
    setPage(1);
  };

  const hasActiveFilters = startDate || endDate || statusFilter !== "SEMUA" || searchQuery;

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setStatusFilter("SEMUA");
    setSearchQuery("");
    setSearchInput("");
    setPage(1);
  };

  const getStatusBadge = (status) => {
    const rawStatus = status || "SELESAI";
    const normalizedStatus = normalizeStatus(rawStatus);

    const statusMap = {
      SELESAI: {
        label: "Selesai",
        color: colors.success,
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
        bgColor: colors.successLight,
      },
      MENUNGGU_PEMBATALAN: {
        label: "Menunggu Persetujuan",
        color: colors.warning,
        icon: <PendingIcon sx={{ fontSize: 14 }} />,
        bgColor: colors.warningLight,
      },
      DIBATALKAN: {
        label: "Dibatalkan",
        color: colors.danger,
        icon: <CancelIcon sx={{ fontSize: 14 }} />,
        bgColor: colors.dangerLight,
      },
    };

    const statusInfo = statusMap[normalizedStatus] || statusMap.SELESAI;
    return (
      <Chip
        label={statusInfo.label}
        icon={statusInfo.icon}
        size="small"
        sx={{
          backgroundColor: statusInfo.bgColor,
          color: statusInfo.color,
          fontWeight: 700,
          fontSize: 10,
          borderRadius: 1.5,
          "& .MuiChip-icon": { color: statusInfo.color },
        }}
      />
    );
  };

  const statusLabelMap = {
    SELESAI: "Selesai",
    MENUNGGU_PEMBATALAN: "Menunggu Persetujuan",
    DIBATALKAN: "Dibatalkan",
  };

  const columns = [
    {
      header: "NO",
      accessor: "no",
      width: 50,
      align: "center",
    },
    {
      header: "NO. TRANSAKSI",
      accessor: "no_transaksi",
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: 13, color: colors.text }}>
          {row.no_transaksi || row.raw?.no_transaksi || "-"}
        </Typography>
      ),
    },
    {
      header: "WAKTU",
      accessor: "waktu",
      render: (row) => {
        return (
          <Typography sx={{ fontWeight: 500, fontSize: 13, color: colors.text }}>
            {row.waktu ? `${row.waktu} • ${row.jam || ""}` : "-"}
          </Typography>
        );
      },
    },
    {
      header: "TOTAL PEMBAYARAN",
      accessor: "total",
      align: "right",
      render: (row) => (
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.text }}>
          Rp {Number(row.total || row.total_bayar || 0).toLocaleString("id-ID")}
        </Typography>
      ),
    },
    {
      header: "METODE",
      accessor: "metode",
      align: "center",
      render: (row) => {
        const metode = row.metode_bayar?.toUpperCase() || row.metode?.toUpperCase() || "TUNAI";
        const isQRIS = metode === "QRIS";
        const isTunai = metode === "TUNAI";
        return (
          <Chip
            label={metode}
            size="small"
            sx={{
              backgroundColor: isQRIS
                ? colors.primaryLight
                : isTunai
                  ? colors.successLight
                  : colors.textMutedLight,
              color: isQRIS
                ? colors.blue
                : isTunai
                  ? colors.success
                  : colors.textMuted,
              fontWeight: 700,
              fontSize: 10,
              borderRadius: 1.5,
            }}
          />
        );
      },
    },
    {
      header: "KASIR",
      accessor: "kasir",
      render: (row) => (
        <Typography sx={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
          {row.user?.nama || row.kasir || row.nama_kasir || "-"}
        </Typography>
      ),
    },
    {
      header: "STATUS",
      accessor: "status",
      align: "center",
      render: (row) => {
        console.log("STATUS ROW:", row.no_transaksi, row.status);

        const rawStatus = row.status || row.status_transaksi || "SELESAI";
        return getStatusBadge(rawStatus);
      },
    },
    {
      header: "AKSI",
      align: "center",
      render: (row) => (
        <Button
          onClick={() => setDetailId(row.id)}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: colors.primary,
            color: colors.textOnDark,
            fontSize: 11,
            borderRadius: 2,
            px: 2,
            py: 0.75,
            minWidth: 100,
            "&:hover": { backgroundColor: colors.primaryHover },
          }}
        >
          Lihat Detail
        </Button>
      ),
    },
  ];

  const renderGroupedTransactions = () => {
    if (paginatedGroupedData.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Box sx={{ mb: 2 }}>
            <ReceiptIcon sx={{ fontSize: 48, color: colors.textMuted }} />
          </Box>
          <Typography sx={{ color: colors.textSecondary, fontSize: 16, fontWeight: 600 }}>
            Tidak ada transaksi yang ditemukan
          </Typography>
          <Typography sx={{ color: colors.textMuted, fontSize: 13, mt: 1 }}>
            Coba ubah filter atau refresh halaman
          </Typography>
        </Box>
      );
    }

    return paginatedGroupedData.map((group) => {
      let dateDisplay = group.date;
      if (group.date !== "no-date") {
        try {
          const date = new Date(group.date);
          if (!isNaN(date.getTime())) {
            dateDisplay = date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          }
        } catch {
        }
      } else {
        dateDisplay = "Tanpa Tanggal";
      }

      return (
        <Box key={group.date} sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              pb: 1.5,
              px: 2.5,
              pt: 2.5,
              borderBottom: `1px solid ${colors.border}`,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: colors.text }}>
              {dateDisplay}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                fontSize: 13,
                color: colors.textSecondary,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography component="span" sx={{ fontWeight: 600, color: colors.text }}>
                  {group.totalTransactions}
                </Typography>
                <Typography component="span">Transaksi</Typography>
              </Box>
              <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography component="span">Omzet:</Typography>
                <Typography component="span" sx={{ fontWeight: 600, color: colors.text }}>
                  Rp {group.totalOmzet.toLocaleString("id-ID")}
                </Typography>
              </Box>
              {group.totalCancelled > 0 && (
                <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: colors.danger }}>
                  <Typography component="span">Dibatalkan:</Typography>
                  <Typography component="span" sx={{ fontWeight: 600 }}>
                    {group.totalCancelled}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ px: 1 }}>
            <Table
              columns={columns}
              data={group.transactions.map((item, index) => ({
                ...item,
                no: startIndex + index + 1,
              }))}
            />
          </Box>
        </Box>
      );
    });
  };

  if (loading) {
    return <RiwayatLoadingSkeleton />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
      <Box sx={{ p: 3, width: "100%", maxWidth: "100%", overflow: "hidden" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={pageHeaderSx.title}>
            Riwayat Transaksi
          </Typography>
          <Typography sx={pageHeaderSx.subtitle}>
            Daftar rekaman transaksi penjualan Apotek Ampuh Tayu
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                ...statCardSx,
                p: 3,
                transition: transitions.fast,
                "&:hover": {
                  boxShadow: shadows.hover,
                  transform: "translateY(-2px)",
                }
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 28, color: colors.text, lineHeight: 1.2 }}>
                  {summary.totalTransactions}
                </Typography>
                <Typography sx={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
                  Total Transaksi
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                ...statCardSx,
                p: 3,
                transition: transitions.fast,
                "&:hover": {
                  boxShadow: shadows.hover,
                  transform: "translateY(-2px)",
                }
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 28, color: colors.text, lineHeight: 1.2 }}>
                    Rp {summary.totalOmzet.toLocaleString("id-ID")}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
                  Total Omzet
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                ...statCardSx,
                p: 3,
                transition: transitions.fast,
                "&:hover": {
                  boxShadow: shadows.hover,
                  transform: "translateY(-2px)",
                }
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 28, color: colors.danger, lineHeight: 1.2 }}>
                    {summary.totalCancelled}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
                  Transaksi Dibatalkan
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                ...statCardSx,
                p: 3,
                transition: transitions.fast,
                "&:hover": {
                  boxShadow: shadows.hover,
                  transform: "translateY(-2px)",
                }
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 28, color: colors.text, lineHeight: 1.2 }}>
                  Rp {summary.totalCancelledNominal.toLocaleString("id-ID")}
                </Typography>
                <Typography sx={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
                  Nominal Pembatalan
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Filters - Stacked Layout (Anti-Scroll) */}
        <Card sx={{ p: 2, mb: 3, borderRadius: radii.xs }}>
          {/* Baris 1: Preset Waktu (Atas) */}
          <Box sx={{ mb: 1.5, pb: 1.5, borderBottom: `1px solid ${colors.border || "#eaeaea"}` }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              onChange={(e, preset) => preset && applyPreset(preset)}
              sx={{
                "& .MuiToggleButton-root": {
                  px: 1.75,
                  py: 0.4,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.8rem",
                  borderColor: colors.border,
                  "&.Mui-selected": {
                    backgroundColor: colors.primary,
                    color: "#fff",
                    "&:hover": { backgroundColor: colors.primaryHover },
                  },
                },
              }}
            >
              <ToggleButton value="today">Hari Ini</ToggleButton>
              <ToggleButton value="7days">7 Hari Terakhir</ToggleButton>
              <ToggleButton value="thisMonth">Bulan Ini</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Baris 2: Controls Filter (Bawah) */}
          <Grid container spacing={1.5} alignItems="center">
            {/* Tanggal Mulai */}
            <Grid item xs={12} sm={6} md={2.5}>
              <DatePicker
                label="Mulai"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setPage(1);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: fieldInputSx,
                    error: !!dateError,
                  },
                }}
              />
            </Grid>

            {/* Tanggal Akhir */}
            <Grid item xs={12} sm={6} md={2.5}>
              <DatePicker
                label="Akhir"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setPage(1);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: fieldInputSx,
                    error: !!dateError,
                  },
                }}
              />
            </Grid>

            {/* Filter Status */}
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth size="small" sx={fieldInputSx}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  label="Status"
                >
                  <MenuItem value="SEMUA">Semua Status</MenuItem>
                  <MenuItem value="SELESAI">Selesai</MenuItem>
                  <MenuItem value="MENUNGGU_PEMBATALAN">Menunggu Persetujuan</MenuItem>
                  <MenuItem value="DIBATALKAN">Dibatalkan</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Input Pencarian */}
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Cari No. Transaksi..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: colors.textMuted, fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchInput && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearchInput("");
                          setSearchQuery("");
                        }}
                        sx={{ p: 0.5 }}
                      >
                        <ClearIcon sx={{ fontSize: 16, color: colors.textMuted }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldInputSx}
              />
            </Grid>

            {/* Tombol Refresh */}
            <Grid item xs={12} md={1.5}>
              <Button
                variant="contained"
                onClick={handleRefresh}
                fullWidth
                size="medium"
                startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
                sx={{
                  backgroundColor: colors.primary,
                  "&:hover": { backgroundColor: colors.primaryHover },
                  py: 0.9,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>

          {/* Alert Error Tanggal */}
          {dateError && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {dateError}
            </Alert>
          )}

          {/* Active filter chips & Reset Button */}
          {hasActiveFilters && (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 1.5, borderTop: `1px solid ${colors.border || "#eaeaea"}`, flexWrap: "wrap", gap: 1 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {startDate && endDate && (
                  <Chip
                    label={`${new Date(startDate).toLocaleDateString("id-ID")} - ${new Date(endDate).toLocaleDateString("id-ID")}`}
                    onDelete={() => { setStartDate(null); setEndDate(null); }}
                    size="small"
                  />
                )}
                {statusFilter !== "SEMUA" && (
                  <Chip
                    label={`Status: ${statusLabelMap[statusFilter]}`}
                    onDelete={() => setStatusFilter("SEMUA")}
                    size="small"
                  />
                )}
                {searchQuery && (
                  <Chip
                    label={`Cari: "${searchQuery}"`}
                    onDelete={() => { setSearchInput(""); setSearchQuery(""); }}
                    size="small"
                  />
                )}
              </Stack>
              <Button
                variant="outlined"
                onClick={resetFilters}
                size="small"
                sx={{
                  color: colors.textOnDark,
                  borderColor: colors.border,
                  "&:hover": {
                    borderColor: colors.primary,
                    color: colors.primary,
                  }
                }}
              >
                Reset Filter
              </Button>
            </Box>
          )}
        </Card>

        {/* Transaction List */}
        <Card sx={{ p: 0, borderRadius: radii.xs, overflow: "hidden" }}>
          {renderGroupedTransactions()}

          <Box
            sx={{
              p: 2.5,
              borderTop: `1px solid ${colors.border}`,
              backgroundColor: colors.bgMuted,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
              Menampilkan {paginatedTransactions.length} dari {allTransactions.length} transaksi
              <Typography component="span" sx={{ ml: 1, color: colors.text, fontWeight: 600 }}>
                ({filteredData.length} total)
              </Typography>
            </Typography>
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onChange={(newPage) => setPage(newPage)}
            />
          </Box>
        </Card>

        <DetailTransaksiModal
          open={!!detailId}
          transaksiId={detailId}
          onClose={() => setDetailId(null)}
          onRefresh={handleRefresh}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default RiwayatPage;