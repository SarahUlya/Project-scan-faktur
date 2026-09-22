import { useState, useEffect, useCallback } from "react";
import {
  createTransaksi,
  getTransaksi,
  getTransaksiDetail,
  verifikasiTransaksi,
  returTransaksi,
  batalkanTransaksi,
} from "../api/transaksiApi";
import { getUser, ROLE } from "../auth/auth";

/* ══════════════════════════════════════════════════════════════════
 * HELPERS
 * ══════════════════════════════════════════════════════════════════ */
const normalizeStatus = (status) =>
  String(status || "LUNAS").toUpperCase().replace(/\s+/g, "_");

const isLunasStatus = (status) => {
  const s = normalizeStatus(status);
  return s === "LUNAS" || s === "SELESAI";
};

const filterByUserScope = (list) => {
  const user = getUser();
  if (!user || user.role === ROLE.ADMIN) return list;

  const userId = user.id ?? user.id_user;
  return (list || []).filter(
    (t) =>
      t.user_id === userId ||
      t.id_user === userId ||
      t.kasir_id === userId
  );
};

export default function useTransaksiDb() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ══════════════════════════════════════════════════════════════════
   * LOAD TRANSAKSI
   * ══════════════════════════════════════════════════════════════════ */
  const loadTransaksi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTransaksi();
      const raw = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setTransaksiList(filterByUserScope(raw));
    } catch (err) {
      console.error("Gagal mengambil transaksi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTransaksiDetail = useCallback(async (id) => {
    return await getTransaksiDetail(id);
  }, []);

  useEffect(() => {
    loadTransaksi();
  }, [loadTransaksi]);

  /* ══════════════════════════════════════════════════════════════════
   * ⚡ PROCESS TRANSAKSI — kirim metode_bayar sebagai ARRAY
   * dengan MULTIPLE ALIAS FIELD (jenis, tipe, metode, method)
   * untuk kompatibilitas berbagai versi backend
   * ══════════════════════════════════════════════════════════════════ */
  const processTransaksi = useCallback(
    async (payload) => {
      const rawItems = payload.items || payload.cart || [];
      if (rawItems.length === 0) {
        throw new Error("Keranjang belanja masih kosong!");
      }

      /* ── METODE BAYAR — kirim array + banyak alias ──────────── */
      let metodeBayarFinal;

      if (Array.isArray(payload.metode_bayar)) {
        metodeBayarFinal = payload.metode_bayar.map((m) => {
          const jenisValue = String(
            m.jenis || m.metode || m.tipe || "TUNAI"
          ).toUpperCase();
          const nominalValue = Number(m.nominal ?? m.jumlah ?? m.total) || 0;

          return {
            // ⚡ Multiple alias biar backend nemu salah satunya
            jenis: jenisValue,           // ← field utama
            tipe: jenisValue,            // ← alias 1
            metode: jenisValue,          // ← alias 2
            method: jenisValue,          // ← alias 3
            type: jenisValue,            // ← alias 4
            nominal: nominalValue,       // ← field utama
            jumlah: nominalValue,        // ← alias 1
            total: nominalValue,         // ← alias 2
            amount: nominalValue,        // ← alias 3
          };
        });
      } else if (
        typeof payload.metode_bayar === "string" &&
        payload.metode_bayar
      ) {
        // Format lama — convert ke array
        const jenis = payload.metode_bayar.toUpperCase();
        const nominal =
          Number(payload.total_bayar || payload.total) || 0;
        metodeBayarFinal = [
          {
            jenis,
            tipe: jenis,
            metode: jenis,
            method: jenis,
            type: jenis,
            nominal,
            jumlah: nominal,
            total: nominal,
            amount: nominal,
          },
        ];
      } else {
        // Fallback
        const nominal =
          Number(payload.total_bayar || payload.total) || 0;
        metodeBayarFinal = [
          {
            jenis: "TUNAI",
            tipe: "TUNAI",
            metode: "TUNAI",
            method: "TUNAI",
            type: "TUNAI",
            nominal,
            jumlah: nominal,
            total: nominal,
            amount: nominal,
          },
        ];
      }

      // Jenis utama (untuk root level field)
      const jenisUtama = metodeBayarFinal[0]?.jenis || "TUNAI";
      const nominalTotal = metodeBayarFinal.reduce(
        (sum, m) => sum + m.nominal,
        0
      );

      /* ── BUILD BODY ────────────────────────────────────────── */
      const body = {
        // ⚡ Array of objects (format baru backend)
        metode_bayar: metodeBayarFinal,

        // ⚡ Root level alias — biar backend bisa baca dari root
        // (kalau backend baca req.body.jenis bukan req.body.metode_bayar[].jenis)
        jenis: jenisUtama,
        jenis_bayar: jenisUtama,
        metode: jenisUtama,
        method: jenisUtama,
        type: jenisUtama,
        tipe: jenisUtama,

        // ⚡ Root nominal (untuk case backend baca req.body.nominal)
        nominal: nominalTotal,
        jumlah: nominalTotal,

        // ⚡ String version (format lama — fallback)
        metode_bayar_string: jenisUtama,

        // Field transaksi
        subtotal: Number(payload.subtotal) || 0,
        diskon_item_nominal: Number(payload.diskon_item_nominal) || 0,
        diskon_nota_nominal:
          Number(payload.diskon_nota_nominal || payload.diskonNominal) || 0,
        ppn_persen: Number(payload.ppn_persen || payload.ppn) || 0,
        total_bayar: Number(payload.total_bayar || payload.total) || 0,
        shift_id: payload.shift_id ?? payload.shiftId ?? null,

        // Field tambahan dari PosPaymentModal
        uang_diterima: Number(payload.uang_diterima) || 0,
        kembalian: Number(payload.kembalian) || 0,
        kasir: payload.kasir || null,
        detail_split: payload.detail_split || null,

        // ⚡ Items — DIPERBAIKI: sertakan diskon_item & diskon_tipe
        items: rawItems.map((item) => {
          const hasBarcode =
            item.barcode !== null &&
            item.barcode !== undefined &&
            String(item.barcode).trim() !== "";

          const harga = Number(item.harga) || 0;
          const qty = Number(item.qty) || 1;
          const diskonItem = Number(item.diskon_item) || 0;
          const diskonTipe = item.diskon_tipe || "Rp";
          // Hitung subtotal bersih per item: (harga - diskon_item) × qty
          const subtotalPerItem = Math.max(0, harga - diskonItem) * qty;

          return {
            id: item.id_produk || item.produk_id || item.id,
            produk_id: item.id_produk || item.produk_id || item.id,
            barcode: hasBarcode ? String(item.barcode).trim() : null,
            qty: qty,
            id_batch: item.id_batch || null,
            harga: harga,
            diskon_item: diskonItem,       // ⚡ FIX: JANGAN DIBUANG
            diskon_tipe: diskonTipe,        // ⚡ FIX: JANGAN DIBUANG
            subtotal: subtotalPerItem,      // ⚡ FIX: pakai subtotal bersih
          };
        }),
      };

      console.log("[processTransaksi] body ke backend:", body);
      console.log(
        "[processTransaksi] items (dengan diskon):",
        JSON.stringify(body.items, null, 2)
      );

      /* ── KIRIM KE BACKEND ──────────────────────────────────── */
      try {
        const res = await createTransaksi(body);
        await loadTransaksi();
        const data = res.data ?? res;

        // ⚡ Tentukan status — kalau semua transfer → MENUNGGU
        const isAllTransfer = metodeBayarFinal.every(
          (m) => m.jenis === "TRANSFER"
        );
        const status =
          data.status ||
          (isAllTransfer ? "MENUNGGU_PEMBAYARAN" : "LUNAS");

        return { ...data, status: normalizeStatus(status) };
      } catch (err) {
        console.error("Detail Error dari Backend:", err.response?.data);
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.message ||
          err.message ||
          "Gagal memproses transaksi.";
        throw new Error(msg);
      }
    },
    [loadTransaksi]
  );

  /* ══════════════════════════════════════════════════════════════════
   * VERIFIKASI — ubah status jadi LUNAS
   * ══════════════════════════════════════════════════════════════════ */
  const verifikasiLunas = useCallback(
    async (id) => {
      const res = await verifikasiTransaksi(id);
      await loadTransaksi();
      return res.data ?? res;
    },
    [loadTransaksi]
  );

  /* ══════════════════════════════════════════════════════════════════
   * RETUR — kembalikan barang
   * ══════════════════════════════════════════════════════════════════ */
  const returBarang = useCallback(
    async (id, payload = {}) => {
      const res = await returTransaksi(id, payload);
      await loadTransaksi();
      return res.data ?? res;
    },
    [loadTransaksi]
  );

  /* ══════════════════════════════════════════════════════════════════
   * BATALKAN — void transaksi
   * ══════════════════════════════════════════════════════════════════ */
  const batalkan = useCallback(
    async (id) => {
      const res = await batalkanTransaksi(id);
      await loadTransaksi();
      return res.data ?? res;
    },
    [loadTransaksi]
  );

  return {
    transaksiList,
    loading,
    processTransaksi,
    verifikasiLunas,
    returBarang,
    batalkan,
    getTransaksiDetail: loadTransaksiDetail,
    reloadTransaksi: loadTransaksi,
    isLunasStatus,
    normalizeStatus,
  };
}