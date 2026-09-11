import { useState, useEffect, useCallback } from "react";
import {
  createTransaksi,
  getTransaksi,
  getTransaksiDetail,
  verifikasiTransaksi,
  returTransaksi,
  batalkanTransaksi,
} from "../api/transaksiApi";
import { getUser, ROLE } from "../auth/auth";

const normalizeStatus = (status) =>
  String(status || "LUNAS").toUpperCase().replace(/\s+/g, "_");

const isLunasStatus = (status) => {
  const s = normalizeStatus(status);
  return s === "LUNAS" || s === "SELESAI";
};

const filterByUserScope = (list) => {
  const user = getUser();
  if (!user || user.role === ROLE.ADMIN) return list;

  const userId = user.id ?? user.id_user;
  return (list || []).filter(
    (t) =>
      t.user_id === userId ||
      t.id_user === userId ||
      t.kasir_id === userId
  );
};

export default function useTransaksiDb() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransaksi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTransaksi();
      const raw = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setTransaksiList(filterByUserScope(raw));
    } catch (err) {
      console.error("Gagal mengambil transaksi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTransaksiDetail = useCallback(async (id) => {
    return await getTransaksiDetail(id);
  }, []);

  useEffect(() => {
    loadTransaksi();
  }, [loadTransaksi]);

  const processTransaksi = useCallback(
    async (payload) => {
      // Mendukung 'items' (format baru) atau 'cart' (format lama)
      const rawItems = payload.items || payload.cart || [];
      if (rawItems.length === 0) {
        throw new Error("Keranjang belanja masih kosong!");
      }

      // Memastikan metode pembayaran terbaca
      const metode = String(payload.metode_bayar || payload.metode || "TUNAI").toUpperCase();

      // 🟢 MAPPING PAYLOAD UNTUK BACKEND
      const body = {
        metode_bayar: metode,
        subtotal: Number(payload.subtotal) || 0,
        diskon_item_nominal: Number(payload.diskon_item_nominal) || 0,
        diskon_nota_nominal: Number(payload.diskon_nota_nominal || payload.diskonNominal) || 0,
        ppn_persen: Number(payload.ppn_persen || payload.ppn) || 0,
        total_bayar: Number(payload.total_bayar || payload.total) || 0, // ✔️ Memperbaiki total_bayar 0
        shift_id: payload.shift_id ?? payload.shiftId ?? null,
        
        items: rawItems.map((item) => {
          const hasBarcode = item.barcode !== null && item.barcode !== undefined && String(item.barcode).trim() !== "";
          return {
            id: item.id_produk || item.produk_id || item.id,
            produk_id: item.id_produk || item.produk_id || item.id,
            barcode: hasBarcode ? String(item.barcode).trim() : null, // ✔️ Barcode kini terkirim
            qty: Number(item.qty) || 1,
            id_batch: item.id_batch || null, // 🟢 PENTING: Mengirim ID Batch untuk sistem FEFO
            harga: Number(item.harga) || 0,
            subtotal: Number(item.subtotal) || 0
          };
        }),
      };

      try {
        const res = await createTransaksi(body);
        await loadTransaksi();
        const data = res.data ?? res;
        const status = data.status || (metode === "TRANSFER" ? "MENUNGGU_PEMBAYARAN" : "LUNAS");
        
        return { ...data, status: normalizeStatus(status) };
      } catch (err) {
        console.error("Detail Error dari Backend:", err.response?.data);
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Gagal memproses transaksi.";
        throw new Error(msg);
      }
    },
    [loadTransaksi]
  );

  const verifikasiLunas = useCallback(
    async (id) => {
      const res = await verifikasiTransaksi(id);
      await loadTransaksi();
      return res.data ?? res;
    },
    [loadTransaksi]
  );

  const returBarang = useCallback(
    async (id, payload = {}) => {
      const res = await returTransaksi(id, payload);
      await loadTransaksi();
      return res.data ?? res;
    },
    [loadTransaksi]
  );

  const batalkan = useCallback(
    async (id) => {
      const res = await batalkanTransaksi(id);
      await loadTransaksi();
      return res.data ?? res;
    },
    [loadTransaksi]
  );

  return {
    transaksiList,
    loading,
    processTransaksi,
    verifikasiLunas,
    returBarang,
    batalkan,
    getTransaksiDetail: loadTransaksiDetail,
    reloadTransaksi: loadTransaksi,
    isLunasStatus,
    normalizeStatus,
  };
}