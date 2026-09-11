// src/api/dashboardApi.js

export async function getStokMenipis() {
  try {
    const response = await fetch("/api/v1/produk/stok-menipis", {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Gagal mengambil data stok menipis");
    return await response.json();
  } catch (error) {
    console.error("API Error [getStokMenipis]:", error);
    return { data: [] };
  }
}

export async function getBatchHampirExpired() {
  try {
    const response = await fetch("/api/v1/batch/hampir-expired", {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Gagal mengambil data batch hampir expired");
    return await response.json();
  } catch (error) {
    console.error("API Error [getBatchHampirExpired]:", error);
    return { data: [] };
  }
}

export async function getAuditTrailLogs() {
  try {
    const response = await fetch("/api/v1/laporan/audit-log", {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Gagal mengambil log audit");
    return await response.json();
  } catch (error) {
    return { data: [] };
  }
}

export async function getLeaderboardKasir() {
  try {
    const response = await fetch("/api/v1/laporan/kinerja-kasir", {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Gagal mengambil leaderboard kasir");
    return await response.json();
  } catch (error) {
    return { data: [] };
  }
}