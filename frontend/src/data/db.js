export const resetDatabase = async () => {
  await db.delete();
  window.location.reload();
};
import Dexie from 'dexie';
import { produkData, supplierData, fakturData } from './index';

export const db = new Dexie('ApotekSystemDB');

db.version(1).stores({
  produk: 'id, nama, kategori, status',
  supplier: 'id, nama, status',
  pembelian: 'id, no_faktur, supplier_id, tanggal',
  pembelianDetail: '++id, pembelian_id, produk_id',
  batchProduk: 'id, produk_id, pembelian_id, expired, kodeBatch',
  logStok: '++id, produk_id, batch_id, tipe, sumber, tanggal'
});

export const seedDatabase = async () => {
  const produkCount = await db.produk.count();
  const supplierCount = await db.supplier.count();

  if (produkCount >= 20 && supplierCount >= 20) {
    return; 
  }

  if (produkCount === 0 && supplierCount === 0) {
    console.log("Seeding local Dexie database...");
  } else {
    console.log("Incomplete seed detected. Resetting Dexie database to ensure minimum 20 records...");
    await db.produk.clear();
    await db.batchProduk.clear();
    await db.logStok.clear();
    await db.pembelian.clear();
    await db.pembelianDetail.clear();
    await db.supplier.clear();
  }

  const suppliersToInsert = supplierData.map(s => ({
    id: s.id,
    nama: s.nama,
    penanggungJawab: s.penanggungJawab,
    telepon: s.telepon,
    alamat: s.alamat,
    status: s.status,
    inisial: s.inisial
  }));
  await db.supplier.bulkAdd(suppliersToInsert);

  const pembelianToInsert = fakturData.map(f => ({
    id: f.id,
    no_faktur: f.id, 
    supplier_id: 'SUP-001', 
    supplier_name_raw: f.supplier, 
    supplierType: f.supplierType,
    tanggal: f.tanggal,
    total: f.total,
    status: f.status
  }));
  await db.pembelian.bulkAdd(pembelianToInsert);

  for (const p of produkData) {
    await db.produk.add({
      id: p.kodeItem,
      nama: p.namaItem,
      id_kategori: p.kategoriId,
      satuan: p.satuan,
      stokMinimum: p.stokMinimum,
      status: p.status,
      barcode: p.barcode,
      hargaJual: p.hargaJual
    });

    if (p.batch && p.batch.length > 0) {
      for (const b of p.batch) {
        await db.batchProduk.add({
          id: b.id,
          produk_id: p.kodeItem,
          pembelian_id: null,
          kodeBatch: b.kodeBatch,
          expired: b.expired,
          stok: b.stok,
          hargaBeli: b.hargaBeli
        });

        if (b.history && b.history.length > 0) {
          const logs = b.history.map(h => ({
            produk_id: p.kodeItem,
            batch_id: b.id,
            tanggal: h.tanggal,
            aktivitas: h.aktivitas,
            referensi: h.referensi,
            masuk: h.masuk,
            keluar: h.keluar,
            saldoAkhir: h.saldoAkhir,
            tipe: h.tipe,
            sumber: 'SEED'
          }));
          await db.logStok.bulkAdd(logs);
        }
      }
    }
  }

  console.log("Database seeded successfully!");
};
