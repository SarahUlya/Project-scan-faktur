import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../data/db";
import { deductStockFefo } from "../services/stockService";

const generateNoTransaksi = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `TRX/${y}${m}${day}/${rand}`;
};

export default function useTransaksiDb() {
  const transaksiList = useLiveQuery(
    () => db.transaksi.orderBy("tanggal").reverse().toArray(),
    [],
    []
  );

  const processTransaksi = useCallback(async (payload) => {
    const {
      cart,
      diskon,
      metode,
      uangDiterima,
      subtotal,
      diskonNominal,
      total,
      kembalian,
      kasir,
      cetakStruk,
    } = payload;

    const id = generateNoTransaksi();
    const now = new Date().toISOString();

    for (const item of cart) {
      const result = await deductStockFefo(item.produk_id, item.qty, id);
      if (!result.skipped && !result.ok && result.kurang > 0) {
        throw new Error(
          `Stok "${item.nama}" tidak mencukupi (kurang ${result.kurang} unit).`
        );
      }
    }

    await db.transaction("rw", db.transaksi, db.transaksiDetail, async () => {
      await db.transaksi.add({
        id,
        no_transaksi: id,
        tanggal: now,
        kasir: kasir || "Kasir",
        metode: metode || "TUNAI",
        subtotal,
        diskon_tipe: diskon?.tipe || "%",
        diskon_nilai: diskon?.nilai || 0,
        diskon_nominal: diskonNominal,
        total,
        uang_diterima: uangDiterima || total,
        kembalian: kembalian || 0,
        cetak_struk: cetakStruk !== false,
        status: "SELESAI",
      });

      for (const item of cart) {
        await db.transaksiDetail.add({
          transaksi_id: id,
          produk_id: item.produk_id,
          nama_produk: item.nama,
          barcode: item.barcode || "",
          qty: item.qty,
          satuan: item.satuan || "Pcs",
          harga: item.harga,
          subtotal: item.qty * item.harga,
        });
      }
    });

    return { id, no_transaksi: id, tanggal: now };
  }, []);

  const getTransaksiDetail = useCallback(async (transaksiId) => {
    const header = await db.transaksi.get(transaksiId);
    if (!header) return null;
    const items = await db.transaksiDetail
      .where("transaksi_id")
      .equals(transaksiId)
      .toArray();
    return { header, items };
  }, []);

  return {
    transaksiList: transaksiList || [],
    processTransaksi,
    getTransaksiDetail,
  };
}
