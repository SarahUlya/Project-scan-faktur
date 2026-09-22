import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { APOTEK_INFO } from "../../config/apotek";

/* ══════════════════════════════════════════════════════════════════
 * WARNA — Hitam-Putih Formal
 * ══════════════════════════════════════════════════════════════════ */
const BLACK = [0, 0, 0];
const WHITE = [255, 255, 255];
const GRAY_LIGHT = [240, 240, 240];
const GRAY_LINE = [180, 180, 180];
const GRAY_TEXT = [80, 80, 80];
const GRAY_ROW = [250, 250, 250];

/* ══════════════════════════════════════════════════════════════════
 * HELPER
 * ══════════════════════════════════════════════════════════════════ */
function buildSheetRows({ title, subtitle, meta = [], summary = [], headers = [], rows = [] }) {
  const out = [];
  out.push([title]);
  if (subtitle) out.push([subtitle]);
  out.push([]);
  meta.forEach(([k, v]) => out.push([k, v]));
  if (meta.length) out.push([]);
  summary.forEach(([k, v]) => out.push([k, v]));
  if (summary.length) out.push([]);
  out.push(headers);
  rows.forEach((r) => out.push(r));
  return out;
}

/* ══════════════════════════════════════════════════════════════════
 * EXPORT EXCEL
 * ══════════════════════════════════════════════════════════════════ */
export function exportReportExcel(payload = {}, config = {}) {
  const { title = "LAPORAN", filename = "laporan", headers = [], rows = [] } = payload;
  if (!rows.length) {
    alert("Tidak ada data untuk diexport.");
    return;
  }

  const sheetRows = buildSheetRows(payload);
  const ws = XLSX.utils.aoa_to_sheet(sheetRows);
  ws["!cols"] = headers.map(() => ({ wch: 22 }));
  const lastCol = Math.max(headers.length - 1, 1);
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
  XLSX.writeFile(wb, config.filename || `${filename}.xlsx`);
}

/* ══════════════════════════════════════════════════════════════════
 * EXPORT CSV
 * ══════════════════════════════════════════════════════════════════ */
