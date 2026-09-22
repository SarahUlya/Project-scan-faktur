import { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Box,
  Paper,
  Chip,
  Typography,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import BadgeIcon from "@mui/icons-material/Badge";
import useManajemenUser from "../hooks/useManajemenUser";
import Table from "../components/ui/Table";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  pageHeaderSx,
} from "@/theme/designTokens";
import UserManagementLoadingSkeleton from "../components/user/UserManagementLoadingSkeleton";

// ==================== ROLE CONFIG ====================
const ROLE_CONFIG = {
  ADMIN: {
    label: "ADMIN",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 12 }} />,
    bg: colors.primaryLight,
    color: colors.primary,
    border: colors.primary + "30",
  },
  KASIR: {
    label: "KASIR",
    icon: <PointOfSaleIcon sx={{ fontSize: 12 }} />,
    bg: colors.successLight,
    color: colors.success,
    border: colors.success + "30",
  },
  STAFF: {
    label: "STAFF",
    icon: <BadgeIcon sx={{ fontSize: 12 }} />,
    bg: colors.blue + "20",
    color: colors.blue,
    border: colors.blue + "30",
  },
};

const getRoleConfig = (role) => {
  const key = (role || "STAFF").toUpperCase();
  return ROLE_CONFIG[key] || ROLE_CONFIG.STAFF;
};

