import { useState, useEffect, useCallback } from "react";
import {
  createTransaksi,
  getTransaksi,
  getTransaksiDetail,
  cancelTransaksiRequest,
  approveCancellation,
  rejectCancellation,
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
      const validCart = (payload.cart || []).filter(
        (item) => item.barcode !== null && item.barcode !== undefined && String(item.barcode).trim() !== ""
      );

      if (validCart.length === 0) {
        throw new Error("Tidak ada item dengan barcode valid di keranjang!");
      }

      const body = {
        metode_bayar: payload.metode,
        items: validCart.map((item) => ({
          barcode: String(item.barcode),
          qty: Number(item.qty) || 1,
        })),
      };

      console.log("PAYLOAD SANITIZED YANG DIKIRIM:", body);

      const res = await createTransaksi(body);

      await loadTransaksi();

      return res.data;
    },
    [loadTransaksi]
  );

  const requestCancellation = useCallback(async (transaksiId, userId, alasan) => {
    const user = getUser();

    if (!user) {
      throw new Error("User belum login");
    }

    if (user.role !== ROLE.KASIR && user.role !== ROLE.STAFF) {
      throw new Error("Hanya kasir atau staff yang dapat mengajukan pembatalan");
    }

    return await cancelTransaksiRequest(transaksiId, userId, alasan);
  }, []);

  const approveCancellationTransaksi = useCallback(async (transaksiId, adminId) => {
    const user = getUser();

    if (!user) {
      throw new Error("User belum login");
    }

    if (user.role !== ROLE.ADMIN) {
      throw new Error("Hanya admin yang dapat menyetujui pembatalan");
    }

    const result = await approveCancellation(transaksiId, adminId);
    await loadTransaksi();
    return result;
  }, [loadTransaksi]);

  const rejectCancellationTransaksi = useCallback(async (transaksiId, adminId) => {
    const user = getUser();

    if (!user) {
      throw new Error("User belum login");
    }

    if (user.role !== ROLE.ADMIN) {
      throw new Error("Hanya admin yang dapat menolak pembatalan");
    }

    const result = await rejectCancellation(transaksiId, adminId);
    await loadTransaksi();
    return result;
  }, [loadTransaksi]);

  return {
    transaksiList,
    loading,
    processTransaksi,
    getTransaksiDetail: loadTransaksiDetail,
    requestCancellation,
    approveCancellationTransaksi,
    rejectCancellationTransaksi,
    reloadTransaksi: loadTransaksi,
  };
}