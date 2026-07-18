import React, { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { Box, Typography } from "@mui/material";
import Table from "../ui/Table";
import PaginationControls from "../ui/PaginationControls";
import StokPrintActions from "../stok/StokPrintActions";
import useStokPrint from "../../hooks/useStokPrint";
import useProdukDb from "../../hooks/useProdukDb";
import { normalizeDexieBatchRows } from "../../utils/stokPrintUtils";
import { useEffect } from "react";

const PAGE_SIZE = 25;

const computeStatus = (dateString) => {
  if (!dateString) return "AMAN";
  const now = new Date();
  const exp = new Date(dateString);
  if (isNaN(exp.getTime())) return "AMAN";
  if (exp < now) return "EXPIRED";
  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 30 ? "PERINGATAN" : "AMAN";
};

const LaporanStokExpired = forwardRef(({ onSummaryChange }, ref) => {
  const [page, setPage] = useState(1);
  const { printLaporan, exportLaporanPdf, PrintPortal } = useStokPrint();

  const { produk } = useProdukDb();

  const data = useMemo(() => {
    const rows = [];

    (produk || []).forEach((p) => {
      (p.batch || []).forEach((batch) => {
        rows.push({
          id: batch.id,
          nama: p.nama_produk,
          type: p.satuan?.kode || "-",
          batch: batch.kodeBatch || batch.no_faktur || "-",
          exp: batch.expired,
          stok: Number(batch.stok || 0),
          status: computeStatus(batch.expired),
        });
      });
    });

    return rows.sort(
      (a, b) => new Date(a.exp || 0) - new Date(b.exp || 0)
    );
  }, [produk]);

  const expiredCount = useMemo(
    () => data.filter((item) => item.status === "EXPIRED").length,
    [data]
  );

  const warningCount = useMemo(
    () => data.filter((item) => item.status === "PERINGATAN").length,
    [data]
  );

  const amanCount = useMemo(
    () => data.filter((item) => item.status === "AMAN").length,
    [data]
  );

  useEffect(() => {
    onSummaryChange?.({
      expired: expiredCount,
      warning: warningCount,
      aman: amanCount,
    });
  }, [expiredCount, warningCount, amanCount, onSummaryChange]);

  const printRows = useMemo(
    () => normalizeDexieBatchRows(data),
    [data]
  );

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    {
      header: "NAMA PRODUK",
      accessor: "nama",
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{row.nama}</Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: 12 }}>{row.type}</Typography>
        </Box>
      ),
    },
    {
      header: "KODE BATCH",
      accessor: "batch",
      render: (row) => (
        <Typography sx={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: "#D81B60" }}>
          {row.batch}
        </Typography>
      ),
    },
    {
      header: "TANGGAL KADALUARSA",
      accessor: "exp",
      render: (row) => (
        <Typography sx={{ fontSize: 13 }}>
          {row.exp
            ? new Date(row.exp).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
            : "-"}
        </Typography>
      ),
    },
    {
      header: "SISA STOK",
      accessor: "stok",
      align: "center",
      render: (row) => <Typography sx={{ fontWeight: 600 }}>{row.stok}</Typography>,
    },
    {
      header: "STATUS",
      accessor: "status",
      align: "center",
      render: (row) => {
        const styles = {
          EXPIRED: { bg: "#FEE2E2", color: "#DC2626" },
          PERINGATAN: { bg: "#FEF3C7", color: "#D97706" },
          AMAN: { bg: "#F1F5F9", color: "#64748B" },
        };
        const s = styles[row.status] || styles.AMAN;
        return (
          <span style={{ background: s.bg, color: s.color, padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700 }}>
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <Box>

      <Table columns={columns} data={pagedData} />

      <div style={{ padding: "16px 20px", borderTop: "1px solid #F1F5F9", color: "#94A3B8", fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>Menampilkan {pagedData.length} dari {data.length} item stok</div>
        <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
      </div>
      {PrintPortal}
    </Box>
  );
});

LaporanStokExpired.displayName = "LaporanStokExpired";

export default LaporanStokExpired;
