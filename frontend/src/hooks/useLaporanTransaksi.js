import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [produkTerlaris, setProdukTerlaris] = useState([]);
  const [produkTidakLaku, setProdukTidakLaku] = useState([]);
  const [totalOmzet, setTotalOmzet] = useState(0);
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hari, setHari] = useState(30);

  useEffect(() => {
    const loadLaporan = async () => {
      try {
        const [
          penjualanRes,
          terlarisRes,
          tidakLakuRes,
        ] = await Promise.allSettled([
          getLaporanPenjualan({ limit: 100 }),
          getLaporanProdukTerlaris({ limit: 100 }),
          getLaporanTidakLaku({
            hari,
            page: currentPage,
            limit: 10,
          }),
        ]);


        if (penjualanRes.status === "fulfilled") {
          const items = Array.isArray(penjualanRes.value?.data)
            ? penjualanRes.value.data.map(normalizePenjualan)
            : [];

          setPenjualan(items);
          setJumlahTransaksi(items.length);
          setTotalOmzet(
            items.reduce((sum, item) => sum + item.total, 0)
          );
          console.log("Penjualan:", penjualanRes.value);
        }


        if (terlarisRes.status === "fulfilled") {
          const items = Array.isArray(terlarisRes.value?.data)
            ? terlarisRes.value.data
            : [];

          console.log("Produk Terlaris:", items);

          setProdukTerlaris(items);
          console.log("Terlaris:", terlarisRes.value);
        }


        if (tidakLakuRes.status === "fulfilled") {
          const items = Array.isArray(tidakLakuRes.value?.data)
            ? tidakLakuRes.value.data
            : [];

          setProdukTidakLaku(items);
          setTotalPages(tidakLakuRes.value.totalPages ?? 1);
          setCurrentPage(tidakLakuRes.value.page ?? 1);
          console.log(tidakLakuRes.value.data.length);
          console.log(tidakLakuRes.value.data);
        }

      } catch (error) {
        console.error("Gagal memuat laporan:", error);
      }
    };


    loadLaporan().finally(() => setLoading(false));
console.log({
  hari,
  currentPage,
});
  }, [hari, currentPage]);

  const getProdukTidakLaku = () => {
    if (!Array.isArray(produkTidakLaku)) {
      return [];
    }

    return produkTidakLaku.map((item) => ({
      id: item.id_produk || item.id,
      nama: item.nama_produk || item.nama || "-",
      kategori: item.nama_kategori || item.kategori || "-",
      stok: item.stok || 0,
      terakhirTerjual:
        item.terakhir_terjual || item.terakhirTerjual || "-",
    }));

  };
  return {
    penjualan,
    produkTerlaris,
    getProdukTidakLaku,
    totalOmzet,
    jumlahTransaksi,
    loading,
    setHari,
    hari,
    totalPages,
    currentPage,
    setCurrentPage,
  };
}
