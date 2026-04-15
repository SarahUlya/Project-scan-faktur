
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar } from "@mui/material";
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

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menu = useSidebarMenu();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#FFFFFF',
          borderRight: 'none',
          p: 0,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
            <Box component="span" sx={{ verticalAlign: 'middle', mr: 1 }}>
              <DashboardIcon sx={{ color: '#E91E63', fontSize: 28, mb: '-5px' }} />
            </Box>
            Ampuh Tayu
          </Typography>
          <Typography variant="caption" sx={{ color: '#EC4899', fontWeight: 700 }}>
            APOTEK SYSTEM
          </Typography>
        </Box>
        <List sx={{ flexGrow: 1 }}>
          {menu.map((item, index) => {
            const selected = location.pathname === item.path;
            return (
              <ListItemButton
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  my: 1.2,
                  borderRadius: 2,
                  background: selected ? 'linear-gradient(90deg, #E91E63 0%, #E91E63 100%)' : 'none',
                  color: selected ? '#ffffff' : '#64748B',
                  fontWeight: selected ? 700 : 700,
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ color: selected ? '#ffffff' : '#94A3B8', minWidth: 40 }}>
                  {iconMap[item.icon]}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: selected ? 700 : 600 }} />
              </ListItemButton>
            );
          })}
        </List>
        <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, background: '#FDF2F8 50% ', borderRadius: 2, p: 2 }}>
            <Avatar sx={{ bgcolor: '#E91E63', width: 48, height: 48, fontWeight: 700 }}>AU</Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#E91E63' }}>Admin Utama</Typography>
              <Typography variant="caption" sx={{ color: '#B0B0B0' }}>admin@ampuh.com</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;