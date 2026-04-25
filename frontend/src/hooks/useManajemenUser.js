import { useState } from "react";

const useManajemenUser = () => {
  // Logic data (bisa dari API nantinya)
  const [users] = useState([
    { id: 1, no: 1, nama: "Admin Utama", email: "admin@ampuh.com", username: "admin_utama", role: "ADMIN", status: "Aktif" },
    { id: 2, no: 2, nama: "Siti Aminah", email: "siti.kasir@ampuh.com", username: "sitikasir12", role: "KASIR", status: "Aktif" },
    { id: 3, no: 3, nama: "Budi Santoso", email: "budi.staff@ampuh.com", username: "budistaff_01", role: "STAFF", status: "Nonaktif" },
  ]);

  const handleEdit = (id) => console.log("Edit ID:", id);
  const handleDelete = (id) => console.log("Delete ID:", id);
  const handleTambah = () => console.log("Tambah User");

  return {
    users,
    handleEdit,
    handleDelete,
    handleTambah
  };
};

export default useManajemenUser;