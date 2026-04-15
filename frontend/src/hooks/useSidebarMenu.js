const menu = [
  { text: "Dashboard", icon: "DashboardIcon", path: "/" },
  { text: "Produk", icon: "InventoryIcon", path: "/produk" },
  { text: "Data Supplier", icon: "LocalShippingIcon", path: "/supplier" },
  { text: "Stok & Batch", icon: "ListAltIcon", path: "/stok-batch" },
  { text: "Pembelian", icon: "ShoppingCartIcon", path: "/pembelian" },
  { text: "Laporan", icon: "ReceiptIcon", path: "/laporan" },
  { text: "Riwayat", icon: "HistoryIcon", path: "/riwayat" },
  { text: "Manajemen User", icon: "ManageAccountsIcon", path: "/user-management" },
];

export default function useSidebarMenu() {
  return menu;
}
