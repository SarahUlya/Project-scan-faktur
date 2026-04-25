import { supplierNames, supplierOwners } from "./index";

// Supplier
export const supplierData = Array.from({ length: 25 }, (_, i) => {
  const idx = i + 1;
  const nama = supplierNames[i];
  const penanggungJawab = supplierOwners[i];

  return {
    id: `SUP-${String(idx).padStart(3, "0")}`,
    nama,
    penanggungJawab,
    telepon: `08${Math.floor(1100000000 + Math.random() * 8900000000)}`,
    alamat: `Jl. Sehat No. ${idx}, Jakarta`,
    status: idx % 2 === 0 ? "AKTIF" : "NONAKTIF",
    inisial: nama
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 3)
      .toUpperCase()
  };
});