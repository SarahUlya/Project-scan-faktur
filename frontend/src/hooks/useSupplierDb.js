import { useEffect, useState } from "react";
import { getSupplier, createSupplier } from "../api/supplierApi";

const normalizeSupplier = (item) => ({
  id: item.id_supplier ?? item.id ?? "",
  nama: item.nama_supplier ?? item.nama ?? "",
  email: item.email ?? "",
  telepon: item.telepon ?? "",
  alamat: item.alamat ?? "",
  status: item.status ?? "AKTIF",
  inisial: item.inisial ?? (item.nama_supplier || item.nama || "")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2),
});

export default function useSupplierDb() {
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState([]);

  useEffect(() => {
    loadSupplier();
  }, []);

  const loadSupplier = async () => {
    try {
      setLoading(true);

      const res = await getSupplier();
      const formatted = (res.data || []).map(normalizeSupplier);

      setSupplier(formatted);
    } catch (err) {
      console.error("Gagal ambil supplier:", err);
    } finally {
      setLoading(false);
    }
  };

  const addSupplier = async (item) => {
    try {
      const payload = {
        nama_supplier: item.nama,
        email: item.email,
        telepon: item.telepon || null, // Opsional
        alamat: item.alamat || null,   // Opsional
      };

      console.log("Payload:", payload);

      await createSupplier(payload);
      await loadSupplier();
    } catch (err) {
      console.error("Response:", err.response?.data);
      throw err;
    }
  };

  const updateSupplier = (item) => {
    const normalized = normalizeSupplier(item);
    setSupplier((prev) => prev.map((entry) => (entry.id === normalized.id ? normalized : entry)));
    return normalized;
  };

  const removeSupplier = (id) => {
    setSupplier((prev) => prev.filter((entry) => entry.id !== id));
  };

  return {
    supplier,
    loading,
    addSupplier,
    updateSupplier,
    removeSupplier,
  };
}