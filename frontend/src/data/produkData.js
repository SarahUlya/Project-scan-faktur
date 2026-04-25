import { productNames, productUnits } from "./index";

// Produk
export const produkData = Array.from({ length: 25 }, (_, i) => {
  const idx = i + 1;
  
  return {
    kodeItem: `BRG${String(idx).padStart(3, "0")}`,
    namaItem: productNames[i],
    barcode: `899${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    kategoriId: i + 1,
    satuan: productUnits[i % productUnits.length],
    hargaJual: 1000 * (idx + 2),
    stokMinimum: Math.floor(Math.random() * 20) + 1,
    status: idx % 2 === 0 ? "AKTIF" : "NONAKTIF",
    batch: [
      {
        id: `BATCH-${String(idx).padStart(3, "0")}`,
        kodeBatch: `BTH-2026-${String(idx).padStart(4, "0")}`,
        expired: `2027-12-${String((idx % 28) + 1).padStart(2, "0")}`,
        stok: Math.floor(Math.random() * 500) + 10,
        hargaBeli: 1000 * (idx + 1),
        history: []
      }
    ]
  };
});