export function exportReportCsv(payload = {}, config = {}) {
  const { filename = "laporan", rows = [] } = payload;
  if (!rows.length) {
    alert("Tidak ada data untuk diexport.");
    return;
  }

  const sheetRows = buildSheetRows(payload);
  const csvContent = sheetRows
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = config.filename || `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════════════════════════
 * EXPORT / PRINT PDF — Hitam-Putih Formal
 *
 * config.previewInNewTab = true → buka di tab baru (untuk PRINT)
 * config.previewInNewTab = false → download seperti biasa (untuk EXPORT)
 * ══════════════════════════════════════════════════════════════════ */
export function exportReportPdf(payload = {}, config = {}) {
  const {
    title = "LAPORAN",
    subtitle,
    meta = [],
    summary = [],
    headers = [],
    rows = [],
    filename = "laporan",
    columnStyles = {},
  } = payload;

  if (!rows.length) {
    alert("Tidak ada data untuk diexport.");
    return;
  }

  const orientation =
    config.orientation || (headers.length > 6 ? "landscape" : "portrait");
  const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* ═══ KOP SURAT ═══ */
  doc.setTextColor(...BLACK);
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text(APOTEK_INFO?.nama || "APOTEK", pageWidth / 2, 16, { align: "center" });

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...GRAY_TEXT);

  const alamat = APOTEK_INFO?.alamat || "";
  const telp = APOTEK_INFO?.telepon ? `Telp: ${APOTEK_INFO.telepon}` : "";
  const infoLine = [alamat, telp].filter(Boolean).join(" | ");
  if (infoLine) {
    doc.text(infoLine, pageWidth / 2, 22, { align: "center" });
  }

  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.8);
  doc.line(14, 26, pageWidth - 14, 26);
  doc.setLineWidth(0.3);
  doc.line(14, 27.5, pageWidth - 14, 27.5);

  /* ═══ JUDUL ═══ */
  doc.setTextColor(...BLACK);
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text(title.toUpperCase(), pageWidth / 2, 36, { align: "center" });

  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(subtitle, pageWidth / 2, 42, { align: "center" });
  }

  /* ═══ META 2 KOLOM ═══ */
  let y = 50;
  doc.setFontSize(9);

  if (meta.length > 0) {
    meta.forEach(([k, v], i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = col === 0 ? 14 : pageWidth / 2 + 4;

      doc.setFont(undefined, "normal");
      doc.setTextColor(...GRAY_TEXT);
      doc.text(`${k}`, x, y + row * 5);

      doc.setTextColor(...BLACK);
      doc.setFont(undefined, "bold");
      doc.text(`: ${v}`, x + 32, y + row * 5);
    });
    y += Math.ceil(meta.length / 2) * 5 + 3;
  }

  /* ═══ SUMMARY KOTAK ═══ */
  if (summary.length > 0) {
    const boxHeight = 8 + Math.ceil(summary.length / 2) * 6;

    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.3);
    doc.setFillColor(...WHITE);
    doc.rect(14, y, pageWidth - 28, boxHeight, "S");

    doc.setFillColor(...GRAY_LIGHT);
    doc.rect(14, y, pageWidth - 28, 6, "FD");

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...BLACK);
    doc.text("RINGKASAN", 17, y + 4.5);

    summary.forEach(([k, v], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 17 + col * ((pageWidth - 28) / 2);

      doc.setFont(undefined, "normal");
      doc.text(`${k}`, x, y + 12 + row * 6);
      doc.setFont(undefined, "bold");
      doc.text(`: ${v}`, x + 32, y + 12 + row * 6);
    });

    y += boxHeight + 6;
  }

  /* ═══ TABEL ═══ */
  autoTable(doc, {
    startY: y,
    head: [headers],
    body: rows.map((r) =>
      r.map((c) =>
        typeof c === "number" ? c.toLocaleString("id-ID") : String(c ?? "")
      )
    ),
    theme: "grid",
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      valign: "middle",
      overflow: "linebreak",
      textColor: BLACK,
      lineColor: BLACK,
      lineWidth: 0.2,
      font: "helvetica",
    },
    headStyles: {
      fillColor: BLACK,
      textColor: WHITE,
      fontStyle: "bold",
      halign: "center",
      lineColor: BLACK,
      lineWidth: 0.2,
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: GRAY_ROW,
    },
    bodyStyles: {
      textColor: BLACK,
    },
    columnStyles,
  });

  /* ═══ FOOTER — semua halaman ═══ */
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(...GRAY_LINE);
    doc.setLineWidth(0.3);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    doc.setFontSize(8);
    doc.setTextColor(...GRAY_TEXT);
    doc.setFont(undefined, "normal");
    doc.text(
      `Dicetak otomatis oleh Sistem Manajemen ${APOTEK_INFO?.nama || "Apotek"}`,
      14,
      pageHeight - 8
    );
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - 14,
      pageHeight - 8,
      { align: "right" }
    );
  }

  /* ══════════════════════════════════════════════════════════════════
   * SAVE / PREVIEW
   * ══════════════════════════════════════════════════════════════════ */
  const finalFilename = config.filename || `${filename}.pdf`;

  if (config.previewInNewTab) {
    // ⚡ Mode CETAK: buka PDF di tab baru → user print dari PDF viewer
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, "_blank");

    if (!newTab) {
      alert(
        "Popup diblokir browser. PDF akan didownload sebagai gantinya.\n\n" +
          "Silakan izinkan popup untuk preview langsung, atau buka file PDF " +
          "yang ter-download dan print dari sana."
      );
      doc.save(finalFilename);
    } else {
      // Revoke URL setelah 60 detik biar viewer sempat load
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  } else {
    // ⚡ Mode EXPORT: langsung download file
    doc.save(finalFilename);
  }
}