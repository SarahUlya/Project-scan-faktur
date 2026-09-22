import { useState, useEffect, useCallback } from "react";
import { getLaporanProdukTerlaris } from "../api/laporanApi";

/**
 * Hook untuk fetch laporan produk terlaris.
 *
 * @param {Object} options
 * @param {string} options.startDate — "YYYY-MM-DD"
 * @param {string} options.endDate   — "YYYY-MM-DD"
 * @param {number} options.limit     — top N (default 50)
 *
 * Return: { data, loading, error, refetch }
 */
const useLaporanProdukTerlaris = ({
  startDate = "",
  endDate = "",
  limit = 50,
} = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { limit };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await getLaporanProdukTerlaris(params);

      // Backend bisa return { data: [...] } atau langsung array
      const list = Array.isArray(res) ? res : res?.data || [];
      setData(list);
    } catch (err) {
      console.error("[ProdukTerlaris] error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat laporan produk terlaris"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useLaporanProdukTerlaris;