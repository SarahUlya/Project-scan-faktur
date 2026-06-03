import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axiosInstance";
import { getKategori } from "../api/kategoriApi";
import { getSatuan } from "../api/satuanApi";
import {
  getStokFromBatches,
  getStokProduk
} from "../services/stockService";

export default function usePosProducts() {
  const [produk, setProduk] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [satuanList, setSatuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
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
        katResult.status === "fulfilled" &&
          Array.isArray(katResult.value?.data)
          ? katResult.value.data
          : [];

      const satuanRaw =
        satResult.status === "fulfilled"
          ? satResult.value?.data
          : [];

      const satuanData = Array.isArray(
        satuanRaw
      )
        ? satuanRaw
        : [];

      const productList =
        prodResult.status === "fulfilled"
          ? prodResult.value.data?.data || []
          : [];

      // DEBUG
      console.log(
        "TOTAL PRODUK:",
        productList.length
      );

      console.log(
        "SASALELE:",
        productList.find(
          (p) =>
            p.nama_produk === "Sasalele"
        )
      );

      console.table(
        productList.map((p) => ({
          id: p.id_produk,
          nama: p.nama_produk,
          barcode: p.barcode,
          active: p.is_active,
        }))
      );

      if (
        katResult.status !== "fulfilled" ||
        satResult.status !==
        "fulfilled" ||
        prodResult.status !==
        "fulfilled"
      ) {
        const errorMessages = [];

        if (
          katResult.status !==
          "fulfilled"
        )
          errorMessages.push(
            "kategori"
          );

        if (
          satResult.status !==
          "fulfilled"
        )
          errorMessages.push(
            "satuan"
          );

        if (
          prodResult.status !==
          "fulfilled"
        )
          errorMessages.push(
            "produk"
          );

        setError(
          `Gagal memuat data: ${errorMessages.join(
            ", "
          )}`
        );
      } else {
        setError(null);
      }

      try {
        const enriched = await Promise.all(
          productList.map(async (p) => {
            const batchData =
              p.batch ||
              p.batchproduk ||
              [];

            const stok = await getStokProduk(
              p.id_produk,
              batchData
            );

            if (p.nama_produk === "Sasalele") {
              console.log(
                "SASALELE DETAIL:",
                {
                  produk: p,
                  stok,
                  batch: batchData,
                }
              );
            }

            return {
              ...p,
              batch: batchData,
              stok,
              is_active: p.is_active !== false,
            };
          })
        );

        setProduk(enriched);
      } catch (error) {
        console.warn(
          "Gagal memperkaya produk:",
          error
        );

        setProduk(productList);
      }

      const normalizedSatuan =
        satuanData.map((s) => {
          if (
            typeof s ===
            "string"
          ) {
            return {
              id: s,
              nama: s,
            };
          }

          return {
            id:
              s.id_satuan ??
              s.id,
            nama:
              s.nama_satuan ??
              s.nama ??
              s.label ??
              "",
            raw: s,
          };
        });

      setKategori(kategoriData);
      setSatuanList(
        normalizedSatuan
      );
      setLoading(false);
    })();
  }, []);

  const getNamaKategori = (
    id
  ) => {
    const found =
      kategori.find(
        (k) =>
          String(
            k.id_kategori
          ) === String(id)
      );

    return found
      ? found.nama_kategori
      : "-";
  };

  const getNamaSatuan = (
    id
  ) => {
    const found =
      satuanList.find(
        (s) =>
          String(s.id) ===
          String(id)
      );

    return found
      ? found.nama
      : "Pcs";
  };

  const produkWithMeta =
    useMemo(
      () =>
        produk.map((p) => ({
          ...p,
          nama_satuan:
            getNamaSatuan(
              p.id_satuan
            ),

          nama_kategori:
            getNamaKategori(
              p.id_kategori
            ),

          stok:
            p.stok ??
            getStokFromBatches(
              p.batch
            ),
        })),
      [
        produk,
        kategori,
        satuanList,
      ]
    );

  return {
    produk: produkWithMeta,
    kategori,
    loading,
    error,
    getNamaKategori,
    getNamaSatuan,
  };
}