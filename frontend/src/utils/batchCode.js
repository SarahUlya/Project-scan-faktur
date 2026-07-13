/**
 * Generate kode batch otomatis — 1 faktur = 1 kode batch.
 * Format: BATCH-YYYYMMDD-XXXX (XXXX dari no faktur atau random)
 */
export function generateBatchCode(noFaktur = "", tanggal = "") {
  const dateStr = tanggal
    ? tanggal.replace(/-/g, "")
    : new Date().toISOString().slice(0, 10).replace(/-/g, "");

  let suffix = "0001";
  if (noFaktur && noFaktur.trim()) {
    const cleaned = noFaktur.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    suffix = cleaned.slice(-6).padStart(4, "0") || "0001";
  } else {
    suffix = String(Date.now()).slice(-4);
  }

  return `BATCH-${dateStr}-${suffix}`;
}
