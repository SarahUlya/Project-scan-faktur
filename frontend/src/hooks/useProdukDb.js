import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { getKategori } from "../api/kategoriApi";
import { getSatuan } from "../api/satuanApi";

export default function useProdukDb() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategori, setKategori] = useState([]);
  const [satuanList, setSatuanList] = useState([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

    return found ? found.nama : "-";
  };

  const fetchProduk = async () => {
    setLoading(true);

    try {
      const kategoriData = await getKategori(1, 100);
      setKategori(kategoriData.data);

      const satuanData = await getSatuan();
      const satuanRaw = Array.isArray(satuanData)
        ? satuanData
        : satuanData?.data || [];
      const normalizedSatuan = satuanRaw.map((s) => {
        if (typeof s === "string") {
          return { id: s, nama: s };
        }
        return {
          id: s.id_satuan ?? s.id,
          nama: s.nama_satuan ?? s.nama ?? s.label ?? "",
          raw: s,
        };
      });
      setSatuanList(normalizedSatuan);

      const res = await axiosInstance.get("/produk", {
        params: {
          page,
          limit: 25,
          search,
        },
      });

      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setProduk(res.data.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduk();
  }, [page, search]);

  const addProduk = async (data) => {
    try {
      const res = await axiosInstance.post("/produk", data);

      setProduk((prev) => [res.data.data, ...prev]);

      return res.data;
    } catch (error) {
      console.error("Error tambah produk:", error);
      throw error;
    }
  };

  const updateProduk = async (id, data) => {
    try {
      await axiosInstance.put(`/produk/${id}`, data);

      await fetchProduk();

    } catch (error) {
      console.error("Error update produk:", error);
      throw error;
    }
  };

  const deleteProduk = async (id) => {
    try {
      await axiosInstance.delete(`/produk/${id}`);

      setProduk((prev) =>
        prev.map((item) =>
          item.id_produk === id
            ? { ...item, is_active: false }
            : item
        )
      );

    } catch (error) {
      console.error("Error nonaktifkan produk:", error);
      throw error;
    }
  };

  return {
    produk,
    setProduk,
    kategori,
    getNamaKategori,
    getNamaSatuan,
    page,
    setPage,
    search,
    setSearch,
    loading,
    total,
    totalPages,
    addProduk,
    updateProduk,
    deleteProduk,
    fetchProduk,
    satuanList
  };
}