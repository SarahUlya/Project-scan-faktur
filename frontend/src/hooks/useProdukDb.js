import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, seedDatabase } from "../data/db";
import { getKategori } from "../api/kategoriApi";

export default function useProdukDb() {
  const [loading, setLoading] = useState(true);
  const [kategori, setKategori] = useState([]);

  useEffect(() => {
    (async () => {
      await seedDatabase();

      const kategoriData = await getKategori();
      setKategori(kategoriData.data);

      setLoading(false);
    })();
  }, []);

  const produk = useLiveQuery(async () => {
    if (loading) return [];

    const allProduk = await db.produk.toArray();

    const joinedProduk = await Promise.all(allProduk.map(async (p) => {
      console.log("Raw Product from DB:", p)
      const batches = await db.batchProduk.where({ produk_id: p.id }).toArray();

      const batchesWithHistory = await Promise.all(batches.map(async (b) => {
        const history = await db.logStok.where({ batch_id: b.id }).sortBy('tanggal');
        return { ...b, history };
      }));

      return {
        ...p,
        id_kategori: p.id_kategori || p.kategori || "",
        batch: batchesWithHistory
      };
    }));

    return joinedProduk;
  }, [loading], []);

 const getNamaKategori = (id) => {
  if (!id) return "-";
  const found = kategori.find(k=> String(k.id_kategori) === String(id));
  return found ? found.nama_kategori : "-";
};

  const add = async (item) => {
    await db.produk.add(item);
  };

  const update = async (item) => {
  console.log("UPDATE ITEM:", item);
  await db.produk.put(item);
};

  const remove = async (id) => {
    await db.transaction('rw', db.produk, db.batchProduk, db.logStok, async () => {
      await db.produk.delete(id);
      await db.batchProduk.where({ produk_id: id }).delete();
      await db.logStok.where({ produk_id: id }).delete();
    });
  };


console.log("produk:", produk);
console.log("kategori:", kategori);

  return {
    produk: produk || [],
    kategori,
    getNamaKategori,
    loading,
    add,
    update,
    remove
  };
}