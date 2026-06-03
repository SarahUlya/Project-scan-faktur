import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";


const useManajemenUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/auth/users");

      const formattedUsers = res.data.users.map((user, index) => ({
        id: user.id,
        no: index + 1,
        nama: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.isActive ? "Aktif" : "Nonaktif",
        isActive: user.isActive,
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Gagal ambil user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axiosInstance.patch(`/users/${id}/status`, {
        isActive: !currentStatus,
      });

      getUsers();
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  return {
    users,
    loading,
    handleToggleStatus,
    getUsers
  };
};

export default useManajemenUser;