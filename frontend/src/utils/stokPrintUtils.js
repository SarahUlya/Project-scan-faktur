export function computeBatchStatus(expiredDateStr) {
  if (!expiredDateStr) return "AMAN";
  const exp = new Date(expiredDateStr);
  const now = new Date();
  if (isNaN(exp.getTime())) return "AMAN";
  if (exp < now) return "EXPIRED";
  const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return "PERINGATAN";
  return "AMAN";
}

export function formatTanggalCetak(date = new Date()) {
  return date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatJamCetak(date = new Date()) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatExpired(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Flatten data produk (API) ke baris batch */
export function flattenProdukBatches(produkList = []) {
  return produkList
    .flatMap((p) =>
      (p.batch || []).map((b) => ({
        namaProduk: p.nama_produk || p.nama || p.namaItem || "-",
        kategori: p.nama_kategori || p.kategori || "-",
        kodeBatch: b.kodeBatch || b.no_batch || "-",
        expired: b.expired || "",
        stok: b.stok || 0,
        no_faktur: b.no_faktur || "-",
        status: computeBatchStatus(b.expired),
      }))
    )
    .filter((r) => r.stok > 0)
    .sort((a, b) => new Date(a.expired || 0) - new Date(b.expired || 0));
}

/** Normalisasi data dexie LaporanStokExpired */
export function normalizeDexieBatchRows(batchData = []) {
  return batchData
    .map((row) => ({
      namaProduk: row.nama || "-",
      kategori: row.type || "-",
      kodeBatch: row.batch || "-",
      expired: row.exp || "",
      stok: row.stok || 0,
      no_faktur: "-",
      status: row.status || computeBatchStatus(row.exp),
    }))
    .filter((r) => r.stok > 0)
    .sort((a, b) => new Date(a.expired || 0) - new Date(b.expired || 0));
}

export function buildLaporanSummary(rows = []) {
  const expired = rows.filter((r) => r.status === "EXPIRED").length;
  const peringatan = rows.filter((r) => r.status === "PERINGATAN").length;
  const totalStok = rows.reduce((s, r) => s + (r.stok || 0), 0);
  const uniqueBatch = new Set(rows.map((r) => r.kodeBatch)).size;

  return {
    totalProduk: new Set(rows.map((r) => r.namaProduk)).size,
    totalBatch: uniqueBatch,
    totalBaris: rows.length,
    totalStok,
    expired,
    peringatan,
  };
}
