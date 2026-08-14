import { useState, useEffect, useCallback } from "react";
import {
  createTransaksi,
  getTransaksi,
  getTransaksiDetail,
} from "../api/transaksiApi";
import { getUser, ROLE } from "../auth/auth";

export default function useTransaksiDb() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransaksi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTransaksi();
      console.log("DATA TRANSAKSI API:", res);
      setTransaksiList(res);
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
      const rawCart = payload.cart || [];
      rawCart.forEach((item, index) => {
        console.log(`Item ${index}:`, item);
      });
      if (rawCart.length === 0) {
        throw new Error("Keranjang belanja masih kosong!");
      }

      const body = {
        metode_bayar: payload.metode,
        items: rawCart.map((item) => {
          const hasBarcode =
            item.barcode !== null &&
            item.barcode !== undefined &&
            String(item.barcode).trim() !== "";

          return {
            id: item.produk_id,
            produk_id: item.produk_id,
            barcode: hasBarcode ? String(item.barcode).trim() : null,
            qty: Number(item.qty) || 1,
          };
        }),
      };

      console.log("PAYLOAD FIX YANG DIKIRIM:", body);

      try {
        const res = await createTransaksi(body);
        await loadTransaksi();
        return res.data;
      } catch (err) {
        console.error("Detail Error 400 dari Backend:", err.response?.data);
        throw err;
      }
    },
    [loadTransaksi]
  );



  return {
    transaksiList,
    loading,
    processTransaksi,
    getTransaksiDetail: loadTransaksiDetail,
    reloadTransaksi: loadTransaksi,
  };
}