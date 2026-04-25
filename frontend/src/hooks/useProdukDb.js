import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, seedDatabase } from "../data/db";
import { getKategori } from "../api/kategoriApi";
import { produkData } from "../data/produkData";

export default function useProdukDb() {
  const [loading, setLoading] = useState(true);
  const [kategori, setKategori] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const getNamaKategori = (id) => {
    const found = kategori.find((k) => String(k.id_kategori) === String(id));
    return found ? found.nama_kategori : "-";
  };

  const itemsPerpage = 10;
  const startIndex = (page - 1) * itemsPerpage;

  useEffect(() => {
    (async () => {
      await seedDatabase();
      console.log("TOKEN:", localStorage.getItem("token"));
      const kategoriData = await getKategori(1, 100);
      console.log("KATEGORI DATA:", kategoriData);
      setKategori(kategoriData.data);

      setLoading(false);
    })();
  }, [page]);

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

  const filteredProduk = (produk || []).filter((item) => {
    const keyword = search.toLowerCase();

    const nama = (item.nama || item.namaItem || "").toLowerCase();
    const kodeProduk = (item.kodeItem || item.kode || "").toLowerCase();

    return (
      nama.includes(keyword) ||
      kodeProduk.includes(keyword)
    );
  });

  const pagedProduk = filteredProduk.slice(
    startIndex,
    startIndex + itemsPerpage
  );

  const add = async (item) => {
    const allProduk = await db.produk.toArray();

    const generateCode = (data) => {
      const max = data.reduce((acc, p) => {
        if (!p.kodeItem) return acc;
        const num = parseInt(p.kodeItem.replace("BRG", ""), 10);
        return num > acc ? num : acc;
      }, 0);
      return `BRG${String(max + 1).padStart(3, "0")}`;
    };

    const newProduk = {
      kodeItem: generateCode(allProduk),
      namaItem: item.nama,
      kategoriId: item.id_kategori,
      satuan: item.satuan,
      stokMinimum: item.stokMinimum,
      status: item.status,
      barcode: item.barcode || "",
      hargaJual: item.hargaJual || 0,
    };
    console.log("DATA MASUK:", newProduk);
    await db.produk.add(newProduk);
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
    produk: filteredProduk,
    kategori,
    getNamaKategori,
    page,
    setPage,
    search,
    setSearch,
    pagedProduk,
    loading,
    add,
    update,
    remove
  };
}