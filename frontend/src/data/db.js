import Dexie from 'dexie';

export const resetDatabase = async () => {
  await db.delete();
  window.location.reload();
};

export const db = new Dexie('ApotekSystemDB');

db.version(1).stores({
  produk: 'id, nama, kategori, status',
  supplier: 'id, nama, status',
  pembelian: 'id, no_faktur, supplier_id, tanggal',
  pembelianDetail: '++id, pembelian_id, produk_id',
  batchProduk: 'id, produk_id, pembelian_id, expired, kodeBatch',
  logStok: '++id, produk_id, batch_id, tipe, sumber, tanggal'
});

db.version(2).stores({
  transaksi: 'id, no_transaksi, tanggal, kasir, metode',
  transaksiDetail: '++id, transaksi_id, produk_id',
});

db.version(3).stores({
  transaksi: 'id, no_transaksi, tanggal, kasir, metode, status',
  transaksiDetail: '++id, transaksi_id, produk_id',
});
