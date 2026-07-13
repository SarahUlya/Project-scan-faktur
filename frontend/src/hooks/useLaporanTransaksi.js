import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../data/db";
import {
  getLaporanPenjualan,
  getLaporanProdukTerlaris,
  getLaporanTidakLaku,
} from "../api/laporanApi";

const normalizePenjualan = (item) => ({
  id: item.id,
  tanggal: item.tanggal,
  noFaktur: item.noFaktur || item.no_faktur || item.no_transaksi || "-",
  total: Number(item.total || 0),
  metode: item.metode || "-",
  status: item.status || "Sukses",
  itemTerjual: item.itemTerjual || item.item_terjual || item.items || "-",
});

export default function useLaporanTransaksi() {
  const [penjualan, setPenjualan] = useState([]);
  const [produkTerlaris, setProdukTerlaris] = useState([]);
  const [produkTidakLaku, setProdukTidakLaku] = useState([]);
  const [totalOmzet, setTotalOmzet] = useState(0);
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);

  const transaksi = useLiveQuery(
    () => db.transaksi.where("status").equals("SELESAI").toArray(),
    [],
    []
  );

  const details = useLiveQuery(() => db.transaksiDetail.toArray(), [], []);

  useEffect(() => {
    const loadLaporan = async () => {
      try {
        const [penjualanRes, terlarisRes, tidakLakuRes] = await Promise.allSettled([
          getLaporanPenjualan({ limit: 100 }),
          getLaporanProdukTerlaris({ limit: 100 }),
          getLaporanTidakLaku({ limit: 100 }),
        ]);

        if (penjualanRes.status === "fulfilled") {
          const items = Array.isArray(penjualanRes.value?.data)
            ? penjualanRes.value.data.map(normalizePenjualan)
            : [];
          setPenjualan(items);
          setJumlahTransaksi(items.length);
          setTotalOmzet(items.reduce((sum, item) => sum + item.total, 0));
        } else if (transaksi?.length) {
          const fallback = (transaksi || [])
            .map((item) => normalizePenjualan({
              ...item,
              noFaktur: item.no_transaksi,
            }))
            .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
          setPenjualan(fallback);
          setJumlahTransaksi(fallback.length);
          setTotalOmzet(fallback.reduce((sum, item) => sum + item.total, 0));
        }

        if (terlarisRes.status === "fulfilled") {
          const items = Array.isArray(terlarisRes.value?.data) ? terlarisRes.value.data : [];
          setProdukTerlaris(items);
        } else {
          const map = {};
          (details || []).forEach((detail) => {
            const key = detail.produk_id;
            if (!map[key]) {
              map[key] = {
                produk_id: key,
                nama: detail.nama_produk || key,
                terjual: 0,
                omzet: 0,
              };
            }
            map[key].terjual += detail.qty;
            map[key].omzet += detail.subtotal;
          });
          setProdukTerlaris(Object.values(map).sort((a, b) => b.terjual - a.terjual));
        }

        if (tidakLakuRes.status === "fulfilled") {
          const items = Array.isArray(tidakLakuRes.value?.data) ? tidakLakuRes.value.data : [];
          setProdukTidakLaku(items);
        } else {
          setProdukTidakLaku([]);
        }
      } catch (error) {
        console.warn("Gagal memuat laporan dari API, memakai fallback lokal:", error);
      }
    };

    loadLaporan();
  }, [transaksi, details]);

  const getProdukTidakLaku = (allProduk = []) => {
    if (produkTidakLaku.length > 0) {
      return produkTidakLaku.map((item) => ({
        id: item.id_produk || item.id,
        nama: item.nama_produk || item.nama || "-",
        kategori: item.nama_kategori || item.kategori || "-",
        stok: item.stok || 0,
        terakhirTerjual: item.terakhir_terjual || item.terakhirTerjual || "-",
      }));
    }

    const soldIds = new Set((details || []).map((detail) => String(detail.produk_id)));
    return allProduk
      .filter((produk) => !soldIds.has(String(produk.id_produk)))
      .map((produk) => ({
        id: produk.id_produk,
        nama: produk.nama_produk,
        kategori: produk.nama_kategori || "-",
        stok: produk.stok || 0,
        terakhirTerjual: "-",
      }));
  };

  return {
    penjualan,
    produkTerlaris,
    getProdukTidakLaku,
    totalOmzet,
    jumlahTransaksi,
  };
}
