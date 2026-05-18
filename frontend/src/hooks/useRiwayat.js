import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../data/db";

const formatWaktu = (iso) => {
  const d = new Date(iso);
  return {
    waktu: d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    jam: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
  };
};

export default function useRiwayat() {
  const transaksi = useLiveQuery(
    () => db.transaksi.orderBy("tanggal").reverse().toArray(),
    [],
    []
  );

  const data = useMemo(
    () =>
      (transaksi || []).map((t, idx) => {
        const { waktu, jam } = formatWaktu(t.tanggal);
        return {
          id: t.id,
          no: idx + 1,
          waktu,
          jam,
          kasir: t.kasir,
          total: t.total,
          metode: t.metode,
          raw: t,
        };
      }),
    [transaksi]
  );

  return { data };
}
