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
      text: "Master Data",
      icon: "InventoryIcon",
      roles: [ROLE.ADMIN, ROLE.STAFF],
      subItems: [
        { text: "Data Produk", path: "/produk" },
        { text: "Data Supplier", path: "/supplier" },
        { text: "Stok & Batch", path: "/stok-batch" },
      ],
    },
    {
      text: "Pembelian",
      icon: "ShoppingCartIcon",
      roles: [ROLE.ADMIN],
      subItems: [
        { text: "Daftar Pembelian", path: "/pembelian" },
        { text: "Tambah Pembelian", path: "/pembelian/tambah" },
      ],
    },
    {
      text: "(POS) Point of Sale",
      icon: "PointOfSaleIcon",
      roles: [ROLE.ADMIN, ROLE.KASIR],
      subItems: [
        { text: "Kasir", path: "/kasir" },
        { text: "Riwayat Transaksi", path: "/riwayat" },
      ],
    },
    {
      text: "Laporan",
      icon: "ReceiptIcon",
      path: "/laporan",
      roles: [ROLE.ADMIN],
    },
    {
      text: "Pengaturan",
      icon: "ManageAccountsIcon",
      roles: [ROLE.ADMIN],
      subItems: [
        { text: "Manajemen User", path: "/user-management" },
      ],
    },
  ];

  if (!user) return [];

  // Filter items based on user roles, and filter subItems if role requirements are added there (if any)
  return menuItems
    .filter((item) => item.roles.includes(user.role))
    .map((item) => {
      if (item.subItems) {
        // If subItems are present, we make sure they are preserved
        return item;
      }
      return item;
    });
}
