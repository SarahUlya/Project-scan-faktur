import { useState, useEffect, useCallback } from "react";
import { getShiftListApi } from "../api/transaksiApi";

/**
 * Hook untuk fetch list shift dari API.
 * @param {Object} opts — { startDate, endDate }
 */
export default function useShiftList({ startDate = "", endDate = "" } = {}) {
  const [shiftList, setShiftList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await getShiftListApi(params);
      const data = Array.isArray(res) ? res : res?.data || [];

      console.log("[useShiftList] response:", data);
      setShiftList(data);
    } catch (err) {
      console.error("[useShiftList] error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat data shift"
      );
      setShiftList([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { shiftList, loading, error, refetch: fetchData };
}