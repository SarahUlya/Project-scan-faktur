import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";
import useLaporanTransaksi from "../../hooks/useLaporanTransaksi";
import { db } from "../../data/db";

const PAGE_SIZE = 25;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatCurrency = (value) => {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return "Rp 0";
  return `Rp ${numberValue.toLocaleString("id-ID")}`;
};

const LaporanPenjualan = () => {
  const [page, setPage] = useState(1);
  const { penjualan } = useLaporanTransaksi();
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const enriched = await Promise.all(
          (penjualan || []).map(async (p) => {
            const items = p.id
              ? await db.transaksiDetail.where("transaksi_id").equals(p.id).toArray()
              : [];
            const itemTerjual = items
              .map((i) => `${i.nama_produk} (${i.qty})`)
              .join(", ");
            return {
              ...p,
              itemTerjual: itemTerjual || "-",
              metode: p.metode === "TUNAI" ? "Tunai" : p.metode || "-",
              status: p.status || "Sukses",
              total: typeof p.total === "number" ? p.total : Number(p.total) || 0,
            };
          })
        );
        setData(enriched);
      } catch (error) {
        console.warn("Gagal memuat data laporan penjualan:", error);
        setData([]);
      }
    })();
  }, [penjualan]);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    {
      header: "TANGGAL",
      accessor: "tanggal",
      render: (row) => (
        <Typography sx={{ color: '#475569', fontSize: 14 }}>
          {formatDate(row.tanggal)}
        </Typography>
      )
    },
    {
      header: "No Transaksi",
      accessor: "noFaktur",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 14 }}>{row.noFaktur || "-"}</Typography>
      )
    },
    {
      header: "ITEM TERJUAL",
      accessor: "itemTerjual",
      render: (row) => (
        <Typography sx={{ color: '#475569', fontSize: 14 }}>{row.itemTerjual || "-"}</Typography>
      )
    },
    {
      header: "TOTAL TRANSAKSI",
      accessor: "total",
      render: (row) => (
        <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: 14 }}>
          {formatCurrency(row.total)}
        </Typography>
      ),
      align: 'center'
    },
    {
      header: "METODE",
      accessor: "metode",
      render: (row) => (
        <Typography sx={{ color: '#64748B', fontSize: 14 }}>{row.metode || "-"}</Typography>
      ),
      align: 'center'
    },
    {
      header: "STATUS",
      accessor: "status",
      render: (row) => {
        const isSukses = row.status === "Sukses";
        return (
          <span style={{
            background: isSukses ? '#DCFCE7' : '#FEE2E2',
            color: isSukses ? '#16A34A' : '#EF4444',
            padding: '4px 12px',
            borderRadius: 16,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.5
          }}>
            {row.status || "Sukses"}
          </span>
        )
      },
      align: 'center'
    },
  ];

  return (
    <Box>
      <Table columns={columns} data={pagedData} />
      <div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Menampilkan {pagedData.length} dari {data.length} transaksi</div>
        <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </Box>
  );
};

export default LaporanPenjualan;
