import { useEffect, useState } from "react";

import {
  getProduk,
  addProdukApi,
  updateProdukApi,
} from "../api/produkApi";

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

    return found?.nama_kategori || "-";
  };


  const getNamaSatuan = (id) => {
    const found = satuanList.find(
      (s) => String(s.id) === String(id)
    );

    return found?.nama || "-";
  };


  const normalizeSatuan = (data) => {

    const raw = Array.isArray(data)
      ? data
      : data?.data || [];


    return raw.map((s) => {

      if (typeof s === "string") {
        return {
          id: s,
          nama: s,
        };
      }


      return {
        id: s.id_satuan ?? s.id,
        nama:
          s.nama_satuan ??
          s.nama ??
          s.label ??
          "",
        raw: s,
      };

    });

  };


  const normalizeProduk = (data) => {

    return data.map((p) => ({
      ...p,

      batch: (p.batchproduk || []).map((b) => ({
        id: b.id_batch,
        no_batch: b.no_batch,
        kodeBatch: b.no_batch,
        expired: b.expired_date,
        stok: b.qty_sisa,
        no_faktur:
          b.pembelian?.no_faktur || "-",
      })),

    }));

  };


  const fetchProduk = async () => {

    setLoading(true);

    try {

      const [
        kategoriData,
        satuanData,
        produkData,
      ] = await Promise.all([

        getKategori(1, 100),

        getSatuan(),

        getProduk(
          page,
          25,
          search
        ),

      ]);


      setKategori(
        kategoriData.data || []
      );


      setSatuanList(
        normalizeSatuan(satuanData)
      );


      setTotal(
        produkData.total
      );


      setTotalPages(
        produkData.totalPages
      );


      const normalized =
        normalizeProduk(
          produkData.data || []
        );


      setProduk(normalized);


    } catch (error) {

      console.error(
        "Gagal memuat data produk:",
        error
      );

      setProduk([]);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchProduk();

  }, [page, search]);



  const addProduk = async (data) => {

    try {

      const res =
        await addProdukApi(data);


      setProduk((prev) => [
        {
          ...res.data,
          batch: []
        },
        ...prev
      ]);


      return res;


    } catch (error) {

      console.error(
        "Error tambah produk:",
        error
      );

      throw error;

    }

  };



  const updateProduk = async (id, data) => {

    try {

      await updateProdukApi(
        id,
        data
      );


      await fetchProduk();


    } catch (error) {

      console.error(
        "Error update produk:",
        error
      );

      throw error;

    }

  };



  const deleteProduk = async (id) => {

    try {

      await deleteProdukApi(id);


      setProduk((prev) =>
        prev.map((item) =>
          item.id_produk === id
            ? {
              ...item,
              is_active: false
            }
            : item
        )
      );


    } catch (error) {

      console.error(
        "Error nonaktifkan produk:",
        error
      );

      throw error;

    }

  };


  return {

    produk,
    setProduk,

    kategori,
    satuanList,

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

  };

}