const ManajemenUserPage = () => {
  const { users, loading, handleToggleStatus, getUsers } = useManajemenUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // ==================== FILTER SEARCH ====================
  const filteredUsers = (users || []).filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.nama || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q) ||
      (u.role || "").toLowerCase().includes(q)
    );
  });

  // ==================== KOLOM TABEL ====================
  const columns = [
    {
      header: "NO",
      width: "60px",
      align: "center",
      render: (row) => (
        <Typography
          sx={{
            fontSize: typography.body,
            fontWeight: typography.semibold,
            color: colors.textSecondary,
          }}
        >
          {row.no}
        </Typography>
      ),
    },
    {
      header: "NAMA LENGKAP",
      render: (row) => {
        const config = getRoleConfig(row.role);
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: config.bg,
                color: config.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: typography.bold,
                fontSize: typography.body,
                flexShrink: 0,
                border: `1.5px solid ${config.border}`,
              }}
            >
              {(row.nama || "U").charAt(0).toUpperCase()}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: typography.bold,
                  fontSize: typography.body,
                  color: colors.text,
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.nama || "-"}
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.small,
                  color: colors.textSecondary,
                  lineHeight: 1.3,
                }}
              >
                {row.email || "-"}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      header: "USERNAME",
      render: (row) => (
        <Typography
          sx={{
            fontSize: typography.body,
            fontWeight: typography.medium,
            color: colors.text,
            fontFamily: "monospace",
            bgcolor: colors.bgMuted,
            px: 1,
            py: 0.3,
            borderRadius: radii.xs,
            display: "inline-block",
          }}
        >
          {row.username || "-"}
        </Typography>
      ),
    },
    {
      header: "ROLE",
      align: "center",
      render: (row) => {
        const config = getRoleConfig(row.role);
        return (
          <Chip
            icon={config.icon}
            label={config.label}
            size="small"
            sx={{
              bgcolor: config.bg,
              color: config.color,
              fontWeight: typography.bold,
              fontSize: typography.tiny,
              letterSpacing: 0.3,
              height: 22,
              borderRadius: radii.xs,
              border: `1px solid ${config.border}`,
              "& .MuiChip-icon": {
                color: config.color,
                marginLeft: "6px",
                marginRight: "-2px",
              },
              "& .MuiChip-label": {
                paddingLeft: "6px",
                paddingRight: "10px",
              },
            }}
          />
        );
      },
    },
    {
      header: "STATUS",
      align: "center",
      render: (row) => {
        const isActive = row.isActive;
        return (
          <Chip
            label={isActive ? "AKTIF" : "NON-AKTIF"}
            size="small"
            sx={{
              bgcolor: isActive ? colors.successLight : colors.dangerLight,
              color: isActive ? colors.success : colors.danger,
              fontWeight: typography.bold,
              fontSize: typography.tiny,
              letterSpacing: 0.3,
              height: 22,
              borderRadius: radii.xs,
              border: `1px solid ${isActive ? colors.success + "40" : colors.danger + "40"}`,
            }}
          />
        );
      },
    },
    {
      header: "AKSI",
      align: "center",
      width: "100px",
      render: (row) => {
        const isAdmin = (row.role || "").toUpperCase() === "ADMIN";

        if (isAdmin) {
          return (
            <Typography
              sx={{
                fontSize: typography.small,
                color: colors.textMuted,
                fontStyle: "italic",
                fontWeight: typography.medium,
              }}
            >
              Protected
            </Typography>
          );
        }

        return (
          <>
            <IconButton
              onClick={(e) => handleOpenMenu(e, row)}
              size="small"
              sx={{
                color: colors.textSecondary,
                borderRadius: radii.xs,
                "&:hover": {
                  color: colors.primary,
                  bgcolor: colors.primaryLight,
                },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedUser?.id === row.id}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  borderRadius: radii.s,
                  boxShadow: shadows.elevated,
                  border: `1px solid ${colors.borderLight}`,
                  minWidth: 220,
                  mt: 0.5,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleToggleStatus(row.id, row.isActive);
                  handleCloseMenu();
                }}
                sx={{
                  fontSize: typography.body,
                  py: 1,
                  gap: 1,
                  "&:hover": { bgcolor: colors.bgMuted },
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {row.isActive ? (
                    <ToggleOffIcon
                      fontSize="small"
                      sx={{ color: colors.danger, fontSize: 18 }}
                    />
                  ) : (
                    <ToggleOnIcon
                      fontSize="small"
                      sx={{ color: colors.success, fontSize: 18 }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    row.isActive ? "Nonaktifkan User" : "Aktifkan User"
                  }
                  primaryTypographyProps={{
                    fontSize: typography.body,
                    fontWeight: typography.semibold,
                    color: colors.text,
                  }}
                />
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  // ==================== RENDER (SAMA SEPERTI DASHBOARD) ====================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        px: spacing.xxl,
        pt: spacing.xxl,
        pb: spacing.xxl,
        display: "flex",
        flexDirection: "column",
        gap: spacing.xxl,
      }}
    >
      {/* ==================== HEADER ==================== */}
      <Paper
        elevation={0}
        sx={{
          p: spacing.xxl,
          borderRadius: radii.s,
          border: `1px solid ${colors.borderLight}`,
          bgcolor: colors.bgCard,
          boxShadow: shadows.card,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: spacing.lg,
        }}
      >
        <Box>
          <Typography sx={pageHeaderSx.title}>Manajemen User</Typography>
          <Typography
            sx={{ ...pageHeaderSx.subtitle, fontSize: typography.body }}
          >
            Kelola pengguna dan hak akses sistem Apotek Ampuh Tayu.
          </Typography>
        </Box>
      </Paper>

      {/* ==================== TABLE CARD ==================== */}
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: radii.s,
          border: `1px solid ${colors.borderLight}`,
          p: spacing.xxl,
          boxShadow: shadows.card,
        }}
      >
        {/* Header Tabel + Search */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: spacing.lg,
            pb: spacing.md,
            borderBottom: `1px solid ${colors.borderLight}`,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: typography.bold,
                fontSize: typography.h5,
                color: colors.text,
                lineHeight: 1.3,
              }}
            >
              Daftar Pengguna
            </Typography>
            <Typography
              sx={{
                fontSize: typography.caption,
                color: colors.textSecondary,
                mt: 0.3,
              }}
            >
              Total {filteredUsers.length} dari {users?.length || 0} pengguna
            </Typography>
          </Box>
        </Box>

        {/* Tabel / Empty / Loading */}
        {loading ? (
          <UserManagementLoadingSkeleton />
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 1.5,
              bgcolor: colors.bgMuted,
              borderRadius: radii.s,
              border: `1px dashed ${colors.border}`,
            }}
          >
            <PersonIcon sx={{ fontSize: 48, color: colors.textMuted }} />
            <Typography
              sx={{
                fontSize: typography.body,
                fontWeight: typography.semibold,
                color: colors.textSecondary,
              }}
            >
              {searchQuery
                ? "Pengguna tidak ditemukan"
                : "Belum ada pengguna terdaftar"}
            </Typography>
            <Typography
              sx={{ fontSize: typography.caption, color: colors.textMuted }}
            >
              {searchQuery
                ? `Tidak ada hasil untuk "${searchQuery}"`
                : "Data pengguna akan muncul setelah ditambahkan"}
            </Typography>
          </Box>
        ) : (
          <Table columns={columns} data={filteredUsers} />
        )}
      </Box>
    </Box>
  );
};

export default ManajemenUserPage;