import { useEffect, useState } from "react";
import { getSupplier } from "../api/supplierApi";

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

      const formatted = (res.data || []).map((item) => ({
        id: item.id_supplier,
        nama: item.nama_supplier,
      }));

      setSupplier(formatted);
    } catch (err) {
      console.error(
        "Gagal ambil supplier:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    supplier,
    loading,
  };
}