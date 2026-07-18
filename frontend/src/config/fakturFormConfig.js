export const JENIS_PPN_OPTIONS = [
  { value: "belum_termasuk", label: "Harga Belum Termasuk Pajak" },
  { value: "sudah_termasuk", label: "Harga Sudah Termasuk Pajak" },
];

export const NILAI_PPN_OPTIONS = [11, 12];

export const GUDANG_OPTIONS = ["Gudang Utama", "Etalase", "Gudang Pendingin"];

export const JENIS_PEMBAYARAN_OPTIONS = ["Tunai", "Kredit", "Transfer"];

export const AKUN_KAS_OPTIONS = ["Kas Utama", "Kas Operasional", "Bank BRI", "Bank BCA"];

export const SATUAN_OPTIONS = [
  "Box",
  "Strip",
  "Tablet",
  "Botol",
  "Pcs",
  "Tube",
  "Ampul",
  "Vial",
  "Kapsul",
  "Sachet",
];

export const defaultFakturInfo = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const tanggal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const tanggalPenerimaan = `${tanggal}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return {
    supplier_id: "",
    supplier_name: "",
    no_surat_pesanan: "",
    no_faktur: "",
    tanggal,
    tanggal_penerimaan: tanggalPenerimaan,
    jenis_ppn: "belum_termasuk",
    nilai_ppn: 11,
    gudang: "Gudang Utama",
    jenis_pembayaran: "Tunai",
    akun_kas: "Kas Utama",
    jatuh_tempo: "",
    cashback: 0,
    catatan: "",
  };
};

export const emptyItem = () => ({
  id: Date.now(),
  produk_id: "",
  nama_produk: "",
  exp_date: "",
  qty: 0,
  satuan: "Pcs",
  harga_beli: 0,
  harga_jual: 0,
  diskon: 0,
  diskon_tipe: "%",
  total: 0,
});

export const hitungSubtotalItem = (item) => {
  const bruto = (item.qty || 0) * (item.harga_beli || 0);
  const diskon = item.diskon || 0;

  if (item.diskon_tipe === "%") {
    return Math.max(0, bruto - (bruto * diskon) / 100);
  }

  return Math.max(0, bruto - diskon);
};
