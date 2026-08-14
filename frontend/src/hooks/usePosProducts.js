import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axiosInstance";
import { getKategori } from "../api/kategoriApi";
import { getSatuan } from "../api/satuanApi";
import {
  getStokFromBatches,
  getStokProduk,
} from "../services/stockService";

export default function usePosProducts() {
  const [produk, setProduk] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [satuanList, setSatuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const [katResult, satResult, prodResult] =
        await Promise.allSettled([
          getKategori(1, 100),
          getSatuan(),
          axiosInstance.get("/produk", {
            params: {
              page: 1,
              limit: 5000,
              search: "",
            },
          }),
        ]);

      const kategoriData =
        katResult.status === "fulfilled"
          ? katResult.value.data || []
          : [];

      const satuanRaw =
        satResult.status === "fulfilled"
          ? satResult.value.data || []
          : [];

      const productList =
        prodResult.status === "fulfilled"
          ? prodResult.value.data.data || []
          : [];

      if (
        katResult.status !== "fulfilled" ||
        satResult.status !== "fulfilled" ||
        prodResult.status !== "fulfilled"
      ) {
        setError("Gagal memuat data.");
      } else {
        setError(null);
      }

      const enriched = await Promise.all(
        productList.map(async (p) => {
          const batchData = p.batch || p.batchproduk || [];

          const stok = await getStokProduk(
            p.id_produk,
            batchData
          );

          return {
            ...p,
            batch: batchData,
            stok,
            is_active: p.is_active !== false,
          };
        })
      );

      setProduk(enriched);

      setKategori(kategoriData);

      setSatuanList(
        satuanRaw.map((s) => ({
          id: s.id_satuan ?? s.id,
          nama:
            s.nama_satuan ??
            s.nama ??
            "",
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const reloadProducts = () => fetchProducts();

  const getNamaKategori = (id) => {
    const found = kategori.find(
      (k) => String(k.id_kategori) === String(id)
    );

    return found ? found.nama_kategori : "-";
  };

  const getNamaSatuan = (id) => {
    const found = satuanList.find(
      (s) => String(s.id) === String(id)
    );

    return found ? found.nama : "Pcs";
  };

  const produkWithMeta = useMemo(
    () =>
      produk.map((p) => ({
        ...p,
        nama_satuan:
        p.satuan?.nama ||
        getNamaSatuan(p.satuan_id),
        nama_kategori: getNamaKategori(p.id_kategori),
        stok:
          p.stok ??
          getStokFromBatches(p.batch),
      })),
    [produk, kategori, satuanList]
  );

  return {
    produk: produkWithMeta,
    kategori,
    loading,
    error,
    getNamaKategori,
    getNamaSatuan,
    reloadProducts,
  };
}