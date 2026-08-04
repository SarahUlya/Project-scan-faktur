import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function useProdukBatch() {
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProduk = async () => {
        setLoading(true);
        try {
            // Minta seluruh data tanpa limit dari API (sesuaikan param sesuai backend-mu)
            const res = await axiosInstance.get("/produk", {
                params: { limit: 100000 } 
            });

            // Ambil array data (bisa res.data.data atau res.data)
            const rawData = res.data.data || res.data;

            const normalized = rawData.map((p) => ({
                ...p,
                batch: (p.batchproduk || []).map((b) => ({
                    id: b.id_batch,
                    no_batch: b.no_batch,
                    kodeBatch: b.no_batch,
                    expired_date: b.expired_date,
                    qty_sisa: b.qty_sisa,
                    stok: b.qty_sisa,
                    no_faktur: b.pembelian?.no_faktur || "-",
                }))
            }));

            setProduk(normalized);
        } catch (err) {
            console.error("Gagal memuat stok batch:", err);
            setProduk([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduk();
    }, []);

    return {
        produk,
        loading,
        fetchProduk,
    };
}