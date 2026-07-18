import { useEffect, useState, useCallback } from "react";
import {
  getPembelian,
  getPembelianDetail as fetchPembelianDetail,
  createPembelian,
} from "../api/pembelianApi";

export default function usePembelianDb() {
  const [loading, setLoading] = useState(true);
  const [pembelian, setPembelian] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPembelian();
  }, []);

  const loadPembelian = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getPembelian(page);

      console.log("FULL RESPONSE:", res);
      console.log("DATA:", res.data);

      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);

      console.log("TOTAL:", res.total);
      console.log("TOTAL PAGES:", res.totalPages);

      console.log(
        "JUMLAH DARI API:",
        res.data.data?.length
      );

      console.log(
        "ISI DATA:",
        res.data.data
      );

      const formatted = (res.data || []).map(
        (item) => ({
          id: item.id_pembelian,
          no_faktur: item.no_faktur,
          tanggal: item.tanggal_faktur,
          total: Number(item.total || 0),
          status: item.status,
          supplier:
            item.supplier?.nama_supplier || "-",
        })
      );

      console.log(
        "SETELAH FORMAT:",
        formatted.length
      );

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

      console.log("========== RAW RESPONSE ==========");
      console.log(res);

      console.log("========== RAW DATA ==========");
      console.log(res?.data);

      const data = res?.data || res;

      console.log("========== DATA YANG DIPAKAI ==========");
      console.log(data);

      console.log("========== PEMBELIAN DETAIL ==========");
      console.log(
        JSON.stringify(
          data?.pembeliandetail,
          null,
          2
        )
      );

      if (!data) return null;

      const result = {
        header: {
          no_faktur: data.no_faktur || "-",
          tanggal: data.tanggal_faktur || "",
          jatuh_tempo:
            data.tanggal_jatuh_tempo || "",
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
          data.pembeliandetail?.map((item, idx) => ({
            no: idx + 1,

            nama:
              item.produk?.nama_produk || "-",

            batch:
              item.no_batch || "-",

            expired_date:
              item.expired_date || "-",

            qty: item.qty || 0,

            satuan:
              item.produk?.satuan?.kode || "-",

            harga:
              Number(item.harga_beli) || 0,

            subtotal:
              (item.qty || 0) *
              (Number(item.harga_beli) || 0),
          })) || [],
      };

      console.log("========== RESULT AKHIR ==========");
      console.log(
        JSON.stringify(
          result,
          null,
          2
        )
      );

      return result;
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

        id_user: 1,

        total: Number(
          faktur.total
        ),

        status:
          faktur.jenis_pembayaran ===
            "Kredit"
            ? "BELUM_LUNAS"
            : "LUNAS",

        items: items.map((item) => ({
          id_produk: Number(item.produk_id),

          qty: parseInt(item.qty) || 0,

          harga_beli: Number(item.harga_beli) || 0,

          harga_jual: Number(item.harga_jual) || 0,

          barcode: item.barcode,

          expired_date: item.exp_date,

          no_batch: item.no_batch,
        })),
      };
      console.log(
        "FAKTUR:",
        JSON.stringify(faktur, null, 2)
      );

      console.log(
        "ITEM YANG AKAN DIKIRIM:",
        JSON.stringify(items, null, 2)
      );

      console.log(
        "PAYLOAD:",
        JSON.stringify(payload, null, 2)
      );

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

  console.log("RETURNING:", {
    total,
    totalPages,
  });

  return {
    pembelian,
    loading,
    total,
    totalPages,
    loadPembelian,
    getPembelianDetail,
    addPembelian,
  };
}