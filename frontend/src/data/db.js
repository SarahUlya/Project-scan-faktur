// Fungsi reset database Dexie (untuk pengembangan/testing)
export const resetDatabase = async () => {
  await db.delete();
  window.location.reload();
};
import Dexie from 'dexie';
import { produkData, supplierData, fakturData } from './index';

export const db = new Dexie('ApotekSystemDB');

// Mendefinisikan tabel lokal yang menyerupai skema Prisma
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

  // Jika sudah ada data minimal di kedua tabel (dari seed atau CRUD), jangan reset lagi
  if (produkCount >= 20 && supplierCount >= 20) {
    return; // Data sudah ada dan cukup
  }

  // Jika kedua tabel kosong, lakukan seeding awal
  if (produkCount === 0 && supplierCount === 0) {
    console.log("Seeding local Dexie database...");
  } else {
    // Jika salah satu ada tapi kurang dari 20, clear dan reseed
    console.log("Incomplete seed detected. Resetting Dexie database to ensure minimum 20 records...");
    await db.produk.clear();
    await db.batchProduk.clear();
    await db.logStok.clear();
    await db.pembelian.clear();
    await db.pembelianDetail.clear();
    await db.supplier.clear();
  }

  // 1. Seed Supplier
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

  // 2. Seed Pembelian
  const pembelianToInsert = fakturData.map(f => ({
    id: f.id,
    no_faktur: f.id, // using id as no_faktur in mock
    supplier_id: 'SUP-001', // mock mapping since raw data just uses string names
    supplier_name_raw: f.supplier, 
    supplierType: f.supplierType,
    tanggal: f.tanggal,
    total: f.total,
    status: f.status
  }));
  await db.pembelian.bulkAdd(pembelianToInsert);

  // 3. Seed Produk, Batch, and LogStok
  for (const p of produkData) {
    // Tambah master produk
    await db.produk.add({
      id: p.kodeItem,
      nama: p.namaItem,
      kategori: p.kategori,
      satuan: p.satuan,
      stokMinimum: p.stokMinimum,
      status: p.status,
      barcode: p.barcode,
      hargaJual: p.hargaJual
    });

    if (p.batch && p.batch.length > 0) {
      for (const b of p.batch) {
        // Tambah batch
        await db.batchProduk.add({
          id: b.id,
          produk_id: p.kodeItem,
          pembelian_id: null,
          kodeBatch: b.kodeBatch,
          expired: b.expired,
          stok: b.stok,
          hargaBeli: b.hargaBeli
        });

        // Tambah history (LogStok)
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
