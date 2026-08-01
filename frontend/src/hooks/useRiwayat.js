import { useMemo } from "react";
import useTransaksiDb from "./useTransaksiDb";

const formatWaktu = (iso) => {
  const d = new Date(iso);

  return {
    waktu: d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    jam:
      d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
  };
};

export default function useRiwayat() {
  const { transaksiList, loading } = useTransaksiDb();

  const data = useMemo(() => {
    return (transaksiList || []).map((t, idx) => {
      const { waktu, jam } = formatWaktu(t.tanggal_transaksi);

      return {
        id: t.id_transaksi,
        no: idx + 1,
        waktu,
        jam,
        kasir: t.user?.nama ?? "-",
        total: Number(t.total),
        metode: t.metode_bayar,
        raw: t,
      };
    });
  }, [transaksiList]);

  return {
    data,
    loading,
  };
}