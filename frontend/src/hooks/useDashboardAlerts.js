// src/hooks/useDashboardAlerts.js
import { useEffect, useState } from "react";
import { 
  getStokMenipis, 
  getBatchHampirExpired, 
  getAuditTrailLogs, 
  getLeaderboardKasir 
} from "../api/dashboardApi";

export default function useDashboardAlerts() {
  const [stokMenipisList, setStokMenipisList] = useState([]);
  const [hampirExpiredList, setHampirExpiredList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [leaderboardKasir, setLeaderboardKasir] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const fetchDashboardAlerts = async () => {
    try {
      setLoadingAlerts(true);
      const [stokRes, expiredRes, auditRes, kasirRes] = await Promise.allSettled([
        getStokMenipis(),
        getBatchHampirExpired(),
        getAuditTrailLogs(),
        getLeaderboardKasir(),
      ]);

      if (stokRes.status === "fulfilled") {
        setStokMenipisList(stokRes.value?.data || []);
      }
      if (expiredRes.status === "fulfilled") {
        setHampirExpiredList(expiredRes.value?.data || []);
      }
      if (auditRes.status === "fulfilled") {
        setAuditLogs(auditRes.value?.data || []);
      }
      if (kasirRes.status === "fulfilled") {
        setLeaderboardKasir(kasirRes.value?.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat alert dashboard:", error);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    fetchDashboardAlerts();
  }, []);

  return {
    stokMenipisList,
    hampirExpiredList,
    auditLogs,
    leaderboardKasir,
    loadingAlerts,
    refetchAlerts: fetchDashboardAlerts,
  };
}