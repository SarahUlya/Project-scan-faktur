import { useState } from "react";

const useLaporan = () => {
    const [data, setData] = useState([
        {
            tanggal: "04 Januari 2024",
            noFaktur: "FKT-001",
            itemTerjual: "Vitamin C x 1",
            total: "Rp 15.000",
            metodeBayar: "Tunai",
            status: "Selesai",
        },
        {
            tanggal: "04 Februari 2024",
            noFaktur: "FKT-002",
            itemTerjual: "Paracetamol (2), Vitamin C x 1",
            total: "Rp 50.000",
            metodeBayar: "Tunai",
            status: "Selesai",
        },
        {
            tanggal: "04 Maret 2024",
            noFaktur: "FKT-003",
            itemTerjual: "Ibuprofen x 1",
            total: "Rp 25.000",
            metodeBayar: "Transfer",
            status: "Selesai",
        },
    ]);

    const columns = [
        { header: "TANGGAL", accessor: "tanggal" },
        { header: "No. FAKTUR", accessor: "noFaktur" },
        { header: "ITEM TERJUAL", accessor: "itemTerjual" },
        { header: "TOTAL", accessor: "total" },
        { header: "METODE BAYAR", accessor: "metodeBayar" },
        { header: "STATUS", accessor: "status" },
    ];

    return { data, columns };
};

export default useLaporan;