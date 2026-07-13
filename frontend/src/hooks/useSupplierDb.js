import { useEffect, useState } from "react";
import { getSupplier } from "../api/supplierApi";

const normalizeSupplier = (item) => ({
  id: item.id_supplier ?? item.id ?? "",
  nama: item.nama_supplier ?? item.nama ?? "",
  penanggungJawab: item.penanggung_jawab ?? item.penanggungJawab ?? "",
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

  const addSupplier = (item) => {
    const normalized = normalizeSupplier({
      ...item,
      id: item.id || `SUP-${Date.now()}`,
      nama: item.nama || item.nama_supplier || "",
      inisial: item.inisial || (item.nama || item.nama_supplier || "")
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    });

    setSupplier((prev) => [normalized, ...prev]);
    return normalized;
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