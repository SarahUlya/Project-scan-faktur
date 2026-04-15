import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, seedDatabase } from "../data/db";

export default function usePembelianDb() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await seedDatabase();
      setLoading(false);
    })();
  }, []);

  const pembelian = useLiveQuery(async () => {
    if (loading) return [];
    
    // Assembling relational Pembelian data
    const allPembelian = await db.pembelian.toArray();
    
    // Join with supplier to get supplier names
    const joinedPembelian = await Promise.all(allPembelian.map(async (p) => {
      const supplier = await db.supplier.get(p.supplier_id);
      return {
        ...p,
        supplier: supplier ? supplier.nama : p.supplier_name_raw,
      };
    }));

    return joinedPembelian;
  }, [loading], []);

  // Fungsi relational: Tambah Faktur -> nambah Detail, Batch, LogStok
  const addPembelian = async (fakturData, detailItems) => {
    return await db.transaction('rw', db.pembelian, db.pembelianDetail, db.batchProduk, db.logStok, db.produk, async () => {
      
      // 1. Tambah Faktur Utama
      const newFakturId = `INV/${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}/${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`;
      
      await db.pembelian.add({
        id: fakturData.no_faktur || newFakturId,
        no_faktur: fakturData.no_faktur || newFakturId,
        supplier_id: fakturData.supplier_id,
        supplier_name_raw: fakturData.supplier_name,
        tanggal: fakturData.tanggal,
        total: fakturData.total,
        status: 'BELUM BAYAR',
        supplierType: 'Baru'
      });

      // 2. Iterasi Daftar Barang
      for (const item of detailItems) {
        
        // Simpan Detail Pembelian
        const detailId = await db.pembelianDetail.add({
          pembelian_id: fakturData.no_faktur || newFakturId,
          produk_id: item.produk_id,
          qty: item.qty,
          harga_beli: item.harga_satuan,
          subtotal: item.total
        });

        // Simpan Batch Baru
        const batchIdStr = `BTH-${Date.now()}-${Math.floor(Math.random()*100)}`;
        await db.batchProduk.add({
          id: batchIdStr,
          produk_id: item.produk_id,
          pembelian_id: fakturData.no_faktur || newFakturId,
          kodeBatch: item.no_batch,
          expired: item.exp_date,
          stok: parseInt(item.qty),
          hargaBeli: item.harga_satuan
        });

        // Simpan Log Stok (MASUK)
        await db.logStok.add({
          produk_id: item.produk_id,
          batch_id: batchIdStr,
          tanggal: new Date().toISOString(),
          tipe: 'in',
          sumber: 'PEMBELIAN',
          aktivitas: `Pembelian (${fakturData.no_faktur || newFakturId})`,
          referensi: fakturData.supplier_name,
          masuk: parseInt(item.qty),
          keluar: 0,
          saldoAkhir: parseInt(item.qty) // simplifikasi untuk demo, di real db harus kalkulasi
        });
        
        // (Opsional) Update stok total di tabel master produk jika ada kolom qty total
      }
    });
  };

  return { pembelian: pembelian || [], loading, addPembelian };
}
