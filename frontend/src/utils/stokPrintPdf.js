import jsPDF from "jspdf";
import { APOTEK_INFO } from "../config/apotek";
import {
  buildLaporanSummary,
  formatExpired,
  formatJamCetak,
  formatTanggalCetak,
} from "./stokPrintUtils";

const FONT = "courier";
const PAGE_WIDTH = 80;
const MARGIN = 4;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const CENTER_X = PAGE_WIDTH / 2;

function addCenteredText(doc, text, y, size = 9, style = "normal") {
  doc.setFont(FONT, style);
  doc.setFontSize(size);
  const lines = doc.splitTextToSize(String(text), CONTENT_WIDTH);
  lines.forEach((line) => {
    doc.text(line, CENTER_X, y, { align: "center" });
    y += size * 0.45;
  });
  return y;
}

function addDashedLine(doc, y) {
  doc.setFont(FONT, "normal");
  doc.setFontSize(8);
  doc.text("-".repeat(42), CENTER_X, y, { align: "center" });
  return y + 4;
}

function addLeftRight(doc, left, right, y, size = 9) {
  doc.setFont(FONT, "normal");
  doc.setFontSize(size);
  doc.text(left, MARGIN, y);
  doc.text(right, PAGE_WIDTH - MARGIN, y, { align: "right" });
  return y + size * 0.5;
}

function createThermalPdf(title) {
  return new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [PAGE_WIDTH, 200],
  });
}

function finalizePdf(doc, filename) {
  doc.save(filename);
}

/** PDF laporan stok lengkap — format thermal seperti struk kasir */
export function downloadLaporanStokPdf(rows, judul = "LAPORAN STOK & BATCH") {
  const summary = buildLaporanSummary(rows);
  const doc = createThermalPdf(judul);
  let y = 6;

  y = addCenteredText(doc, APOTEK_INFO.nama.toUpperCase(), y, 10, "bold");
  y = addCenteredText(doc, APOTEK_INFO.alamat, y, 7);
  y = addCenteredText(doc, `Telp: ${APOTEK_INFO.telepon}`, y, 7);
  y = addDashedLine(doc, y);

  y = addCenteredText(doc, judul, y, 9, "bold");
  y = addCenteredText(doc, `${formatTanggalCetak()} ${formatJamCetak()}`, y, 8);
  y = addDashedLine(doc, y);

  rows.forEach((row, i) => {
    if (y > 190) {
      doc.addPage([PAGE_WIDTH, 200]);
      y = 6;
    }
    y = addCenteredText(doc, `${i + 1}. ${row.namaProduk}`, y, 8, "bold");
    y = addCenteredText(doc, row.kategori, y, 7);
    y = addLeftRight(doc, "Batch:", row.kodeBatch, y, 7);
    y = addLeftRight(doc, "Expired:", formatExpired(row.expired), y, 7);
    y = addLeftRight(doc, "Stok:", `${row.stok} unit`, y, 7);
    y = addLeftRight(doc, "Status:", row.status, y, 7);
    if (row.no_faktur && row.no_faktur !== "-") {
      y = addLeftRight(doc, "Faktur:", row.no_faktur, y, 7);
    }
    y = addDashedLine(doc, y);
  });

  y = addCenteredText(doc, "RINGKASAN", y, 8, "bold");
  y = addLeftRight(doc, "Total baris:", String(summary.totalBaris), y, 7);
  y = addLeftRight(doc, "Total batch:", String(summary.totalBatch), y, 7);
  y = addLeftRight(doc, "Total stok:", `${summary.totalStok} unit`, y, 7);
  y = addLeftRight(doc, "Expired:", String(summary.expired), y, 7);
  y = addLeftRight(doc, "Peringatan:", String(summary.peringatan), y, 7);
  y = addDashedLine(doc, y);
  y = addCenteredText(doc, "Laporan stok apotek", y, 7);
  y = addCenteredText(doc, "Dicetak otomatis oleh sistem", y, 7);

  finalizePdf(doc, `laporan-stok-${Date.now()}.pdf`);
}

/** PDF kartu batch tunggal */
export function downloadKartuBatchPdf(batch) {
  const kode = batch.kodeBatch || batch.no_batch || "-";
  const doc = createThermalPdf("KARTU STOK BATCH");
  let y = 6;

  y = addCenteredText(doc, APOTEK_INFO.nama.toUpperCase(), y, 10, "bold");
  y = addCenteredText(doc, APOTEK_INFO.alamat, y, 7);
  y = addDashedLine(doc, y);

  y = addCenteredText(doc, "KARTU STOK BATCH", y, 9, "bold");
  y = addCenteredText(doc, `${formatTanggalCetak()} ${formatJamCetak()}`, y, 8);
  y = addDashedLine(doc, y);

  y = addCenteredText(doc, batch.namaProduk || "-", y, 8, "bold");
  y = addCenteredText(doc, batch.kategori || "-", y, 7);
  y = addLeftRight(doc, "Batch:", kode, y, 7);
  y = addLeftRight(doc, "Expired:", formatExpired(batch.expired), y, 7);
  y = addLeftRight(doc, "Sisa stok:", `${batch.stok || 0} unit`, y, 7);
  if (batch.no_faktur && batch.no_faktur !== "-") {
    y = addLeftRight(doc, "Faktur:", batch.no_faktur, y, 7);
  }
  y = addDashedLine(doc, y);

  y = addCenteredText(doc, "RIWAYAT PERGERAKAN", y, 8, "bold");
  (batch.history || []).forEach((log) => {
    if (y > 190) {
      doc.addPage([PAGE_WIDTH, 200]);
      y = 6;
    }
    const tgl = new Date(log.tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    y = addCenteredText(doc, tgl, y, 7, "bold");
    y = addCenteredText(doc, log.aktivitas || "-", y, 7);
    if (log.referensi) y = addCenteredText(doc, log.referensi, y, 7);
    y = addLeftRight(doc, "Masuk:", log.masuk ? `+${log.masuk}` : "-", y, 7);
    y = addLeftRight(doc, "Keluar:", log.keluar ? `-${log.keluar}` : "-", y, 7);
    y = addLeftRight(doc, "Saldo:", String(log.saldoAkhir ?? "-"), y, 7);
    y += 2;
  });

  if (!batch.history?.length) {
    y = addCenteredText(doc, "Belum ada pergerakan", y, 7);
  }

  y = addDashedLine(doc, y);
  y = addCenteredText(doc, `Sisa akhir: ${batch.stok || 0} unit`, y, 8, "bold");

  finalizePdf(doc, `kartu-batch-${kode.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`);
}

export function triggerBrowserPrint(delayMs = 400) {
  setTimeout(() => window.print(), delayMs);
}
