import { useState, useEffect, useCallback } from "react";
import {
  createTransaksi,
  getTransaksi,
  getTransaksiDetail
} from "../api/transaksiApi";
import { getUser, ROLE } from "../auth/auth";

export default function useTransaksiDb() {
  const [transaksiList, setTransaksiList] = useState([]);

  const loadTransaksi = useCallback(async () => {
    try {
      const res = await getTransaksi();

      console.log("DATA TRANSAKSI API:", res);

      setTransaksiList(res);
    } catch (err) {
      console.error("Gagal mengambil transaksi:", err);
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
      const body = {
        metode_bayar: payload.metode,
        items: payload.cart.map((item) => ({
          barcode: item.barcode,
          qty: item.qty,
        })),
      };

      const res = await createTransaksi(body);

      await loadTransaksi();

      return res.data;
    },
    [loadTransaksi]
  );

  const cancelTransaksi = useCallback(async () => {
    const user = getUser();

    if (!user) {
      throw new Error("User belum login");
    }

    if (user.role !== ROLE.ADMIN) {
      throw new Error("Hanya admin yang dapat membatalkan transaksi");
    }

    throw new Error("Fitur pembatalan transaksi belum tersedia.");
  }, []);

  return {
    transaksiList,
    processTransaksi,
    getTransaksiDetail: loadTransaksiDetail,
    cancelTransaksi,
    reloadTransaksi: loadTransaksi,
  };
}