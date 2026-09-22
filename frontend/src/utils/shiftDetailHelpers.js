import { colors } from "@/theme/designTokens";

/* ══════════════════════════════════════════════════════════════════
 * FORMAT — Rupiah, Tanggal, Waktu
 * ══════════════════════════════════════════════════════════════════ */
export const formatRupiah = (val) => {
  const n = Number(val) || 0;
  return `Rp ${n.toLocaleString("id-ID")}`;
};

export const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

export const formatDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ══════════════════════════════════════════════════════════════════
 * HITUNG — Durasi
 * ══════════════════════════════════════════════════════════════════ */
export const hitungDurasi = (waktuBuka, waktuTutup, status) => {
  if (!waktuBuka) return "-";
  const start = new Date(waktuBuka).getTime();
  const end = waktuTutup
    ? new Date(waktuTutup).getTime()
    : status === "OPEN"
    ? Date.now()
    : null;

  if (!end || isNaN(start) || isNaN(end)) return "-";

  const diffMs = Math.max(0, end - start);
  const totalMinutes = Math.floor(diffMs / 60000);
  const jam = Math.floor(totalMinutes / 60);
  const menit = totalMinutes % 60;

  if (jam === 0) return `${menit} menit`;
  if (menit === 0) return `${jam} jam`;
  return `${jam} jam ${menit} menit`;
};

/* ══════════════════════════════════════════════════════════════════
 * HITUNG — Total Kas Kecil dari list
 * ══════════════════════════════════════════════════════════════════ */
export const hitungTotalKasKecil = (list) => {
  if (!Array.isArray(list)) {
    return { totalMasuk: 0, totalKeluar: 0 };
  }

  let totalMasuk = 0;
  let totalKeluar = 0;

  list.forEach((item) => {
    const tipe = String(item.tipe || item.jenis || "").toLowerCase();
    const nominal = Number(item.nominal ?? item.jumlah ?? 0);

    if (tipe.includes("masuk") || tipe.includes("in")) {
      totalMasuk += nominal;
    } else if (tipe.includes("keluar") || tipe.includes("out")) {
      totalKeluar += nominal;
    }
  });

  return { totalMasuk, totalKeluar };
};

/* ══════════════════════════════════════════════════════════════════
 * HITUNG — Info selisih (warna + label dinamis)
 * ══════════════════════════════════════════════════════════════════ */
export const getSelisihInfo = (selisih, saldoSistem) => {
  if (selisih == null) {
    return {
      color: colors.textSecondary,
      label: "—",
      chipBg: colors.bgMuted,
    };
  }

  if (selisih === 0) {
    return {
      color: colors.success,
      label: "SESUAI",
      chipBg: colors.successLight,
    };
  }

  const absPersen = Math.abs(selisih) / (saldoSistem || 1);

  if (absPersen > 0.05) {
    return {
      color: colors.danger,
      label: selisih > 0 ? "LEBIH" : "KURANG",
      chipBg: colors.dangerLight,
    };
  }

  return {
    color: colors.warning,
    label: selisih > 0 ? "LEBIH" : "KURANG",
    chipBg: colors.warningLight,
  };
};