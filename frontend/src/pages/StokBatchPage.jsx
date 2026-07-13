import React, { useState, useMemo, useRef } from "react";
import BatchTable from "../components/stok/BatchTable";
import Modal from "../components/ui/Modal";
import useProdukDb from "../hooks/useProdukDb";
import useStokPrint from "../hooks/useStokPrint";
import StokPrintActions from "../components/stok/StokPrintActions";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import PaginationControls from "../components/ui/PaginationControls";
import DetailBatchModal from "../components/stok/DetailBatchModal";
import SearchIcon from "@mui/icons-material/Search";
import { colors, pageHeaderSx, statCardSx } from "../theme/designTokens";
import { flattenProdukBatches } from "../utils/stokPrintUtils";

const PAGE_SIZE = 25;

const StokBatchPage = () => {
  const [detailBatch, setDetailBatch] = useState(null);
  const { produk, loading } = useProdukDb();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { printLaporan, printKartuBatch, exportLaporanPdf, exportKartuPdf, PrintPortal } = useStokPrint();

  const filteredProduk = produk.filter((p) => {
    const hasBatch = p.batch && p.batch.length > 0;
    if (!hasBatch) return false;
    const totalStok = (p.batch || []).reduce((sum, b) => sum + (b.stok || 0), 0);
    if (totalStok === 0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = p.nama_produk || p.nama || p.namaItem || "";
      const batchMatch = (p.batch || []).some(
        (b) => (b.kodeBatch || b.no_batch || "").toLowerCase().includes(q)
      );
      return name.toLowerCase().includes(q) || p.barcode?.includes(q) || batchMatch;
    }
    return true;
  });

  const sortedProduk = [...filteredProduk].sort((a, b) => {
    const getEarliest = (list) => {
      const valid = (list || []).filter((b) => b.stok > 0);
      if (!valid.length) return Infinity;
      return Math.min(...valid.map((b) => new Date(b.expired).getTime()));
    };
    return getEarliest(a.batch) - getEarliest(b.batch);
  });

  const printRows = useMemo(() => flattenProdukBatches(sortedProduk), [sortedProduk]);

  const nearExpiredCount = filteredProduk.reduce((count, p) => {
    const near = (p.batch || [])
      .filter((b) => b.stok > 0)
      .map((b) => Math.ceil((new Date(b.expired) - new Date()) / (1000 * 60 * 60 * 24)))
      .filter((d) => d <= 30 && d > 0);
    return count + near.length;
  }, 0);

  const uniqueBatchCount = new Set(
    filteredProduk.flatMap((p) =>
      (p.batch || []).filter((b) => b.stok > 0).map((b) => b.kodeBatch || b.no_batch)
    )
  ).size;

  const totalPages = Math.ceil(sortedProduk.length / PAGE_SIZE);
  const pagedProduk = sortedProduk.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={pageHeaderSx.title}>Stok & Batch</Typography>
          <Typography sx={pageHeaderSx.subtitle}>
            Monitoring stok per batch (FEFO) — 1 faktur = 1 kode batch
          </Typography>
        </Box>
        <StokPrintActions
          printLabel="Cetak Laporan"
          pdfLabel="Export PDF"
          disabled={loading || !printRows.length}
          onPrint={() => printLaporan(printRows)}
          onExportPdf={() => exportLaporanPdf(printRows)}
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
        {[
          { label: "Produk Terdata", value: loading ? "-" : sortedProduk.length },
          { label: "Kode Batch Aktif", value: loading ? "-" : uniqueBatchCount },
          { label: "Hampir Expired", value: loading ? "-" : nearExpiredCount, warn: true },
        ].map((s) => (
          <Box key={s.label} sx={statCardSx}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", mb: 0.5 }}>
              {s.label}
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: s.warn ? colors.warning : colors.text }}>
              {s.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <TextField
        placeholder="Cari produk, barcode, atau kode batch..."
        size="small"
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
        sx={{ mb: 2, width: 360, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: colors.bgCard } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: colors.textMuted, fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Typography sx={{ textAlign: "center", py: 5, color: colors.textMuted }}>Memuat data...</Typography>
      ) : sortedProduk.length === 0 ? (
        <Box sx={{ ...statCardSx, textAlign: "center", py: 5 }}>
          <Typography sx={{ fontWeight: 600, color: colors.text, mb: 0.5 }}>Belum ada data stok</Typography>
          <Typography sx={{ fontSize: 14, color: colors.textSecondary }}>
            Stok muncul setelah penerimaan faktur pembelian.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ bgcolor: colors.bgCard, borderRadius: 2, border: `1px solid ${colors.borderLight}`, overflow: "hidden" }}>
          <BatchTable produk={pagedProduk} onShowDetail={setDetailBatch} />
          <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${colors.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 13, color: colors.textMuted }}>
              {pagedProduk.length} dari {sortedProduk.length} produk
            </Typography>
            <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
          </Box>
        </Box>
      )}

      <Modal open={!!detailBatch} onClose={() => setDetailBatch(null)} width={800}>
        <DetailBatchModal
          batch={detailBatch}
          onPrint={() => printKartuBatch(detailBatch)}
          onExportPdf={() => exportKartuPdf(detailBatch)}
        />
      </Modal>

      {PrintPortal}
    </Box>
  );
};

export default StokBatchPage;
