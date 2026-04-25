import { useMemo } from "react";

const useRiwayat = () => {
    const data = useMemo(() => [
        { id: 1, no: 1, waktu: "24 Jan 2024", jam: "14:25 WIB", kasir: "Siti Aminah", total: 125500, metode: "QRIS" },
        { id: 2, no: 2, waktu: "24 Jan 2024", jam: "13:10 WIB", kasir: "Budi Santoso", total: 45000, metode: "TUNAI" },
        { id: 3, no: 3, waktu: "24 Jan 2024", jam: "11:45 WIB", kasir: "Siti Aminah", total: 320000, metode: "TRANSFER" },
        { id: 4, no: 4, waktu: "23 Jan 2024", jam: "16:30 WIB", kasir: "Budi Santoso", total: 89200, metode: "QRIS" },
        { id: 5, no: 5, waktu: "23 Jan 2024", jam: "10:15 WIB", kasir: "Siti Aminah", total: 12500, metode: "TUNAI" },
    ], []);

    return { data };
};

export default useRiwayat;