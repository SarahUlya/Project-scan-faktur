import React, { useRef, useState } from "react";
import terbilang from "../../utils/terbilang";
import { APOTEK_INFO } from "../../config/apotek";
import { colors, radii, typography } from "@/theme/designTokens";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Import Material UI
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
// Helper Formatting
const formatRupiah = (n) =>
  (n || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

const formatTanggal = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatEd = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}.${yy}`;
};

async function saveFile(blob, fileName, mimeType) {
  // Browser mendukung Save As
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

  // Fallback browser lama
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

const FakturPrintView = ({ faktur }) => {
  const printRef = useRef(null);

  // State Dropdown Menu Action
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  if (!faktur) return null;

  const { header = {}, supplier = {}, items = [] } = faktur;

  const subtotal =
    header.subtotal ?? items.reduce((acc, it) => acc + (it.subtotal || 0), 0);
  const ppn =
    header.ppn ?? Math.round(subtotal * ((header.nilai_ppn || 11) / 100));
  const dpp = header.jenis_ppn === "sudah_termasuk" ? subtotal - ppn : subtotal;
  const total =
    header.total ||
    (header.jenis_ppn === "sudah_termasuk" ? subtotal : subtotal + ppn);

  // Handlers Export & Cetak
  const handlePrint = () => {
    handleCloseMenu();
    setTimeout(() => window.print(), 100);
  };

  const handleExportPDF = async () => {
    handleCloseMenu();

    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    const blob = pdf.output("blob");

    await saveFile(
      blob,
      `Faktur_${header.no_faktur || "Detail"}.pdf`,
      "application/pdf",
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

    const buffer = XLSX.write(wb, {
      type: "array",
      bookType: "xlsx",
    });

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await saveFile(
      blob,
      `Faktur_${header.no_faktur || "Detail"}.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  };
  const handleExportCSV = async () => {
    handleCloseMenu();

    const headers = [
      "No",
      "Barang",
      "Batch",
      "ED",
      "Qty",
      "Satuan",
      "Harga",
      "Diskon",
      "Subtotal",
    ];

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
      .map((r) =>
        r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8",
    });

    await saveFile(
      blob,
      `Faktur_${header.no_faktur || "Detail"}.csv`,
      "text/csv",
    );
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* CSS KHUSUS MEDIA PRINT AGAR PAS 1 HALAMAN A4 */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .faktur-print-area, .faktur-print-area * {
              visibility: visible;
            }
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
            .no-print {
              display: none !important;
            }
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
          }
        `}
      </style>

      {/* DROPDOWN CETAK & EKSPOR */}
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
            fontWeight: 400,
            textTransform: "none",
            borderRadius: "8px",
            px: 2.5,
            py: 1,
            bgcolor: colors.text,
            "&:hover": { bgcolor: colors.text },
          }}
        >
          Cetak & Export
        </Button>

        {/* DROPDOWN MENU ITEMS */}
        <Menu
          id="export-dropdown-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{
            "aria-labelledby": "export-dropdown-button",
          }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: "8px",
              minWidth: 180,
              mt: 0.5,
            },
          }}
        >
          <MenuItem onClick={handlePrint}>
            <ListItemIcon>
              <PrintIcon fontSize="small" sx={{ color: colors.text }} />
            </ListItemIcon>
            <ListItemText
              primary="Cetak Printer"
              primaryTypographyProps={{ fontSize: 13, fontWeight: 400 }}
            />
          </MenuItem>

          <MenuItem onClick={handleExportPDF}>
            <ListItemIcon>
              <PictureAsPdfIcon
                fontSize="small"
                sx={{ color: colors.warning }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Export PDF"
              primaryTypographyProps={{ fontSize: 13, fontWeight: 400 }}
            />
          </MenuItem>

          <MenuItem onClick={handleExportExcel}>
            <ListItemIcon>
              <TableChartIcon fontSize="small" sx={{ color: colors.success }} />
            </ListItemIcon>
            <ListItemText
              primary="Export Excel"
              primaryTypographyProps={{ fontSize: 13, fontWeight: 400 }}
            />
          </MenuItem>

          <MenuItem onClick={handleExportCSV}>
            <ListItemIcon>
              <InsertDriveFileIcon fontSize="small" sx={{ color: "#0284c7" }} />
            </ListItemIcon>
            <ListItemText
              primary="Export CSV"
              primaryTypographyProps={{ fontSize: 13, fontWeight: 400 }}
            />
          </MenuItem>
        </Menu>
      </Stack>

      {/* KARTU PRINTABLE FAKTUR */}
      <Paper
        ref={printRef}
        className="faktur-print-area"
        elevation={0}
        sx={{
          background: colors.textOnDark,
          p: 4,
          borderRadius: 1,
          border: `1px solid ${colors.borderHover}`,
          maxWidth: 820,
          margin: "0 auto",
          fontSize: 11,
          color: colors.textDark,
          boxSizing: "border-box",
        }}
      >
        {/* HEADER FAKTUR (Nomor Kotak Hitam) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: 1.5,
                color: "#0f172a",
              }}
            >
              FAKTUR
            </div>
            <div
              style={{
                border: "2px solid #0f172a",
                padding: "6px 14px",
                minWidth: 160,
                borderRadius: 2,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 12 }}>
                No. {header.no_faktur}
              </div>
              <div style={{ fontSize: 11 }}>
                Tgl. {formatTanggal(header.tanggal)}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11 }}>
            <div style={{ fontWeight: 700 }}>Jatuh tempo</div>
            <div>{formatTanggal(header.jatuh_tempo)}</div>
            <div style={{ marginTop: 6, color: "#64748b" }}>
              Halaman 1 dari 1
            </div>
          </div>
        </div>

        {/* INFORMASI SUPPLIER & APOTEK */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
              {supplier?.nama || header.supplier_name}
            </div>
            <div style={{ color: "#334155" }}>{supplier?.alamat || "-"}</div>
            <div>Telp: {supplier?.telepon || "-"}</div>
            <div>Penanggung jawab: {supplier?.penanggungJawab || "-"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
              {APOTEK_INFO.nama}
            </div>
            <div style={{ color: "#334155" }}>{APOTEK_INFO.alamat}</div>
            <div>Telp: {APOTEK_INFO.telepon}</div>
            <div>NPWP: {APOTEK_INFO.npwp}</div>
          </div>
        </div>

        {/* METODE PEMBAYARAN */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            fontSize: 11,
            marginBottom: 16,
            padding: "8px 12px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#f8fafc",
          }}
        >
          <div>
            <strong>Pembayaran:</strong> {header.jenis_pembayaran || "Tunai"}
          </div>
          <div>
            <strong>Akun:</strong>{" "}
            {header.akun_kas?.nama || header.akun_kas || "-"}
          </div>
          <div>
            <strong>Gudang:</strong>{" "}
            {header.gudang?.nama || header.gudang || "-"}
          </div>
          <div>
            <strong>Penerimaan:</strong>{" "}
            {formatTanggal(header.tanggal_penerimaan)}
          </div>
        </div>

        {/* TABEL ITEM BARANG */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 16,
            fontSize: 11,
          }}
        >
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th
                style={{ width: 32, border: "1px solid #cbd5e1", padding: 6 }}
              >
                No.
              </th>
              <th
                style={{
                  border: "1px solid #cbd5e1",
                  padding: 6,
                  textAlign: "left",
                }}
              >
                Barang
              </th>
              <th
                style={{ width: 80, border: "1px solid #cbd5e1", padding: 6 }}
              >
                Batch
              </th>
              <th
                style={{ width: 50, border: "1px solid #cbd5e1", padding: 6 }}
              >
                ED
              </th>
              <th
                style={{ width: 80, border: "1px solid #cbd5e1", padding: 6 }}
              >
                Qty Satuan
              </th>
              <th
                style={{
                  width: 80,
                  border: "1px solid #cbd5e1",
                  padding: 6,
                  textAlign: "right",
                }}
              >
                Harga @
              </th>
              <th
                style={{ width: 60, border: "1px solid #cbd5e1", padding: 6 }}
              >
                Diskon
              </th>
              <th
                style={{
                  width: 95,
                  border: "1px solid #cbd5e1",
                  padding: 6,
                  textAlign: "right",
                }}
              >
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: 16,
                    color: "#64748b",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  Detail item belum tersedia untuk faktur ini.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={`${row.batch}-${row.no}`}>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #cbd5e1",
                      padding: 6,
                    }}
                  >
                    {row.no}
                  </td>
                  <td
                    style={{
                      border: "1px solid #cbd5e1",
                      padding: 6,
                      fontWeight: 500,
                    }}
                  >
                    {row.nama}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #cbd5e1",
                      padding: 6,
                    }}
                  >
                    {row.batch}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #cbd5e1",
                      padding: 6,
                    }}
                  >
                    {formatEd(row.expired_date)}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #cbd5e1",
                      padding: 6,
                    }}
                  >
                    {row.qty} {row.satuan?.nama || row.satuan || "-"}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      border: "1px solid #cbd5e1",
                      padding: 6,
                    }}
                  >
                    {formatRupiah(row.harga)}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #cbd5e1",
                      padding: 6,
                    }}
                  >
                    {row.diskon
                      ? row.diskon_tipe === "%"
                        ? `${row.diskon}%`
                        : formatRupiah(row.diskon)
                      : "-"}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      border: "1px solid #cbd5e1",
                      padding: 6,
                      fontWeight: 600,
                    }}
                  >
                    {formatRupiah(row.subtotal)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* TOTAL & TERBILANG */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 260px",
            gap: 16,
            alignItems: "start",
          }}
        >
          <div
            style={{ border: "1px solid #cbd5e1", padding: 10, minHeight: 65 }}
          >
            <div style={{ fontWeight: 700, marginBottom: 2 }}>Terbilang:</div>
            <div
              style={{
                fontStyle: "italic",
                textTransform: "uppercase",
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {terbilang(total)}
            </div>
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: 700,
                    padding: "3px 6px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  Subtotal
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "3px 6px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  {formatRupiah(subtotal)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: 700,
                    padding: "3px 6px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  DPP
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "3px 6px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  {formatRupiah(dpp)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: 700,
                    padding: "3px 6px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  PPN {header.nilai_ppn || 11}%
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "3px 6px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  {formatRupiah(ppn)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: 800,
                    padding: "4px 6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontWeight: 800,
                    padding: "4px 6px",
                    border: "1px solid #cbd5e1",
                    bgcolor: "#f8fafc",
                  }}
                >
                  {formatRupiah(total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* OTORISASI / TANDA TANGAN */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
            marginTop: 36,
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ marginBottom: 48 }}>Penerima,</div>
            <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: 4 }}>
              (........................)
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 48 }}>Hormat kami,</div>
            <div style={{ fontWeight: 700 }}>
              {supplier?.penanggungJawab || supplier?.nama || "-"}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 48 }}>Pegawai gudang,</div>
            <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: 4 }}>
              (........................)
            </div>
          </div>
        </div>

        {/* STATUS PEMBAYARAN */}
        <div
          style={{
            marginTop: 20,
            textAlign: "right",
            fontSize: 10,
            color: "#64748b",
            fontWeight: 600,
          }}
        >
          Status pembayaran: {header.status || "LUNAS"}
        </div>
      </Paper>
    </Box>
  );
};

export default FakturPrintView;
