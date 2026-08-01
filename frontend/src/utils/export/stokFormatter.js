export function formatStok(data = []) {
  return data.map((item, index) => {
    const stok = Number(item.stok ?? item.qty ?? 0);

    const minimum = Number(
      item.stok_minimum ??
      item.minimum ??
      item.minimumStok ??
      0
    );

    const hargaBeli = Number(
      item.harga_beli ??
      item.hargaBeli ??
      item.harga ??
      0
    );

    const nilaiStok = stok * hargaBeli;

    const expired =
      item.expiredAt ??
      item.tanggalExpired ??
      item.expired ??
      "-";

    let status = "Aman";

    if (stok <= 0) {
      status = "Habis";
    } else if (stok <= minimum) {
      status = "Minimum";
    }

    if (expired !== "-") {
      const today = new Date();
      const expDate = new Date(expired);

      if (!Number.isNaN(expDate.getTime())) {
        if (expDate < today) {
          status = "Expired";
        }
      }
    }

    return {
      no: index + 1,

      kode:
        item.kode ??
        item.kode_produk ??
        item.kodeProduk ??
        "-",

      nama:
        item.nama ??
        item.nama_produk ??
        item.namaProduk ??
        "-",

      kategori:
        item.kategori ??
        item.nama_kategori ??
        "-",

      batch:
        item.batch ??
        item.nomorBatch ??
        "-",

      expired,

      satuan:
        item.satuan ??
        item.nama_satuan ??
        "-",

      lokasi:
        item.lokasi ??
        item.nama_gudang ??
        "-",

      stok,

      minimum,

      hargaBeli,

      nilaiStok,

      status,
    };
  });
}