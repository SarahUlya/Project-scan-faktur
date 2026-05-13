import React from "react";
import { Box, Typography } from "@mui/material";
import useProdukDb from "../hooks/useProdukDb";
import ProductCard from "../components/kasir/ProductCard";

const KasirPage = () => {
    const {
        produk,
        search,
        setSearch,
        kategori,
        getNamaKategori,
        getNamaSatuan,
    } = useProdukDb();
    console.log(produk);


    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 2,
                mt: 3,
            }}
        >
            {produk.map((item) => (
                <ProductCard
                    key={item.id_produk}
                    item={item}
                    getNamaKategori={getNamaKategori}
                    getNamaSatuan={getNamaSatuan}
                />
            ))}
        </Box>
    );
};

export default KasirPage;