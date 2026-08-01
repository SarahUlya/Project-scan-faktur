import * as XLSX from "xlsx";

export function exportStokExcel(
  data = [],
  config = {}
) {
  if (!Array.isArray(data) || data.length === 0) {
    alert("Tidak ada data untuk diexport.");
    return;
  }

  const totalProduk = data.length;

  const totalStok = data.reduce(
    (t, i) => t + Number(i.stok ?? i.qty ?? 0),
    0
  );

  const totalNilai = data.reduce(
    (t, i) =>
      t +
      (Number(i.stok ?? i.qty ?? 0) *
        Number(i.hargaBeli ?? i.harga ?? 0)),
    0
  );

  const rows = [];

  rows.push(["LAPORAN STOK BARANG"]);
  rows.push([]);

  rows.push([
    "Tanggal Cetak",
    new Date().toLocaleString("id-ID"),
  ]);

  rows.push([
    "Gudang",
    config.gudang || "Semua Gudang",
  ]);

  rows.push([
    "Filter",
    config.filter || "Semua Produk",
  ]);

  rows.push([]);

  rows.push([
    "Jumlah Produk",
    totalProduk,
  ]);

  rows.push([
    "Total Stok",
    totalStok,
  ]);

  rows.push([
    "Nilai Persediaan",
    totalNilai,
  ]);

  rows.push([]);

  rows.push([
    "No",
    "Kode Produk",
    "Nama Produk",
    "Kategori",
    "Batch",
    "Expired",
    "Satuan",
    "Lokasi",
    "Stok",
    "Minimum",
    "Harga Beli",
    "Nilai Stok",
    "Status",
  ]);

  data.forEach((item, index) => {

    const stok = Number(item.stok ?? item.qty ?? 0);

    const harga = Number(
      item.hargaBeli ??
      item.harga ??
      0
    );

    rows.push([
      index + 1,
      item.kode || item.kodeProduk || "",
      item.nama || item.namaProduk || "",
      item.kategori || "",
      item.batch || item.nomorBatch || "",
      item.expiredAt ||
        item.tanggalExpired ||
        item.expired ||
        "",
      item.satuan || "",
      item.lokasi || "",
      stok,
      item.minimum ??
        item.minimumStok ??
        0,
      harga,
      stok * harga,
      item.status || "",
    ]);

  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws["!cols"] = [
    { wch: 6 },
    { wch: 18 },
    { wch: 35 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 12 },
    { wch: 18 },
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 18 },
    { wch: 15 },
  ];

  ws["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 12 },
    },
  ];

  ws["!autofilter"] = {
    ref: "A11:M11",
  };

  ws["!freeze"] = {
    xSplit: 0,
    ySplit: 11,
  };

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Laporan Stok"
  );

  XLSX.writeFile(
    wb,
    config.filename ||
      "laporan-stok.xlsx"
  );
}