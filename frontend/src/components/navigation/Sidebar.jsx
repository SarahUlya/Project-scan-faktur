import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import HistoryIcon from "@mui/icons-material/History";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { useNavigate, useLocation } from "react-router-dom";
import useSidebarMenu from "../../hooks/useSidebarMenu";
import { getUser } from "../../auth/auth";

const drawerWidth = 260;

const iconMap = {
  DashboardIcon: <DashboardIcon />,
  InventoryIcon: <InventoryIcon />,
  ShoppingCartIcon: <ShoppingCartIcon />,
  ReceiptIcon: <ReceiptIcon />,
  ListAltIcon: <ListAltIcon />,
  PointOfSaleIcon: <PointOfSaleIcon />,
  HistoryIcon: <HistoryIcon />,
  ManageAccountsIcon: <ManageAccountsIcon />,
  LocalShippingIcon: <LocalShippingIcon />,
};

// 🔥 helper buat avatar
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menu = useSidebarMenu();
  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("rememberedUsername");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#FFFFFF",
          borderRight: "none",
          boxShadow: "2px 0 20px rgba(15, 23, 42, 0.05)",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        
        {/* HEADER */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
            <DashboardIcon sx={{ color: "#E91E63", mr: 1 }} />
            Ampuh Tayu
          </Typography>
          <Typography variant="caption" sx={{ color: "#EC4899", fontWeight: 700 }}>
            APOTEK SYSTEM
          </Typography>
        </Box>

        {/* MENU */}
        <List sx={{ flexGrow: 1, px: 1 }}>
          {menu.map((item, index) => {
            const selected = location.pathname === item.path;

            return (
              <ListItemButton
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 0,
                  my: 0.5,
                  borderRadius: 3,
                  background: selected ? "#E91E63" : "transparent",
                  color: selected ? "#fff" : "#64748B",
                  pl: 2.5,
                  py: 1.25,
                  '&:hover': {
                    background: selected ? "#E91E63" : "rgba(233, 30, 99, 0.08)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: selected ? "#fff" : "#94A3B8", minWidth: 40 }}>
                  {iconMap[item.icon]}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: selected ? 700 : 600,
                    fontSize: 14,
                    color: selected ? "#fff" : "#64748B",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        {/* USER PROFILE */}
        <Box sx={{ p: 2, mt: "auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              background: "#FDF2F8",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#E91E63", width: 48, height: 48 }}>
                {getInitials(user?.name || user?.username)}
              </Avatar>
              <Box>
                <Typography fontWeight="bold" sx={{ fontSize: 14 }}>
                  {user?.name || user?.username || "Unknown User"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                  {user?.email || "tidak ada email"}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleLogout} sx={{ color: "#E91E63" }} aria-label="Logout">
              <ExitToAppIcon />
            </IconButton>
          </Box>
        </Box>

      </Box>
    </Drawer>
  );
};

export default Sidebar;