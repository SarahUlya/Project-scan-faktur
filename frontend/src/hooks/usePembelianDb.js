import { useCallback, useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, seedDatabase } from "../data/db";

async function buildProdukRingkasan(pembelianId) {
  const details = await db.pembelianDetail
    .where("pembelian_id")
    .equals(pembelianId)
    .toArray();

  if (!details.length) {
    return { ringkasan: "-", jumlahItem: 0, sisaItem: 0 };
  }

  const lines = await Promise.all(
    details.slice(0, 2).map(async (d) => {
      const produk = d.nama_produk
        ? null
        : await db.produk.get(d.produk_id);
      const nama = d.nama_produk || produk?.nama || d.produk_id;
      const qty =
        typeof d.qty === "number" || typeof d.qty === "string"
          ? d.qty
          : d.qty?.value ?? d.qty?.amount ?? JSON.stringify(d.qty);
      const satuan =
        typeof d.satuan === "string"
          ? d.satuan
          : d.satuan?.label || d.satuan?.value || d.satuan?.name || "pcs";
      return `${qty} ${satuan} x ${nama}`;
    })
  );

  return {
    ringkasan: lines.join(", "),
    jumlahItem: details.length,
    sisaItem: Math.max(0, details.length - 2),
  };
}

export default function usePembelianDb() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await seedDatabase();
      setLoading(false);
    })();
  }, []);

  const pembelian = useLiveQuery(async () => {
    if (loading) return [];

    const allPembelian = await db.pembelian.toArray();

    const joinedPembelian = await Promise.all(
      allPembelian.map(async (p) => {
        const supplier = p.supplier_id
          ? await db.supplier.get(p.supplier_id)
          : null;
        const produkInfo = await buildProdukRingkasan(p.id);

        return {
          ...p,
          supplier: supplier ? supplier.nama : p.supplier_name_raw,
          produkRingkasan: produkInfo.ringkasan,
          jumlahItem: produkInfo.jumlahItem,
          sisaItem: produkInfo.sisaItem,
        };
      })
    );

    return joinedPembelian.sort(
      (a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0)
    );
  }, [loading], []);

  const addPembelian = async (fakturData, detailItems) => {
    const fakturId =
      fakturData.no_faktur ||
      `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}/${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

    const statusBayar =
      fakturData.jenis_pembayaran === "Tunai" ? "LUNAS" : "BELUM BAYAR";

    return await db.transaction(
      "rw",
      db.pembelian,
      db.pembelianDetail,
      db.batchProduk,
      db.logStok,
      db.produk,
      async () => {
        await db.pembelian.add({
          id: fakturId,
          no_faktur: fakturId,
          supplier_id: fakturData.supplier_id,
          supplier_name_raw: fakturData.supplier_name,
          no_surat_pesanan: fakturData.no_surat_pesanan || "",
          tanggal: fakturData.tanggal,
          tanggal_penerimaan: fakturData.tanggal_penerimaan || fakturData.tanggal,
          jenis_ppn: fakturData.jenis_ppn || "belum_termasuk",
          nilai_ppn: fakturData.nilai_ppn ?? 11,
          gudang: fakturData.gudang || "Gudang Utama",
          jenis_pembayaran: fakturData.jenis_pembayaran || "Tunai",
          akun_kas: fakturData.akun_kas || "Kas Utama",
          jatuh_tempo: fakturData.jatuh_tempo || "",
          cashback: fakturData.cashback || 0,
          catatan: fakturData.catatan || "",
          total: fakturData.total,
          status: statusBayar,
          supplierType: "Baru",
          created_at: new Date().toISOString(),
        });

        for (const item of detailItems) {
          await db.pembelianDetail.add({
            pembelian_id: fakturId,
            produk_id: item.produk_id,
            nama_produk: item.nama_produk || "",
            qty: item.qty,
            satuan: item.satuan || "Pcs",
            harga_beli: item.harga_satuan,
            diskon: item.diskon || 0,
            diskon_tipe: item.diskon_tipe || "%",
            no_batch: item.no_batch || "",
            exp_date: item.exp_date || "",
            subtotal: item.total,
          });

          const batchIdStr = `BTH-${Date.now()}-${Math.floor(Math.random() * 100)}`;
          await db.batchProduk.add({
            id: batchIdStr,
            produk_id: item.produk_id,
            pembelian_id: fakturId,
            kodeBatch: item.no_batch,
            expired: item.exp_date,
            stok: parseInt(item.qty, 10),
            hargaBeli: item.harga_satuan,
          });

          await db.logStok.add({
            produk_id: item.produk_id,
            batch_id: batchIdStr,
            tanggal: new Date().toISOString(),
            tipe: "in",
            sumber: "PEMBELIAN",
            aktivitas: `Pembelian (${fakturId})`,
            referensi: fakturData.supplier_name,
            masuk: parseInt(item.qty, 10),
            keluar: 0,
            saldoAkhir: parseInt(item.qty, 10),
          });
        }
      }
    );
  };

  const safeDecode = (value) => {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      return value;
    }
  };

  const getPembelianDetail = useCallback(async (fakturId) => {
    const decodedId = safeDecode(fakturId);
    const pembelian = await db.pembelian.get(decodedId);
    if (!pembelian) return null;

    const supplier = pembelian.supplier_id
      ? await db.supplier.get(pembelian.supplier_id)
      : null;

    const details = await db.pembelianDetail
      .where("pembelian_id")
      .equals(decodedId)
      .toArray();

    const batches = await db.batchProduk
      .where("pembelian_id")
      .equals(decodedId)
      .toArray();

    const items = await Promise.all(
      details.map(async (d, idx) => {
        const produk = await db.produk.get(d.produk_id);
        const batch = batches.find((b) => b.produk_id === d.produk_id);
        return {
          no: idx + 1,
          nama: d.nama_produk || produk?.nama || d.produk_id,
          batch: d.no_batch || batch?.kodeBatch || "-",
          ed: d.exp_date || batch?.expired || "",
          qty: d.qty,
          satuan: d.satuan || produk?.satuan || "pcs",
          harga: d.harga_beli,
          diskon: d.diskon || 0,
          diskon_tipe: d.diskon_tipe || "%",
          subtotal: d.subtotal,
        };
      })
    );

    const jatuhTempo =
      pembelian.jatuh_tempo ||
      (() => {
        const t = new Date(pembelian.tanggal);
        t.setDate(t.getDate() + 28);
        return t.toISOString().split("T")[0];
      })();

    const subtotalItems = items.reduce((acc, it) => acc + (it.subtotal || 0), 0);
    const nilaiPpn = pembelian.nilai_ppn ?? 11;
    const ppn =
      pembelian.jenis_ppn === "sudah_termasuk"
        ? Math.round(subtotalItems - subtotalItems / (1 + nilaiPpn / 100))
        : Math.round(subtotalItems * (nilaiPpn / 100));
    const total =
      pembelian.jenis_ppn === "sudah_termasuk"
        ? subtotalItems
        : subtotalItems + ppn;

    return {
      header: {
        no_faktur: pembelian.no_faktur || pembelian.id,
        no_surat_pesanan: pembelian.no_surat_pesanan,
        tanggal: pembelian.tanggal,
        tanggal_penerimaan: pembelian.tanggal_penerimaan,
        jatuh_tempo: jatuhTempo,
        jenis_ppn: pembelian.jenis_ppn,
        nilai_ppn: nilaiPpn,
        gudang: pembelian.gudang,
        jenis_pembayaran: pembelian.jenis_pembayaran,
        akun_kas: pembelian.akun_kas,
        cashback: pembelian.cashback || 0,
        catatan: pembelian.catatan,
        total: pembelian.total || total,
        subtotal: subtotalItems,
        ppn,
        status: pembelian.status,
        supplier_name: pembelian.supplier_name_raw || supplier?.nama,
      },
      supplier: supplier || {
        nama: pembelian.supplier_name_raw,
        alamat: "-",
        telepon: "-",
        penanggungJawab: "-",
      },
      items,
    };
  }, []);

  return { pembelian: pembelian || [], loading, addPembelian, getPembelianDetail };
}
