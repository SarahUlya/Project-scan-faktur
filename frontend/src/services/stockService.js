import { db } from "../data/db";

export const getStokFromBatches = (batches = []) =>
  (batches || []).reduce((sum, b) => sum + (Number(b.stok) || 0), 0);

export const getStokProduk = async (produkId, apiBatches = []) => {
  const localBatches = await db.batchProduk
    .where("produk_id")
    .equals(String(produkId))
    .toArray();

  const localStok = getStokFromBatches(localBatches);
  if (localStok > 0) return localStok;

  return getStokFromBatches(apiBatches);
};

export const deductStockFefo = async (produkId, qty, referensi = "POS") => {
  const need = parseInt(qty, 10);
  if (need <= 0) return { ok: true, deducted: 0 };

  const batches = await db.batchProduk
    .where("produk_id")
    .equals(String(produkId))
    .toArray();

  const sorted = batches
    .filter((b) => (b.stok || 0) > 0)
    .sort((a, b) => new Date(a.expired || 0) - new Date(b.expired || 0));

  if (sorted.length === 0) {
    return { ok: true, deducted: 0, kurang: 0, skipped: true };
  }

  let remaining = need;
  let deducted = 0;

  for (const batch of sorted) {
    if (remaining <= 0) break;
    const available = batch.stok || 0;
    const take = Math.min(available, remaining);

    await db.batchProduk.update(batch.id, { stok: available - take });

    const saldoAkhir = available - take;
    await db.logStok.add({
      produk_id: produkId,
      batch_id: batch.id,
      tanggal: new Date().toISOString(),
      tipe: "out",
      sumber: "POS",
      aktivitas: `Penjualan POS (${referensi})`,
      referensi,
      masuk: 0,
      keluar: take,
      saldoAkhir,
    });

    remaining -= take;
    deducted += take;
  }

  return { ok: remaining === 0, deducted, kurang: remaining };
};
