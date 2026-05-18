export const hitungSubtotalKeranjang = (cart = []) =>
  cart.reduce((acc, item) => acc + (item.qty || 0) * (item.harga || 0), 0);

export const hitungNominalDiskon = (subtotal, diskon = { tipe: "%", nilai: 0 }) => {
  const nilai = Number(diskon.nilai) || 0;
  if (nilai <= 0) return 0;
  if (diskon.tipe === "Rp") return Math.min(subtotal, nilai);
  return Math.round((subtotal * nilai) / 100);
};

export const hitungTotalBayar = (subtotal, diskon) => {
  const potongan = hitungNominalDiskon(subtotal, diskon);
  return Math.max(0, subtotal - potongan);
};

export const hitungKembalian = (uangDiterima, totalBayar) =>
  Math.max(0, (Number(uangDiterima) || 0) - totalBayar);

export const formatRupiahPos = (n) =>
  (n || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });
