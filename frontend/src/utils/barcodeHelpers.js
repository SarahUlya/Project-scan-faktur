/* ══════════════════════════════════════════════════════════════════
 * DETEKSI BARCODE
 * Barcode: semua digit & panjang >= 7 (biasanya 8-13 digit)
 * ══════════════════════════════════════════════════════════════════ */
export const isBarcodeLike = (str) => {
  const s = String(str || "").trim();
  if (s.length < 7) return false;
  return /^\d+$/.test(s);
};

/* ══════════════════════════════════════════════════════════════════
 * SAFE STRING — handle apapun jadi string
 * ══════════════════════════════════════════════════════════════════ */
export const safeString = (val) => {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    return (
      val.nama || val.name || val.kode || val.label || val.teks || String(val.id || "")
    );
  }
  return String(val);
};

export const getNamaProduk = (p) => {
  if (!p) return "-";
  return safeString(p.nama_produk) || safeString(p.nama) || "Produk";
};

export const getSatuanLabel = (p) => {
  if (!p) return "";
  const s = p.satuan ?? p.unit ?? p.satuan_nama;
  if (typeof s === "string") return s;
  if (typeof s === "object" && s !== null) {
    return s.nama || s.kode || s.label || "";
  }
  return "";
};

export const formatRupiah = (val) => {
  const n = Number(val) || 0;
  return n.toLocaleString("id-ID");
};