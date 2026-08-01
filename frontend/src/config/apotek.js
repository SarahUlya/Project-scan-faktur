// =============================================
// APOTEK CONFIG
// =============================================

export const APOTEK_INFO = {
  nama: "APOTEK SEHAT",
  alamat: "Jl. Contoh No.123, Kudus",
  telepon: "081234567890",
};

// =============================================
// SATUAN
// =============================================

export const SATUAN_OPTIONS = [
  "Tablet",
  "Kapsul",
  "Botol",
  "Strip",
  "Box",
  "Tube",
  "Sachet",
  "Pcs",
];

// =============================================
// GUDANG
// =============================================

export const GUDANG_OPTIONS = [
  {
    value: "utama",
    label: "Gudang Utama",
  },
  {
    value: "farmasi",
    label: "Gudang Farmasi",
  },
  {
    value: "rawat_jalan",
    label: "Gudang Rawat Jalan",
  },
];

// =============================================
// PPN
// =============================================

export const JENIS_PPN_OPTIONS = [
  {
    value: "non_ppn",
    label: "Non PPN",
  },
  {
    value: "sudah_termasuk",
    label: "Sudah Termasuk",
  },
];

export const NILAI_PPN_OPTIONS = [0, 11];

// =============================================
// PEMBAYARAN
// =============================================

export const JENIS_PEMBAYARAN_OPTIONS = [
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "transfer",
    label: "Transfer",
  },
  {
    value: "Kredit",
    label: "Kredit",
  },
];

export const AKUN_KAS_OPTIONS = [
  {
    value: "kas",
    label: "Kas",
  },
  {
    value: "bank",
    label: "Bank",
  },
];

// =============================================
// DEFAULT DATA FAKTUR
// =============================================

export const defaultFakturInfo = () => ({
  supplier_id: "",
  supplier_name: "",

  no_faktur: "",
  no_surat_pesanan: "",

  tanggal: new Date().toISOString().split("T")[0],
  tanggal_penerimaan: "",

  gudang: "utama",

  jenis_ppn: "non_ppn",
  nilai_ppn: 11,

  jenis_pembayaran: "cash",
  akun_kas: "kas",

  jatuh_tempo: "",

  cashback: 0,

  catatan: "",
});

// =============================================
// TEMPLATE ITEM
// =============================================

export const emptyItem = () => ({
  id: Date.now() + Math.random(),

  produk_id: "",
  nama_produk: "",
  barcode: "",

  exp_date: "",

  qty: 1,

  satuan: "Pcs",

  harga_beli: 0,
  harga_jual: 0,

  diskon: 0,
  diskon_tipe: "%",

  total: 0,
});

// =============================================
// HITUNG SUBTOTAL ITEM
// =============================================

export function hitungSubtotalItem(item) {
  const qty = Number(item.qty || 0);
  const harga = Number(item.harga_beli || 0);

  let subtotal = qty * harga;

  const diskon = Number(item.diskon || 0);

  if (item.diskon_tipe === "%") {
    subtotal -= subtotal * (diskon / 100);
  } else {
    subtotal -= diskon;
  }

  return Math.max(0, Math.round(subtotal));
}