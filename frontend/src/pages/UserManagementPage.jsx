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
              bgcolor: isAdmin ? "#FCE4EC" : "#E3F2FD",
              color: isAdmin ? "#E91E63" : "#2196F3",
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
            bgcolor: row.isActive ? "#E8F5E9" : "#FFEBEE",
            color: row.isActive ? "#2E7D32" : "#C62828",
            fontWeight: 600,
          }}
        />
      ),
    },

    {
      header: "AKSI",
      align: "center",
      render: (row) => (
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
      ),
    }
  ];

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <CrudPageHeader
        title="Manajemen User"
        description="Kelola pengguna dan hak akses sistem dengan cepat."
        hideSearch
      />

      <Card
        sx={{
          p: 0,
          borderRadius: 3,
          overflow: "hidden",
          minHeight: 300,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress size={28} />
            <Typography fontSize={13} color="text.secondary">
              Memuat data user...
            </Typography>
          </Box>
        ) : users.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
            }}
          >
            <Typography fontWeight={600}>
              Belum ada data user
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Silakan tambahkan user baru terlebih dahulu
            </Typography>
          </Box>
        ) : (
          <Table columns={columns} data={users} />
        )}

        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderTop: "1px solid #eee",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2024 Apotek Ampuh Tayu Management System • Versi 1.0.0-PRO
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ManajemenUserPage;