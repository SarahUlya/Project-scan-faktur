import { getUser, ROLE } from "../auth/auth";

export default function useSidebarMenu() {
  const user = getUser();

  const menuItems = [
    {
      text: "Dashboard",
      icon: "DashboardIcon",
      path: "/",
      roles: [ROLE.ADMIN, ROLE.STAFF, ROLE.KASIR],
    },
    {
      text: "Produk",
      icon: "InventoryIcon",
      path: "/produk",
      roles: [ROLE.ADMIN, ROLE.STAFF],
    },
    {
      text: "Data Supplier",
      icon: "LocalShippingIcon",
      path: "/supplier",
      roles: [ROLE.ADMIN, ROLE.STAFF],
    },
    {
      text: "Stok & Batch",
      icon: "ListAltIcon",
      path: "/stok-batch",
      roles: [ROLE.ADMIN, ROLE.STAFF],
    },
    {
      text: "Pembelian",
      icon: "ShoppingCartIcon",
      path: "/pembelian",
      roles: [ROLE.ADMIN],
    },
    {
      text: "Laporan",
      icon: "ReceiptIcon",
      path: "/laporan",
      roles: [ROLE.ADMIN],
    },
    {
      text: "Riwayat",
      icon: "HistoryIcon",
      path: "/riwayat",
      roles: [ROLE.ADMIN, ROLE.STAFF, ROLE.KASIR],
    },
    {
      text: "Manajemen User",
      icon: "ManageAccountsIcon",
      path: "/user-management",
      roles: [ROLE.ADMIN],
    },
    {
      text: "Kasir POS",
      icon: "PointOfSaleIcon",
      path: "/pos",
      roles: [ROLE.ADMIN, ROLE.KASIR],
    },
  ];

  if (!user) return [];

  return menuItems.filter((item) => item.roles.includes(user.role));
}