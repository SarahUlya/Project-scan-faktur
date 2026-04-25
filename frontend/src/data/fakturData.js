import { supplierNames } from "./index";

// Faktur
export const fakturData = Array.from({ length: 25 }, (_, i) => {
  const idx = i + 1;
  return {
    id: `INV/202401${String(idx).padStart(2, "0")}/${String(idx).padStart(3, "0")}`,
    supplier: supplierNames[i],
    supplierType: ["Distributor Farmasi", "PBF Nasional", "Distributor Medis", "Supplier Lokal", "Manufaktur Farmasi"][idx % 5],
    tanggal: `2024-01-${String((idx % 28) + 1).padStart(2, "0")}`,
    total: 1000000 * idx,
    status: idx % 2 === 0 ? "LUNAS" : "BELUM BAYAR"
  };
});