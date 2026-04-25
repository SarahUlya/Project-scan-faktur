import { Box, Typography, Chip, MenuItem, Select } from "@mui/material";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import useRiwayat from "../hooks/useRiwayat";

const RiwayatPage = () => {
    const { data } = useRiwayat();

    const columns = [
        { header: "NO", accessor: "no" },
        {
            header: "WAKTU TRANSAKSI",
            accessor: "waktu",
            render: (row) => (
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{row.waktu}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#9E9E9E" }}>{row.jam}</Typography>
                </Box>
            ),
        },
        {
            header: "KASIR",
            accessor: "kasir",
            render: (row) => <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{row.kasir}</Typography>
        },
        {
            header: "TOTAL PEMBAYARAN",
            accessor: "total",
            render: (row) => (
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                    <Box component="span" sx={{ color: "#9E9E9E", fontWeight: 400, mr: 0.5 }}>Rp</Box>
                    {row.total.toLocaleString("id-ID")}
                </Typography>
            ),
        },
        {
            header: "METODE BAYAR",
            accessor: "metode",
            render: (row) => {
                const isQRIS = row.metode === "QRIS";
                const isTunai = row.metode === "TUNAI";
                return (
                    <Chip
                        label={row.metode}
                        size="small"
                        sx={{
                            backgroundColor: isQRIS ? "#E3F2FD" : isTunai ? "#E8F5E9" : "#F3E5F5",
                            color: isQRIS ? "#2196F3" : isTunai ? "#4CAF50" : "#9C27B0",
                            fontWeight: 800, fontSize: 10, borderRadius: 1.5,
                        }}
                    />
                );
            },
        },
        {
            header: "AKSI",
            render: (row) => (
                <Button
                    sx={{
                        backgroundColor: "#E91E63", color: "#fff", fontSize: 11,
                        borderRadius: 2, "&:hover": { backgroundColor: "#C2185B" }
                    }}
                >
                    DETAIL TRANSAKSI
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3, width: "100%" }}>

            <Card sx={{ p: 3, borderRadius: 4 }}>
                <Table columns={columns} data={data} />
            </Card>
        </Box>
    );
};

export default RiwayatPage;