import { useEffect, useState, useCallback } from "react";
import {
  getPembelian,
  getPembelianDetail as fetchPembelianDetail,
  createPembelian,
} from "../api/pembelianApi";

export default function usePembelianDb() {
  const [loading, setLoading] = useState(true);
  const [pembelian, setPembelian] = useState([]);

  useEffect(() => {
    loadPembelian();
  }, []);

  const loadPembelian = async () => {
    try {
      setLoading(true);

      const res = await getPembelian();

      const formatted = (res.data || []).map((item) => ({
        id: item.id_pembelian,
        no_faktur: item.no_faktur,
        tanggal: item.tanggal_faktur,
        total: Number(item.total || 0),
        status: item.status,
        supplier:
          item.supplier?.nama_supplier || "-",
      }));

      setPembelian(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPembelianDetail = useCallback(async (id) => {
    try {
      const res = await fetchPembelianDetail(id);

      console.log("DETAIL:", res);

      // ambil data dengan aman
      const data = res?.data || res;

      if (!data) return null;

      return {
        header: {
          no_faktur: data.no_faktur || "-",
          tanggal: data.tanggal_faktur || "",
          jatuh_tempo: data.tanggal_jatuh_tempo || "",
          total: Number(data.total || 0),
          status: data.status || "-",
          supplier_name:
            data.supplier?.nama_supplier || "-",
        },

        supplier: {
          nama:
            data.supplier?.nama_supplier || "-",
        },

        items:
          data.pembeliandetail?.map(
            (item, idx) => ({
              no: idx + 1,
              nama:
                item.produk?.nama_produk || "-",

              qty: item.qty || 0,

              satuan:
                item.produk?.satuan?.kode ||
                "-",

              harga:
                Number(
                  item.harga_beli
                ) || 0,

              subtotal:
                (item.qty || 0) *
                (Number(
                  item.harga_beli
                ) || 0),
            })
          ) || [],
      };
    } catch (error) {
      console.error(
        "Gagal ambil detail:",
        error
      );

      return null;
    }
  }, []);

  const addPembelian = async (faktur, items) => {
    try {
      const payload = {
        no_faktur: faktur.no_faktur,

        tanggal_faktur: faktur.tanggal,

        tanggal_jatuh_tempo:
          faktur.jatuh_tempo || null,

        id_supplier: Number(
          faktur.supplier_id
        ),

        id_user: 1, // sementara buat tes

        total: Number(
          faktur.total
        ),

        status:
          faktur.jenis_pembayaran ===
            "Kredit"
            ? "BELUM_LUNAS"
            : "LUNAS",

        items: items.map((item) => ({
          id_produk: Number(
            item.produk_id
          ),

          qty:
            parseInt(item.qty) || 0,

          harga_beli:
            Number(
              item.harga_satuan
            ) || 0,

          barcode: item.barcode,

          expired_date: item.exp_date,

          no_batch: item.no_batch
        })),
      };

      console.log("FAKTUR:", faktur);
      console.log("ITEMS:", JSON.stringify(items, null, 2));
      console.log("PAYLOAD:", payload);

      const res =
        await createPembelian(
          payload
        );

      await loadPembelian();

      return res.data;
    } catch (err) {
      console.error("ERROR FULL:", err);

      console.log(
        "Response:",
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );

      throw err;
    }
  };

  return {
    pembelian,
    loading,
    getPembelianDetail,
    addPembelian,
  };
}