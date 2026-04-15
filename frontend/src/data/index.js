// Semua data dummy untuk kebutuhan dashboard dan seeding

const productNames = [
  "Paracetamol 500mg",
  "Amoxicillin Syrup 60ml",
  "Vitamin C 1000mg",
  "Betadine Solution 30ml",
  "Ibuprofen 400mg",
  "Cetirizine 10mg",
  "Metformin 500mg",
  "Simvastatin 20mg",
  "Omeprazole 20mg",
  "Losartan 50mg",
  "Salbutamol Inhaler",
  "Loperamide 2mg",
  "Dextromethorphan Syrup",
  "Vitamin D3 1000 IU",
  "Antasida Tablet",
  "Multivitamin Caplet",
  "Calcium Carbonate 500mg",
  "Tranexamic 500mg",
  "Fluconazole 150mg",
  "Chlorhexidine Mouthwash",
  "Chlorpheniramine 4mg",
  "Ketorolac 10mg",
  "Nystatin Cream",
  "Ranitidine 150mg",
  "Folic Acid 400mcg"
];

const productCategories = ["Obat", "Suplemen", "Alat Kesehatan", "Vitamin", "Herbal"];
const productUnits = ["Strip", "Botol", "Box", "Tablet", "Pcs"];

const supplierNames = [
  "Kimia Farma Trading",
  "Apotek Sehat Mandiri",
  "CV. Medika Farma",
  "PT. Sumber Obat Sehat",
  "Apotek Keluarga",
  "Toko Obat Mitra Utama",
  "PT. Sinergi Farmasi",
  "Apotek Bunga Farma",
  "CV. Duta Kesehatan",
  "Apotek Cahaya",
  "Rahayu Medical Supplies",
  "Apotek Pelita",
  "PT. Global Pharma",
  "Apotek Prima",
  "CV. Medika Jaya",
  "Apotek Bersama",
  "PT. Citra Sehat",
  "Apotek Mandiri Sehat",
  "PT. Putra Farma",
  "Apotek Harmoni",
  "CV. Nusantara Farma",
  "Apotek Satria",
  "PT. Surya Medika",
  "Apotek Amanah",
  "CV. Sehat Sentosa"
];

const supplierOwners = [
  "Budi Santoso",
  "Siti Aminah",
  "Andi Pratama",
  "Titin Susanti",
  "Hariyanto",
  "Rina Marlina",
  "Anton Wijaya",
  "Wulan Ayu",
  "Rizky Fauzan",
  "Nina Rahma",
  "Agus Santoso",
  "Fitria Lestari",
  "Dedi Kurniawan",
  "Maya Sari",
  "Yoga Pratama",
  "Retno Dewi",
  "Eko Saputra",
  "Dina Puspita",
  "Rian Setiawan",
  "Farah Nisa",
  "Iwan Hidayat",
  "Siska Nur",
  "Teguh Prasetyo",
  "Lia Kartika",
  "Yusuf Ramadhan"
];

// Produk
export const produkData = Array.from({ length: 25 }, (_, i) => {
  const idx = i + 1;
  return {
    kodeItem: `BRG${String(idx).padStart(3, "0")}`,
    namaItem: productNames[i],
    barcode: `899${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    kategori: productCategories[i % productCategories.length],
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

// Dashboard dummy
export const DUMMY_DASHBOARD = {
  revenue: 128940000,
  profit: 32235000,
  notSold: 14,
  expired: 8,
  minStock: 23,
  bestProducts: [
    { name: "Paracetamol 500mg", category: "Analgesik", sold: 1248, stock: 456, type: "Obat Bebas • Tablet" },
    { name: "Amoxicillin Syrup", category: "Antibiotik", sold: 856, stock: 12, type: "Antibiotik • Liquid" },
    { name: "Vitamin C 1000mg", category: "Suplemen", sold: 720, stock: 310, type: "Suplemen • Effervescent" },
    { name: "Betadine Solution", category: "Antiseptik", sold: 412, stock: 85, type: "Obat Luar • Topical" },
    { name: "Ibuprofen 400mg", category: "Analgesik", sold: 389, stock: 102, type: "Obat Keras • Tablet" },
  ],
};