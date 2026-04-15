import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, seedDatabase } from "../data/db";

export default function useSupplierDb() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await seedDatabase();
      setLoading(false);
    })();
  }, []);

  const supplier = useLiveQuery(async () => {
    if (loading) return [];
    return await db.supplier.toArray();
  }, [loading], []);

  const add = async (item) => {
    await db.supplier.add(item);
  };

  const update = async (item) => {
    await db.supplier.put(item);
  };

  const remove = async (id) => {
    await db.supplier.delete(id);
  };

  return { supplier: supplier || [], loading, add, update, remove };
}
