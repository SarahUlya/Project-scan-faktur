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

  const itemsPerpage = 25;
  const startIndex = (page - 1) * itemsPerpage;

  useEffect(() => {
    (async () => {
      await seedDatabase();
      const kategoriData = await getKategori(1, 100);
      setKategori(kategoriData.data);
      setLoading(false);
    })();
  }, []);

  const produk = useLiveQuery(async () => {
    if (loading) return [];

    const allProduk = await db.produk.toArray();

    const joinedProduk = await Promise.all(allProduk.map(async (p) => {
      const batches = await db.batchProduk.where({ produk_id: p.id }).toArray();

      const batchesWithHistory = await Promise.all(batches.map(async (b) => {
        const history = await db.logStok.where({ batch_id: b.id }).sortBy('tanggal');
        return { ...b, history };
      }));

      const normalizedProduct = {
        ...p,
        id: p.id,
        kodeItem: p.id,
        nama: p.nama || p.namaItem || "",
        namaItem: p.nama || p.namaItem || "",
        id_kategori: p.id_kategori || p.kategoriId || p.kategori || "",
        kategoriId: p.id_kategori || p.kategoriId || p.kategori || "",
        satuan: p.satuan || "",
        stokMinimum: p.stokMinimum || 0,
        status: p.status || "NONAKTIF",
        barcode: p.barcode || "",
        hargaJual: p.hargaJual || 0,
        batch: batchesWithHistory
      };

      return normalizedProduct;
    }));

    return joinedProduk;
  }, [loading], []);

  const filteredProduk = (produk || []).filter((item) => {
    const keyword = search.toLowerCase();

    const nama = (item.nama || item.namaItem || "").toLowerCase();
    const kodeProduk = (item.kodeItem || item.id || item.kode || "").toLowerCase();

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
        const idValue = p.id || p.kodeItem || "";
        const num = parseInt(idValue.replace("BRG", ""), 10);
        return Number.isNaN(num) ? acc : Math.max(acc, num);
      }, 0);
      return `BRG${String(max + 1).padStart(3, "0")}`;
    };

    const newProduk = {
      id: item.kodeItem || generateCode(allProduk),
      nama: item.nama,
      id_kategori: item.id_kategori,
      satuan: item.satuan,
      stokMinimum: item.stokMinimum,
      status: item.status,
      barcode: item.barcode || "",
      hargaJual: item.hargaJual || 0,
    };

    await db.produk.add(newProduk);
  };

  const update = async (item) => {
    await db.produk.put({
      id: item.id || item.kodeItem,
      nama: item.nama,
      id_kategori: item.id_kategori,
      satuan: item.satuan,
      stokMinimum: item.stokMinimum,
      status: item.status,
      barcode: item.barcode || "",
      hargaJual: item.hargaJual || 0,
    });
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