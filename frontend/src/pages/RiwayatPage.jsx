import { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import useRiwayat from "../hooks/useRiwayat";
import PaginationControls from "../components/ui/PaginationControls";
import DetailTransaksiModal from "../components/riwayat/DetailTransaksiModal";

const PAGE_SIZE = 25;

const RiwayatPage = () => {
  const { data } = useRiwayat();
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
      render: (row) => <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{row.kasir}</Typography>,
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
              fontWeight: 800,
              fontSize: 10,
              borderRadius: 1.5,
            }}
          />
        );
      },
    },
    {
      header: "AKSI",
      render: (row) => (
        <Button
          onClick={() => setDetailId(row.id)}
          sx={{
            backgroundColor: "#E91E63",
            color: "#fff",
            fontSize: 11,
            borderRadius: 2,
            "&:hover": { backgroundColor: "#C2185B" },
          }}
        >
          DETAIL TRANSAKSI
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: "#1E293B" }}>Riwayat Transaksi</Typography>
        <Typography sx={{ color: "#64748B", fontSize: 14 }}>
          Daftar rekaman transaksi penjualan Apotek Ampuh Tayu
        </Typography>
      </Box>

      <Card sx={{ p: 0, borderRadius: 4, overflow: "hidden" }}>
        <Table columns={columns} data={pagedData} />
        <div style={{ padding: "20px 24px", borderTop: "1px solid #F1F5F9", color: "#94A3B8", fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>Menampilkan {pagedData.length} dari {data.length} transaksi</div>
          <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </Card>

      <DetailTransaksiModal open={!!detailId} transaksiId={detailId} onClose={() => setDetailId(null)} />
    </Box>
  );
};

export default RiwayatPage;
