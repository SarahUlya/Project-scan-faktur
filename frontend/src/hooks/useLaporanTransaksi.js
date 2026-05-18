import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../data/db";

export default function useLaporanTransaksi() {
  const transaksi = useLiveQuery(
    () => db.transaksi.where("status").equals("SELESAI").toArray(),
    [],
    []
  );

  const details = useLiveQuery(
    () => db.transaksiDetail.toArray(),
    [],
    []
  );

  const penjualan = useMemo(() => {
    return (transaksi || [])
      .map((t) => ({
        id: t.id,
        tanggal: t.tanggal,
        noFaktur: t.no_transaksi,
        total: t.total,
        metode: t.metode,
        status: "Sukses",
        itemTerjual: "",
      }))
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [transaksi]);

  const produkTerlaris = useMemo(() => {
    const map = {};
    (details || []).forEach((d) => {
      const key = d.produk_id;
      if (!map[key]) {
        map[key] = { produk_id: key, nama: d.nama_produk || key, terjual: 0, omzet: 0 };
      }
      map[key].terjual += d.qty;
      map[key].omzet += d.subtotal;
    });
    return Object.values(map).sort((a, b) => b.terjual - a.terjual);
  }, [details]);

  const getProdukTidakLaku = (allProduk = []) => {
    const soldIds = new Set((details || []).map((d) => String(d.produk_id)));
    return allProduk
      .filter((p) => !soldIds.has(String(p.id_produk)))
      .map((p) => ({
        id: p.id_produk,
        nama: p.nama_produk,
        kategori: p.nama_kategori || "-",
        stok: p.stok || 0,
        terakhirTerjual: "-",
      }));
  };

  const totalOmzet = useMemo(
    () => (transaksi || []).reduce((s, t) => s + (t.total || 0), 0),
    [transaksi]
  );

  return {
    penjualan,
    produkTerlaris,
    getProdukTidakLaku,
    totalOmzet,
    jumlahTransaksi: (transaksi || []).length,
  };
}
