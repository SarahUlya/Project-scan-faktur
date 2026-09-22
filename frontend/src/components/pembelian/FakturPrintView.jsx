import React, { useRef, useState } from "react";
import terbilang from "../../utils/terbilang";
import { APOTEK_INFO } from "../../config/apotek";
import { colors } from "@/theme/designTokens";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/* ══════════════════════════════════════════════════════════════════
 * HELPER FORMAT
 * ══════════════════════════════════════════════════════════════════ */
const formatRupiah = (n) =>
  (Number(n) || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

const formatTanggal = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatEd = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${yy}`;
};

/**
 * Helper — ambil field supplier dengan fallback berbagai nama
 */
const pick = (...values) => {
  for (const v of values) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
};

async function saveFile(blob, fileName, mimeType) {
  if ("showSaveFilePicker" in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: mimeType,
            accept: {
              [mimeType]: ["." + fileName.split(".").pop()],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════════════════════════
 * KOMPONEN — Baris info (hanya render kalau ada nilai)
 * ══════════════════════════════════════════════════════════════════ */
const InfoLine = ({ label, value }) => {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 2, lineHeight: 1.5 }}>
      <span style={{ color: "#666", fontSize: 10.5 }}>{label}: </span>
      <span style={{ color: "#000", fontWeight: 500 }}>{value}</span>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ══════════════════════════════════════════════════════════════════ */
const FakturPrintView = ({ faktur }) => {
  const printRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  if (!faktur) return null;

  const { header = {}, supplier = {}, items = [] } = faktur;

  /* ── Perhitungan ─────────────────────────────────────────────── */
  const subtotal = Number(
    header.subtotal ?? items.reduce((acc, it) => acc + (it.subtotal || 0), 0)
  );
  const nilaiPpn = Number(header.nilai_ppn || 11);
  const isNonPpn = header.jenis_ppn === "non_ppn";
  const isTermasuk = header.jenis_ppn === "sudah_termasuk";

  let ppn = 0;
  let dpp = subtotal;
  let total = subtotal;

  if (!isNonPpn) {
    if (isTermasuk) {
      dpp = Math.round(subtotal / (1 + nilaiPpn / 100));
      ppn = subtotal - dpp;
      total = subtotal;
    } else {
      dpp = subtotal;
      ppn = Math.round(subtotal * (nilaiPpn / 100));
      total = subtotal + ppn;
    }
  }

  const cashback = Number(header.cashback || 0);
  const totalAkhir = Math.max(0, total - cashback);

  /* ── Data supplier (dinamis, ambil dari berbagai field name) ─── */
  const supplierNama = pick(
    supplier?.nama,
    supplier?.nama_supplier,
    header?.supplier_name,
    header?.supplier
  );
  const supplierAlamat = pick(
    supplier?.alamat,
    supplier?.alamat_supplier
  );
  const supplierTelp = pick(
    supplier?.telepon,
    supplier?.no_telepon,
    supplier?.telp,
    supplier?.no_telp
  );
  const supplierEmail = pick(supplier?.email);
  const supplierPenanggungJawab = pick(
    supplier?.penanggungJawab,
    supplier?.penanggung_jawab,
    supplier?.pic
  );

  /* ── Export handlers ─────────────────────────────────────────── */
  const handlePrint = () => {
    handleCloseMenu();
    setTimeout(() => window.print(), 100);
  };

  const handleExportPDF = async () => {
    handleCloseMenu();
    const element = printRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    const blob = pdf.output("blob");
    await saveFile(
      blob,
      `Faktur_${header.no_faktur || "Detail"}.pdf`,
      "application/pdf"
    );
  };

  const handleExportExcel = async () => {
    handleCloseMenu();
    const excelData = items.map((row, idx) => ({
      No: row.no || idx + 1,
      Barang: row.nama,
      Batch: row.batch,
      ED: formatEd(row.expired_date),
      Qty: row.qty,
      Satuan: row.satuan?.nama || row.satuan || "-",
      Harga: row.harga,
      Diskon: row.diskon
        ? row.diskon_tipe === "%"
          ? `${row.diskon}%`
          : row.diskon
        : "-",
      Subtotal: row.subtotal,
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Faktur");
    const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    await saveFile(
      blob,
      `Faktur_${header.no_faktur || "Detail"}.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  };

  const handleExportCSV = async () => {
    handleCloseMenu();
    const headers = ["No", "Barang", "Batch", "ED", "Qty", "Satuan", "Harga", "Diskon", "Subtotal"];
    const rows = items.map((row, idx) => [
      row.no || idx + 1,
      row.nama,
      row.batch,
      formatEd(row.expired_date),
      row.qty,
      row.satuan?.nama || row.satuan || "-",
      row.harga,
      row.diskon
        ? row.diskon_tipe === "%"
          ? `${row.diskon}%`
          : row.diskon
        : "-",
      row.subtotal,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    await saveFile(
      blob,
      `Faktur_${header.no_faktur || "Detail"}.csv`,
      "text/csv"
    );
  };

  /* ══════════════════════════════════════════════════════════════════
   * RENDER
   * ══════════════════════════════════════════════════════════════════ */
  return (
    <Box sx={{ pb: 4 }}>
      {/* CSS PRINT */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .faktur-print-area, .faktur-print-area * { visibility: visible; }
            .faktur-print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print { display: none !important; }
            @page { size: A4 portrait; margin: 12mm; }
          }
        `}
      </style>

      {/* ═══ DROPDOWN CETAK & EXPORT ═══ */}
      <Stack
        className="no-print"
        direction="row"
        spacing={1.5}
        justifyContent="flex-end"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Button
          id="export-dropdown-button"
          aria-controls={openMenu ? "export-dropdown-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          variant="contained"
          disableElevation
          onClick={handleOpenMenu}
          endIcon={<KeyboardArrowDownIcon />}
          startIcon={<PrintIcon />}
          sx={{
            fontWeight: 500,
            textTransform: "none",
            borderRadius: "8px",
            px: 2.5,
            py: 1,
            bgcolor: "#000",
            "&:hover": { bgcolor: "#222" },
          }}
        >
          Cetak & Export
        </Button>

        <Menu
          id="export-dropdown-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{ "aria-labelledby": "export-dropdown-button" }}
          PaperProps={{
            elevation: 3,
            sx: { borderRadius: "8px", minWidth: 180, mt: 0.5 },
          }}
        >
          <MenuItem onClick={handlePrint}>
            <ListItemIcon>
              <PrintIcon fontSize="small" sx={{ color: "#000" }} />
            </ListItemIcon>
            <ListItemText primary="Cetak Printer" primaryTypographyProps={{ fontSize: 13 }} />
          </MenuItem>
          <MenuItem onClick={handleExportPDF}>
            <ListItemIcon>
              <PictureAsPdfIcon fontSize="small" sx={{ color: "#000" }} />
            </ListItemIcon>
            <ListItemText primary="Export PDF" primaryTypographyProps={{ fontSize: 13 }} />
          </MenuItem>
          <MenuItem onClick={handleExportExcel}>
            <ListItemIcon>
              <TableChartIcon fontSize="small" sx={{ color: "#000" }} />
            </ListItemIcon>
            <ListItemText primary="Export Excel" primaryTypographyProps={{ fontSize: 13 }} />
          </MenuItem>
          <MenuItem onClick={handleExportCSV}>
            <ListItemIcon>
              <InsertDriveFileIcon fontSize="small" sx={{ color: "#000" }} />
            </ListItemIcon>
            <ListItemText primary="Export CSV" primaryTypographyProps={{ fontSize: 13 }} />
          </MenuItem>
        </Menu>
      </Stack>

      {/* ═══ KARTU FAKTUR ═══ */}
      <Paper
        ref={printRef}
        className="faktur-print-area"
        elevation={0}
        sx={{
          background: "#FFFFFF",
          p: 5,
          borderRadius: 0,
          border: "1px solid #000000",
          maxWidth: 820,
          margin: "0 auto",
          fontSize: 11,
          color: "#000000",
          boxSizing: "border-box",
          fontFamily: "'Times New Roman', 'Georgia', serif",
        }}
      >
        {/* ═══ KOP SURAT / HEADER APOTEK ═══ */}
        <div
          style={{
            textAlign: "center",
            borderBottom: "3px double #000",
            paddingBottom: 14,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 4,
              textTransform: "uppercase",
            }}
          >
            {APOTEK_INFO.nama || "-"}
          </div>
          {APOTEK_INFO.alamat && (
            <div style={{ fontSize: 11, marginBottom: 2 }}>
              {APOTEK_INFO.alamat}
            </div>
          )}
          <div style={{ fontSize: 11 }}>
            {APOTEK_INFO.telepon && `Telp: ${APOTEK_INFO.telepon}`}
            {APOTEK_INFO.telepon && APOTEK_INFO.npwp && "  |  "}
            {APOTEK_INFO.npwp && `NPWP: ${APOTEK_INFO.npwp}`}
          </div>
        </div>

        {/* ═══ JUDUL ═══ */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 4,
              textDecoration: "underline",
              marginBottom: 4,
            }}
          >
            FAKTUR PEMBELIAN
          </div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>
            No. {header.no_faktur || "-"}
          </div>
        </div>

        {/* ═══ INFO SUPPLIER & APOTEK ═══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            marginBottom: 20,
            fontSize: 11,
          }}
        >
          {/* DARI (Supplier) */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: 4,
                marginBottom: 8,
              }}
            >
              Dari (Supplier)
            </div>
            {supplierNama ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  {supplierNama}
                </div>
                {supplierAlamat && (
                  <div style={{ lineHeight: 1.5, marginBottom: 2 }}>
                    {supplierAlamat}
                  </div>
                )}
                {supplierTelp && (
                  <div style={{ lineHeight: 1.5 }}>Telp: {supplierTelp}</div>
                )}
                {supplierEmail && (
                  <div style={{ lineHeight: 1.5 }}>Email: {supplierEmail}</div>
                )}
                {supplierPenanggungJawab && (
                  <div style={{ lineHeight: 1.5 }}>
                    UP. {supplierPenanggungJawab}
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontStyle: "italic", color: "#666" }}>
                Data supplier tidak tersedia
              </div>
            )}
          </div>

          {/* KEPADA (Apotek) */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                borderBottom: "1px solid #000",
                paddingBottom: 4,
                marginBottom: 8,
              }}
            >
              Kepada
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
              {APOTEK_INFO.nama || "-"}
            </div>
            {APOTEK_INFO.alamat && (
              <div style={{ lineHeight: 1.5, marginBottom: 2 }}>
                {APOTEK_INFO.alamat}
              </div>
            )}
            {APOTEK_INFO.telepon && (
              <div style={{ lineHeight: 1.5 }}>Telp: {APOTEK_INFO.telepon}</div>
            )}
            {APOTEK_INFO.npwp && (
              <div style={{ lineHeight: 1.5 }}>NPWP: {APOTEK_INFO.npwp}</div>
            )}
          </div>
        </div>

        {/* ═══ METADATA FAKTUR ═══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            fontSize: 11,
            marginBottom: 20,
            border: "1px solid #000",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
            }}
          >
            <div style={metaCellLeft()}>
              <div style={metaLabel()}>Tanggal Faktur</div>
              <div style={metaValue()}>{formatTanggal(header.tanggal)}</div>
            </div>
            <div style={metaCellRight()}>
              <div style={metaLabel()}>Jatuh Tempo</div>
              <div style={metaValue()}>
                {header.jatuh_tempo ? formatTanggal(header.jatuh_tempo) : "—"}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
            }}
          >
            <div style={metaCellLeft()}>
              <div style={metaLabel()}>Metode Pembayaran</div>
              <div style={metaValue()}>
                {header.jenis_pembayaran || "Tunai"}
              </div>
            </div>
            <div style={metaCellRight()}>
              <div style={metaLabel()}>Status</div>
              <div style={{ ...metaValue(), fontWeight: 700 }}>
                {header.status || "LUNAS"}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TABEL ITEM ═══ */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 16,
            fontSize: 11,
          }}
        >
          <thead>
            <tr>
              <th style={th(30, "center")}>No.</th>
              <th style={th(0, "left")}>Nama Barang</th>
              <th style={th(85, "center")}>No. Batch</th>
              <th style={th(50, "center")}>ED</th>
              <th style={th(50, "center")}>Qty</th>
              <th style={th(55, "center")}>Satuan</th>
              <th style={th(85, "right")}>Harga @</th>
              <th style={th(60, "center")}>Diskon</th>
              <th style={th(95, "right")}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: 16,
                    color: "#666",
                    border: "1px solid #000",
                    fontStyle: "italic",
                  }}
                >
                  Detail item belum tersedia untuk faktur ini.
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={`${row.batch}-${row.no}-${idx}`}>
                  <td style={td("center")}>{row.no || idx + 1}</td>
                  <td style={td("left", { fontWeight: 500 })}>{row.nama}</td>
                  <td style={td("center", { fontFamily: "'Courier New', monospace", fontSize: 10 })}>
                    {row.batch || "-"}
                  </td>
                  <td style={td("center")}>{formatEd(row.expired_date)}</td>
                  <td style={td("center")}>{row.qty}</td>
                  <td style={td("center")}>
                    {row.satuan?.nama || row.satuan || "-"}
                  </td>
                  <td style={td("right")}>{formatRupiah(row.harga)}</td>
                  <td style={td("center")}>
                    {row.diskon
                      ? row.diskon_tipe === "%"
                        ? `${row.diskon}%`
                        : formatRupiah(row.diskon)
                      : "—"}
                  </td>
                  <td style={td("right", { fontWeight: 600 })}>
                    {formatRupiah(row.subtotal)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ═══ TERBILANG + TOTAL ═══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 24,
            marginBottom: 24,
            alignItems: "start",
          }}
        >
          {/* Terbilang */}
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Terbilang
            </div>
            <div
              style={{
                fontStyle: "italic",
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.6,
                textTransform: "capitalize",
              }}
            >
              {terbilang(totalAkhir)}
            </div>
          </div>

          {/* Tabel Total */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 11,
            }}
          >
            <tbody>
              <tr>
                <td style={totalLabel()}>Subtotal</td>
                <td style={totalValue()}>{formatRupiah(subtotal)}</td>
              </tr>

              {!isNonPpn && (
                <>
                  <tr>
                    <td style={totalLabel()}>DPP</td>
                    <td style={totalValue()}>{formatRupiah(dpp)}</td>
                  </tr>
                  <tr>
                    <td style={totalLabel()}>PPN {nilaiPpn}%</td>
                    <td style={totalValue()}>{formatRupiah(ppn)}</td>
                  </tr>
                </>
              )}

              {cashback > 0 && (
                <tr>
                  <td style={totalLabel()}>Cashback</td>
                  <td style={totalValue()}>− {formatRupiah(cashback)}</td>
                </tr>
              )}

              <tr>
                <td
                  style={{
                    ...totalLabel(),
                    borderTop: "2px solid #000",
                    borderBottom: "2px solid #000",
                    fontWeight: 800,
                    fontSize: 12,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    paddingTop: 8,
                    paddingBottom: 8,
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    ...totalValue(),
                    borderTop: "2px solid #000",
                    borderBottom: "2px solid #000",
                    fontWeight: 800,
                    fontSize: 12,
                    paddingTop: 8,
                    paddingBottom: 8,
                  }}
                >
                  {formatRupiah(totalAkhir)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ═══ CATATAN ═══ */}
        {header.catatan && (
          <div
            style={{
              marginBottom: 16,
              padding: "8px 12px",
              border: "1px solid #000",
              fontSize: 11,
            }}
          >
            <strong>Catatan:</strong> {header.catatan}
          </div>
        )}

        {/* ═══ TANDA TANGAN ═══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
            marginTop: 48,
            textAlign: "center",
            fontSize: 11,
          }}
        >
          <div>
            <div style={{ marginBottom: 60 }}>Penerima,</div>
            <div
              style={{
                borderTop: "1px solid #000",
                paddingTop: 6,
                color: "#666",
              }}
            >
              (................................)
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 60 }}>Hormat kami,</div>
            <div
              style={{
                fontWeight: 700,
                borderTop: "1px solid #000",
                paddingTop: 6,
              }}
            >
              {supplierPenanggungJawab || supplierNama || "-"}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 60 }}>Pegawai Gudang,</div>
            <div
              style={{
                borderTop: "1px solid #000",
                paddingTop: 6,
                color: "#666",
              }}
            >
              (................................)
            </div>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 10,
            borderTop: "1px solid #000",
            fontSize: 9,
            color: "#666",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Dokumen ini dicetak secara otomatis oleh Sistem Manajemen Apotek{" "}
          {APOTEK_INFO.nama || ""}
        </div>
      </Paper>
    </Box>
  );
};

/* ══════════════════════════════════════════════════════════════════
 * SHARED STYLE HELPERS
 * ══════════════════════════════════════════════════════════════════ */
const BORDER = "1px solid #000";
const PADDING = "6px 8px";

const th = (width, align) => ({
  ...(width ? { width } : {}),
  border: BORDER,
  padding: PADDING,
  textAlign: align,
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: 0.3,
  textTransform: "uppercase",
  backgroundColor: "#FFFFFF",
});

const td = (align, extra = {}) => ({
  textAlign: align,
  border: BORDER,
  padding: PADDING,
  fontSize: 11,
  ...extra,
});

const metaCellLeft = () => ({
  padding: "8px 12px",
  borderRight: "1px solid #000",
});

const metaCellRight = () => ({
  padding: "8px 12px",
});

const metaLabel = () => ({
  fontSize: 10,
  color: "#666",
  marginBottom: 2,
  textTransform: "uppercase",
  letterSpacing: 0.3,
});

const metaValue = () => ({
  fontSize: 11,
  fontWeight: 600,
});

const totalLabel = () => ({
  padding: "5px 10px",
  border: "1px solid #000",
  fontWeight: 500,
  fontSize: 11,
});

const totalValue = () => ({
  textAlign: "right",
  padding: "5px 10px",
  border: "1px solid #000",
  fontWeight: 600,
  fontSize: 11,
});

export default FakturPrintView;
