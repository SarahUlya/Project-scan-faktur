import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { APOTEK_INFO } from "../../config/apotek";
import { formatStok } from "./stokFormatter";

/**
 * Export PDF Laporan Stok
 */
export function exportStokPdf(data = [], config = {}) {
  const rows = formatStok(data);

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* ==========================================================
      HEADER
  ========================================================== */

  doc.setFillColor(216, 27, 96);
  doc.rect(0, 0, pageWidth, 24, "F");

  doc.setTextColor(255);
  doc.setFontSize(19);
  doc.setFont(undefined, "bold");
  doc.text("LAPORAN STOK BARANG", 14, 14);

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  doc.text(
    APOTEK_INFO?.nama || "Sistem Informasi Apotek",
    pageWidth - 14,
    10,
    { align: "right" }
  );

  doc.text(
    APOTEK_INFO?.alamat || "",
    pageWidth - 14,
    16,
    { align: "right" }
  );

  /* ==========================================================
      INFORMASI FILTER
  ========================================================== */

  doc.setTextColor(70);

  doc.setFontSize(10);

  doc.text(
    `Tanggal Cetak : ${new Date().toLocaleString("id-ID")}`,
    14,
    32
  );

  doc.text(
    `Gudang : ${config.gudang || "Semua Gudang"}`,
    14,
    38
  );

  doc.text(
    `Filter : ${config.filter || "Semua Produk"}`,
    110,
    32
  );

  doc.text(
    `Petugas : ${config.user || "-"}`,
    110,
    38
  );

  /* ==========================================================
      STATISTIK
  ========================================================== */

  const totalProduk = rows.length;

  const totalStok = rows.reduce(
    (t, r) => t + Number(r.stok || 0),
    0
  );

  const totalNilai = rows.reduce(
    (t, r) => t + Number(r.nilaiStok || 0),
    0
  );

  const aman = rows.filter(
    r => String(r.status).toLowerCase() === "aman"
  ).length;

  const minimum = rows.filter(
    r => String(r.status).toLowerCase() === "minimum"
  ).length;

  const habis = rows.filter(
    r => String(r.status).toLowerCase() === "habis"
  ).length;

  const expired = rows.filter(
    r => String(r.status).toLowerCase() === "expired"
  ).length;

  /* ==========================================================
      BOX RINGKASAN
  ========================================================== */

  doc.setDrawColor(210);
  doc.setFillColor(248, 250, 252);

  doc.roundedRect(
    14,
    44,
    pageWidth - 28,
    24,
    2,
    2,
    "FD"
  );

  doc.setFontSize(10);
  doc.setFont(undefined, "bold");

  doc.text(
    `Total Produk : ${totalProduk}`,
    18,
    52
  );

  doc.text(
    `Total Stok : ${totalStok.toLocaleString("id-ID")}`,
    18,
    60
  );

  doc.text(
    `Nilai Persediaan : Rp ${Number(totalNilai).toLocaleString("id-ID")}`,
    90,
    52
  );

  doc.setTextColor(22,163,74);

  doc.text(
    `Aman : ${aman}`,
    205,
    52
  );

  doc.setTextColor(245,158,11);

  doc.text(
    `Minimum : ${minimum}`,
    205,
    60
  );

  doc.setTextColor(220,38,38);

  doc.text(
    `Habis : ${habis}`,
    245,
    52
  );

  doc.setTextColor(185,28,28);

  doc.text(
    `Expired : ${expired}`,
    245,
    60
  );

  doc.setTextColor(60);

  /* ==========================================================
      TABEL
      (lanjut di Bagian 2)
  ========================================================== */

  autoTable(doc,{
        startY: 74,

    head: [[
      "No",
      "Kode",
      "Nama Produk",
      "Kategori",
      "Batch",
      "Expired",
      "Satuan",
      "Lokasi",
      "Stok",
      "Min",
      "Nilai",
      "Status",
    ]],

    body: rows.map((item) => [
      item.no,
      item.kode,
      item.nama,
      item.kategori,
      item.batch,
      item.expired,
      item.satuan,
      item.lokasi,
      Number(item.stok || 0).toLocaleString("id-ID"),
      Number(item.minimum || 0).toLocaleString("id-ID"),
      "Rp " + Number(item.nilaiStok || 0).toLocaleString("id-ID"),
      item.status,
    ]),

    theme: "grid",

    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: "middle",
      overflow: "linebreak",
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },

    headStyles: {
      fillColor: [216, 27, 96],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    bodyStyles: {
      textColor: [50, 50, 50],
    },

    columnStyles: {
      0: {
        cellWidth: 10,
        halign: "center",
      },
      1: {
        cellWidth: 25,
      },
      2: {
        cellWidth: 60,
      },
      3: {
        cellWidth: 28,
      },
      4: {
        cellWidth: 22,
        halign: "center",
      },
      5: {
        cellWidth: 22,
        halign: "center",
      },
      6: {
        cellWidth: 18,
        halign: "center",
      },
      7: {
        cellWidth: 25,
      },
      8: {
        cellWidth: 18,
        halign: "right",
      },
      9: {
        cellWidth: 18,
        halign: "right",
      },
      10: {
        cellWidth: 28,
        halign: "right",
      },
      11: {
        cellWidth: 24,
        halign: "center",
      },
    },

    didParseCell(data) {

      if (
        data.section === "body" &&
        data.column.index === 11
      ) {

        const status = String(data.cell.raw).toLowerCase();

        if (status === "aman") {
          data.cell.styles.textColor = [22,163,74];
          data.cell.styles.fontStyle = "bold";
        }

        if (status === "minimum") {
          data.cell.styles.textColor = [245,158,11];
          data.cell.styles.fontStyle = "bold";
        }

        if (status === "habis") {
          data.cell.styles.textColor = [220,38,38];
          data.cell.styles.fontStyle = "bold";
        }

        if (status === "expired") {
          data.cell.styles.textColor = [185,28,28];
          data.cell.styles.fontStyle = "bold";
        }

      }

    },

    didDrawPage() {

      const pageNumber = doc.getCurrentPageInfo().pageNumber;

      doc.setDrawColor(230);
      doc.line(
        14,
        pageHeight - 14,
        pageWidth - 14,
        pageHeight - 14
      );

      doc.setFontSize(8);
      doc.setTextColor(120);

      doc.text(
        APOTEK_INFO?.nama || "Sistem Informasi Apotek",
        14,
        pageHeight - 8
      );

      doc.text(
        "Dokumen dibuat otomatis oleh Sistem Informasi Apotek",
        pageWidth / 2,
        pageHeight - 8,
        {
          align: "center",
        }
      );

      doc.text(
        `Halaman ${pageNumber}`,
        pageWidth - 14,
        pageHeight - 8,
        {
          align: "right",
        }
      );

    }

  });

  const finalY = doc.lastAutoTable.finalY + 8;

  doc.setDrawColor(180);

  doc.line(
    14,
    finalY,
    pageWidth - 14,
    finalY
  );

  doc.setFontSize(10);
  doc.setTextColor(40);

  doc.setFont(undefined, "bold");

  doc.text(
    "Ringkasan Nilai Persediaan",
    14,
    finalY + 8
  );

  doc.setFont(undefined, "normal");

  doc.text(
    `Jumlah Produk : ${totalProduk}`,
    14,
    finalY + 16
  );

  doc.text(
    `Jumlah Stok : ${totalStok.toLocaleString("id-ID")}`,
    90,
    finalY + 16
  );

  doc.text(
    `Total Nilai Persediaan : Rp ${totalNilai.toLocaleString("id-ID")}`,
    170,
    finalY + 16
  );

  doc.save(`${config.filename || "laporan-stok"}.pdf`);
}