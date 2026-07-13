import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  IconButton,
  Collapse,
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
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";

import { useNavigate, useLocation } from "react-router-dom";
import useSidebarMenu from "../../hooks/useSidebarMenu";
import { getUser } from "../../auth/auth";
import { colors } from "../../theme/designTokens";

const drawerWidth = 248;

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

const getInitials = (name) => {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menu = useSidebarMenu();
  const user = getUser();
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const initial = {};
    menu.forEach((item) => {
      if (item.subItems) {
        const hasActiveSub = item.subItems.some((sub) => sub.path === location.pathname);
        if (hasActiveSub) initial[item.text] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...initial }));
  }, [location.pathname, menu]);

  const handleToggle = (text) => {
    setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("rememberedUsername");
    navigate("/login");
  };

  const itemSx = (selected) => ({
    mx: 1,
    my: 0.25,
    borderRadius: 2,
    pl: 2,
    py: 1,
    color: selected ? "#fff" : "#94A3B8",
    bgcolor: selected ? colors.bgSidebarActive : "transparent",
    "&:hover": {
      bgcolor: selected ? colors.bgSidebarActive : colors.bgSidebarHover,
    },
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background: colors.bgSidebar,
          borderRight: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ px: 2.5, py: 2.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LocalPharmacyOutlinedIcon sx={{ color: colors.primaryHover, fontSize: 28 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 15, lineHeight: 1.2 }}>
                Ampuh Tayu
              </Typography>
              <Typography sx={{ color: "#64748B", fontSize: 11, fontWeight: 500 }}>
                Apotek System
              </Typography>
            </Box>
          </Box>
        </Box>

        <List sx={{ flexGrow: 1, px: 0.5, py: 1.5 }}>
          {menu.map((item, index) => {
            const hasSubItems = !!item.subItems;

            if (hasSubItems) {
              const isOpen = !!openMenus[item.text];
              const isAnyChildActive = item.subItems.some((sub) => location.pathname === sub.path);

              return (
                <Box key={index}>
                  <ListItemButton
                    onClick={() => handleToggle(item.text)}
                    sx={{
                      ...itemSx(false),
                      color: isAnyChildActive ? "#fff" : "#94A3B8",
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                      {iconMap[item.icon]}
                    </ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600, fontSize: 13 }} />
                    {isOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                  </ListItemButton>

                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 1 }}>
                      {item.subItems.map((sub, sIndex) => {
                        const selected = location.pathname === sub.path;
                        return (
                          <ListItemButton
                            key={sIndex}
                            onClick={() => navigate(sub.path)}
                            sx={{ ...itemSx(selected), pl: 4.5, py: 0.75 }}
                          >
                            <ListItemText
                              primary={sub.text}
                              primaryTypographyProps={{ fontWeight: selected ? 600 : 500, fontSize: 13 }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </Box>
              );
            }

            const selected = location.pathname === item.path;
            return (
              <ListItemButton key={index} onClick={() => navigate(item.path)} sx={itemSx(selected)}>
                <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                  {iconMap[item.icon]}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: selected ? 600 : 500, fontSize: 13 }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
              <Avatar sx={{ bgcolor: colors.primary, width: 36, height: 36, fontSize: 13 }}>
                {getInitials(user?.name || user?.username)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.name || user?.username || "User"}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.email || "—"}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleLogout} size="small" sx={{ color: "#94A3B8", "&:hover": { color: "#fff" } }}>
              <ExitToAppIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
