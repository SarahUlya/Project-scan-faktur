import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../data/db";
import { deductStockFefo } from "../services/stockService";
import { getUser, ROLE } from "../auth/auth";

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

  const cancelTransaksi = useCallback(
    async (transaksiId) => {

      const user = getUser();

      if (!user) {
        throw new Error("User belum login");
      }

      if (user.role !== ROLE.ADMIN) {
        throw new Error(
          "Hanya admin yang dapat membatalkan transaksi"
        );
      }

      const transaksi = await db.transaksi.get(
        transaksiId
      );

      if (!transaksi) {
        throw new Error(
          "Transaksi tidak ditemukan"
        );
      }

      if (
        transaksi.status === "DIBATALKAN"
      ) {
        throw new Error(
          "Transaksi sudah dibatalkan"
        );
      }

      const items = await db.transaksiDetail
        .where("transaksi_id")
        .equals(transaksiId)
        .toArray();

      await db.transaction(
        "rw",
        db.transaksi,
        db.transaksiDetail,
        db.batchProduk,
        db.logStok,
        async () => {

          for (const item of items) {

            // ambil batch FEFO pertama
            const batch = await db.batchProduk
              .where("produk_id")
              .equals(
                String(item.produk_id)
              )
              .first();

            if (batch) {

              const stokBaru =
                (batch.stok || 0) +
                item.qty;

              await db.batchProduk.update(
                batch.id,
                {
                  stok: stokBaru
                }
              );

              await db.logStok.add({
                produk_id: item.produk_id,
                batch_id: batch.id,
                tanggal: new Date().toISOString(),
                tipe: "in",
                sumber: "BATAL_TRANSAKSI",
                aktivitas: `Pembatalan transaksi (${transaksiId})`,
                referensi: transaksiId,
                masuk: item.qty,
                keluar: 0,
                saldoAkhir: stokBaru
              });
            }
          }

          await db.transaksi.update(
            transaksiId,
            {
              status: "DIBATALKAN",
              dibatalkan_oleh:
                user.username,
              tanggal_batal:
                new Date().toISOString()
            }
          );
        }
      );

      return true;
    },
    []
  );

  return {
    transaksiList: transaksiList || [],
    processTransaksi,
    getTransaksiDetail,
    cancelTransaksi,
  };
}
