export async function exportStokCsv(
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

  const csv = [];

  csv.push(["LAPORAN STOK BARANG"]);
  csv.push([]);

  csv.push([
    "Tanggal Cetak",
    new Date().toLocaleString("id-ID"),
  ]);

  csv.push([
    "Gudang",
    config.gudang || "Semua Gudang",
  ]);

  csv.push([
    "Filter",
    config.filter || "Semua Produk",
  ]);

  csv.push([]);

  csv.push([
    "Jumlah Produk",
    totalProduk,
  ]);

  csv.push([
    "Total Stok",
    totalStok,
  ]);

  csv.push([
    "Nilai Persediaan",
    totalNilai,
  ]);

  csv.push([]);

  csv.push([
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

  data.forEach((item) => {
    const stok = Number(item.stok ?? item.qty ?? 0);
    const harga = Number(item.hargaBeli ?? item.harga ?? 0);

    csv.push([
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
      item.minimum ?? item.minimumStok ?? 0,
      harga,
      stok * harga,
      item.status || "",
    ]);
  });

  const csvContent = csv
    .map((row) =>
      row
        .map((cell) =>
          `"${String(cell ?? "").replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob(
    ["\uFEFF" + csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  if ("showSaveFilePicker" in window) {
    try {
      const handle =
        await window.showSaveFilePicker({
          suggestedName:
            config.filename ||
            "laporan-stok.csv",
          types: [
            {
              description: "CSV File",
              accept: {
                "text/csv": [".csv"],
              },
            },
          ],
        });

      const writable =
        await handle.createWritable();

      await writable.write(blob);

      await writable.close();

      return;

    } catch (err) {

      if (err.name === "AbortError") return;

      console.error(err);

    }
  }

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download =
    config.filename || "laporan-stok.csv";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}