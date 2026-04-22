import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Avatar
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
        <List sx={{ flexGrow: 1 }}>
          {menu.map((item, index) => {
            const selected = location.pathname === item.path;

            return (
              <ListItemButton
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  my: 1,
                  borderRadius: 2,
                  background: selected ? "#E91E63" : "none",
                  color: selected ? "#fff" : "#64748B",
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ color: selected ? "#fff" : "#94A3B8" }}>
                  {iconMap[item.icon]}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: selected ? 700 : 600,
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
              gap: 2,
              background: "#FDF2F8",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "#E91E63", width: 48, height: 48 }}>
              {getInitials(user?.name || user?.username)}
            </Avatar>

            <Box>
              <Typography fontWeight="bold">
                {user?.name || user?.username || "Unknown User"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {user?.email || "tidak ada email"}
              </Typography>

              <Typography variant="caption" color="primary">
                {user?.role || "-"}
              </Typography>
            </Box>
          </Box>
        </Box>

      </Box>
    </Drawer>
  );
};

export default Sidebar;