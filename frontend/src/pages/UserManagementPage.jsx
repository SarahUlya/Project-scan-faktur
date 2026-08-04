import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useState } from "react";
import useManajemenUser from "../hooks/useManajemenUser";
import { Box, Card, Chip, CircularProgress, Typography } from "@mui/material";
import CrudPageHeader from "../components/ui/CrudPageHeader";
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
import UserManagementLoadingSkeleton from "../components/user/UserManagementLoadingSkeleton";
const ManajemenUserPage = () => {
  const {
    users,
    loading,
    handleToggleStatus,
  } = useManajemenUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const columns = [
    { header: "NO", accessor: "no", width: "60px", align: "center" },

    {
      header: "NAMA LENGKAP",
      render: (row) => (
        <Box>
          <Typography fontWeight={700} fontSize={14}>
            {row.nama || "-"}
          </Typography>

          <Typography fontSize={12} color="text.secondary">
            {row.email || "-"}
          </Typography>
        </Box>
      ),
    },

    {
      header: "USERNAME",
      render: (row) => (
        <Typography fontSize={13}>
          {row.username || "-"}
        </Typography>
      ),
    },

    {
      header: "ROLE",
      render: (row) => {
        const role = row.role || "USER";
        const isAdmin = role === "ADMIN";

        return (
          <Chip
            label={role}
            size="small"
            sx={{
              bgcolor: isAdmin ? colors.primaryLight : colors.bgMuted,
              color: isAdmin ? colors.primary : colors.textSecondary,
              fontWeight: "bold",
              fontSize: 10,
            }}
          />
        );
      },
    },

    {
      header: "STATUS",
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          sx={{
            bgcolor: row.isActive ? colors.successLight : colors.dangerLight,
            color: row.isActive ? colors.success : colors.danger,
            fontWeight: 600,
          }}
        />
      ),
    },

    {
      header: "AKSI",
      align: "center",
      render: (row) => {
        if (row.role === "ADMIN") {
          return "-";
        }

        return (
          <>
            <IconButton onClick={(e) => handleOpenMenu(e, row)}>
              <MoreVertIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedUser?.id === row.id}
              onClose={handleCloseMenu}
            >
              <MenuItem
                onClick={() => {
                  handleToggleStatus(row.id, row.isActive);
                  handleCloseMenu();
                }}
              >
                <ListItemIcon>
                  {row.isActive ? (
                    <ToggleOffIcon fontSize="small" />
                  ) : (
                    <ToggleOnIcon fontSize="small" />
                  )}
                </ListItemIcon>

                <ListItemText>
                  {row.isActive ? "Nonaktifkan User" : "Aktifkan User"}
                </ListItemText>
              </MenuItem>
            </Menu>
          </>
        );
      },
    }
  ];

  return (
    <Box sx={{ p: 2, bgcolor: colors.bgPage, minHeight: "100vh" }}>
      <CrudPageHeader
        title="Manajemen User"
        description="Kelola pengguna dan hak akses sistem dengan cepat."
        hideSearch
      />

      <Card
        sx={{
          p: 2,
          borderRadius: radii.Boolean,
          boxShadow: shadows.sm,
          border: `1px solid ${colors.borderLight}`,
          bgcolor: colors.bgCard,
        }}
      >
        {loading ? (
          <UserManagementLoadingSkeleton />
        ) : users.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              gap: 1,
              bgcolor: colors.bgMuted,
              borderRadius: radii.xs,
              border: `1px solid ${colors.borderLight}`,
              boxShadow: shadows.sm,
              transition: transitions.fast,
              "&:hover": {
                boxShadow: shadows.md,
                transform: "translateY(-2px)",
              },
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © 2024 Apotek Ampuh Tayu Management System • Versi 1.0.0-PRO
            </Typography>
          </Box>
        ) : (
          <Table columns={columns} data={users} />
        )}
      </Card>
    </Box>
  );
};

export default ManajemenUserPage;