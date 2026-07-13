import React from "react";
import { Box, Typography } from "@mui/material";
import StokPrintActions from "./StokPrintActions";
import { colors } from "../../theme/designTokens";

const DetailBatchModal = ({ batch, onPrint, onExportPdf }) => {
  if (!batch) return null;

  const kode = batch.kodeBatch || batch.no_batch || "-";

  return (
    <Box sx={{ minWidth: 560 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16, color: colors.text, mb: 0.5 }}>
        Detail Batch
      </Typography>
      <Typography sx={{ color: colors.textSecondary, fontSize: 13, mb: 2.5 }}>
        Riwayat pergerakan stok batch
      </Typography>

      <Box sx={{ bgcolor: colors.bgMuted, borderRadius: 2, p: 2, mb: 2.5, border: `1px solid ${colors.borderLight}` }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase" }}>Produk</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{batch.namaProduk}</Typography>
            <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>{batch.kategori}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase" }}>Kode Batch</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 14, fontFamily: "monospace", color: colors.primary }}>{kode}</Typography>
            {batch.no_faktur && (
              <Typography sx={{ fontSize: 12, color: colors.textSecondary, mt: 0.5 }}>
                Faktur: {batch.no_faktur}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ overflowX: "auto", border: `1px solid ${colors.borderLight}`, borderRadius: 2, mb: 2 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: colors.bgMuted, borderBottom: `1px solid ${colors.borderLight}` }}>
              {["Tanggal", "Aktivitas", "Masuk", "Keluar", "STOK"].map((h) => (
                <th key={h} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: colors.textMuted, textAlign: h === "Masuk" || h === "Keluar" || h === "Saldo" ? "center" : "left", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(batch.history || []).map((log, idx) => (
              <tr key={idx} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                <td style={{ padding: "12px", fontSize: 13 }}>
                  {new Date(log.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "12px", fontSize: 13 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{log.aktivitas}</Typography>
                  {log.referensi && <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{log.referensi}</Typography>}
                </td>
                <td style={{ padding: "12px", textAlign: "center", color: colors.success, fontWeight: 600 }}>{log.masuk || "-"}</td>
                <td style={{ padding: "12px", textAlign: "center", color: colors.danger, fontWeight: 600 }}>{log.keluar || "-"}</td>
                <td style={{ padding: "12px", textAlign: "center", fontWeight: 700 }}>{log.saldoAkhir}</td>
              </tr>
            ))}
            {(!batch.history || batch.history.length === 0) && (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: colors.textMuted }}>Belum ada pergerakan stok.</td></tr>
            )}
          </tbody>
        </table>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
          Sisa stok: <strong style={{ color: colors.text }}>{batch.stok} unit</strong>
        </Typography>
        <StokPrintActions
          printLabel="Cetak Kartu"
          pdfLabel="PDF Kartu"
          size="small"
          variant="contained"
          onPrint={onPrint}
          onExportPdf={onExportPdf}
        />
      </Box>
    </Box>
  );
};

export default DetailBatchModal;
