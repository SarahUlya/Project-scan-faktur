import React from "react";
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
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";

import { useNavigate, useLocation } from "react-router-dom";
import useSidebarMenu from "../../hooks/useSidebarMenu";
import { getUser } from "../../auth/auth";
import { colors, radii } from "@/theme/designTokens"; // tambahkan radii

const drawerWidth = 248;

// Ikon untuk item utama (tanpa subItems) – dipetakan dari string ke komponen
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

// Ikon untuk sub-item – dipetakan dari teks ke komponen
const subIconMap = {
  "Data Produk": <ProductionQuantityLimitsIcon />,
  "Data Supplier": <StorefrontIcon />,
  "Stok & Batch": <Inventory2Icon />,
  "Daftar Pembelian": <ShoppingCartCheckoutIcon />,
  "Tambah Pembelian": <AddShoppingCartIcon />,
  // "Buku Defecta": <AssignmentLateIcon />, // <-- TAMBAHKAN INI
  Kasir: <PointOfSaleOutlinedIcon />,
  "Riwayat Transaksi": <ReceiptLongIcon />,
  "Manajemen User": <PeopleIcon />,
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const menuItems = useSidebarMenu();

  // Bangun struktur section dari menuItems
  const buildSections = (items) => {
    const sections = [];
    const generalItems = [];

    items.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        sections.push({
          title: item.text,
          items: item.subItems.map((sub) => ({
            text: sub.text,
            path: sub.path,
            icon: subIconMap[sub.text] || <ListAltIcon />,
          })),
        });
      } else {
        generalItems.push({
          text: item.text,
          path: item.path,
          icon: item.icon, // string, misal "DashboardIcon"
        });
      }
    });

    if (generalItems.length > 0) {
      sections.unshift({
        title: "General",
        items: generalItems,
      });
    }

    return sections;
  };

  const sections = buildSections(menuItems);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("rememberedUsername");
    navigate("/login");
  };

  // Fungsi untuk mendapatkan komponen ikon yang benar
  const getIconComponent = (item) => {
    if (typeof item.icon === "string") {
      return iconMap[item.icon] || <ListAltIcon />;
    }
    return item.icon || <ListAltIcon />;
  };

  // Style untuk item menu (termasuk sub-item) – menggunakan radii.s
  const itemSx = (selected) => ({
    mx: 1,
    my: 0.25,
    borderRadius: radii.s,      // 4px
    pl: 2,
    py: 0.9,
    color: selected ? colors.textOnDark : colors.textSecondary,
    bgcolor: selected ? colors.primary : "transparent",
    "&:hover": {
      bgcolor: selected ? colors.primary : colors.primary + "33",
      color: colors.textOnDark,
    },
  });

  // Style untuk header section (teks putih, tanpa ikon)
  const sectionHeaderSx = {
    px: 2.5,
    py: 0.75,
    color: colors.textOnDark,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    opacity: 0.7,
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
          background: colors.bgSidebar,
          borderRight: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Brand */}
        <Box
          sx={{
            px: 2.5,
            py: 2.5,
            borderBottom: "1px solid " + colors.border,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LocalPharmacyOutlinedIcon
              sx={{ color: colors.primaryHover, fontSize: 28 }}
            />
            <Typography
              sx={{
                fontWeight: 700,
                color: colors.textOnDark,
                fontSize: 15,
                lineHeight: 1.2,
              }}
            >
              Ampuh Tayu
            </Typography>
          </Box>
        </Box>

        {/* Menu sections dengan scroll */}
        <List
          sx={{
            flexGrow: 1,
            px: 0.5,
            py: 1.5,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.2)", // bisa disesuaikan nanti
              borderRadius: radii.s,              // 4px
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "rgba(255,255,255,0.4)",
            },
          }}
        >
          {sections.map((section, idx) => (
            <Box key={idx}>
              {/* Header section (hanya teks putih) */}
              <Typography sx={sectionHeaderSx}>{section.title}</Typography>

              {/* Item dalam section */}
              {section.items.map((item, itemIdx) => {
                const selected = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={itemIdx}
                    onClick={() => navigate(item.path)}
                    sx={itemSx(selected)}
                  >
                    <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                      {getIconComponent(item)}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: selected ? 600 : 500,
                        fontSize: 13,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </Box>
          ))}
        </List>

        {/* Profil & Logout – border menggunakan warna dari design tokens */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid " + colors.bgSidebarHover,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minWidth: 0,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: colors.primary,
                  width: 36,
                  height: 36,
                  fontSize: 13,
                }}
              >
                {getInitials(user?.name || user?.username)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: colors.textOnDark,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name || user?.username || "User"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: colors.textSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.email || "—"}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleLogout}
              size="small"
              sx={{
                color: colors.primary,
                "&:hover": { color: colors.textOnDark },
              }}
            >
              <ExitToAppIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;