import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, seedDatabase } from "../data/db";

export default function useProdukDb() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await seedDatabase();
      setLoading(false);
    })();
  }, []);

  // Fetch from Dexie using live query, assembling the relational object
  const produk = useLiveQuery(async () => {
    if (loading) return [];
    
    const allProduk = await db.produk.toArray();
    
    // Manual join to fetch batches and history for each product
    const joinedProduk = await Promise.all(allProduk.map(async (p) => {
      const batches = await db.batchProduk.where({ produk_id: p.id }).toArray();
      
      const batchesWithHistory = await Promise.all(batches.map(async (b) => {
        const history = await db.logStok.where({ batch_id: b.id }).sortBy('tanggal');
        return { ...b, history };
      }));

      return {
        ...p,
        batch: batchesWithHistory
      };
    }));

    return joinedProduk;
  }, [loading], []); // empty array as default value

  const add = async (item) => {
    await db.produk.add(item);
  };

  const update = async (item) => {
    await db.produk.put(item);
  };

  const remove = async (id) => {
    await db.transaction('rw', db.produk, db.batchProduk, db.logStok, async () => {
      await db.produk.delete(id);
      await db.batchProduk.where({ produk_id: id }).delete();
      await db.logStok.where({ produk_id: id }).delete();
    });
  };

  return { produk: produk || [], loading, add, update, remove };
}