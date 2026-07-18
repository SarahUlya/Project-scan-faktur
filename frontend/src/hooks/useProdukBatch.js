import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function useProdukBatch() {
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProduk = async () => {
        setLoading(true);

        try {
            const res = await axiosInstance.get("/produk", {
                params: {
                    page: 1,
                    limit: 5000,
                },
            });

            const normalized = res.data.data.map((p) => ({
                ...p,
                batch: (p.batchproduk || []).map((b) => ({
                    id: b.id_batch,
                    no_batch: b.no_batch,
                    kodeBatch: b.no_batch,
                    expired: b.expired_date,
                    stok: b.qty_sisa,
                    no_faktur: b.pembelian?.no_faktur || "-",
                })),
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