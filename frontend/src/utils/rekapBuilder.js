import { isStatusLunas, isStatusDibatalkan } from "./statusHelpers";

/**
 * Bangun rekap harian dari list transaksi.
 * @param {Array} transaksiList
 * @returns {Array} [{ id, tanggal, kasir, totalTransaksi, omzet, dibatalkan }]
 */
export const buildDailyRekap = (transaksiList) => {
  const days = {};

  (transaksiList || []).forEach((t) => {
    const tgl = t.tanggal_transaksi || t.created_at;
    if (!tgl) return;

    const key = new Date(tgl).toISOString().split("T")[0];

    if (!days[key]) {
      days[key] = {
        id: key,
        tanggal: key,
        kasir: "Admin Utama",
        kasirCounter: {},
        totalTransaksi: 0,
        omzet: 0,
        dibatalkan: 0,
      };
    }

    const day = days[key];
    day.totalTransaksi += 1;

    const nama = t.user?.nama || t.kasir?.nama || "Admin Utama";
    day.kasirCounter[nama] = (day.kasirCounter[nama] || 0) + 1;

    if (isStatusLunas(t.status)) {
      day.omzet += Number(t.total || t.total_bayar || 0);
    }
    if (isStatusDibatalkan(t.status)) {
      day.dibatalkan += 1;
    }
  });

  // Kasir terbanyak per hari
  Object.values(days).forEach((d) => {
    const sorted = Object.entries(d.kasirCounter).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) d.kasir = sorted[0][0];
  });

  return Object.values(days).sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal)
  );
};