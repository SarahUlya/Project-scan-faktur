import React from "react";
import { colors } from "@/theme/designTokens"; // ← tambahkan ini
import { APOTEK_INFO } from "../../../config/apotek";
import {
  buildLaporanSummary,
  formatExpired,
  formatJamCetak,
  formatTanggalCetak,
} from "../../../utils/stokPrintUtils";

const baseStyle = {
  maxWidth: 300,
  margin: "0 auto",
  fontFamily: "'Courier New', monospace",
  fontSize: 11,
  color: colors.text,
  padding: 0,
  background: colors.bg,
  lineHeight: 1.3,
};

const dashed = {
  borderBottom: `1px dashed ${colors.border}`,
  paddingBottom: 8,
  marginBottom: 8,
};

const LaporanStokPrint = ({ rows = [], judul = "LAPORAN STOK & BATCH" }) => {
  const summary = buildLaporanSummary(rows);
  const now = new Date();

  return (
    <div className="struk-print-area laporan-stok-print" style={baseStyle}>
      <div style={{ textAlign: "center", ...dashed }}>
        <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 2 }}>
          {APOTEK_INFO.nama.toUpperCase()}
        </div>
        <div style={{ fontSize: 9 }}>{APOTEK_INFO.alamat}</div>
        <div style={{ fontSize: 9 }}>Telp: {APOTEK_INFO.telepon}</div>
      </div>

      <div style={dashed}>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 11 }}>{judul}</div>
        <div style={{ textAlign: "center", fontSize: 9, marginTop: 2 }}>
          {formatTanggalCetak(now)} {formatJamCetak(now)}
        </div>
      </div>

      <div style={dashed}>
        {rows.length === 0 ? (
          <div style={{ textAlign: "center", fontSize: 9 }}>Tidak ada data stok</div>
        ) : (
          rows.map((row, i) => (
            <div key={`${row.kodeBatch}-${i}`} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 600, wordBreak: "break-word" }}>
                {i + 1}. {row.namaProduk}
              </div>
              <div style={{ fontSize: 9, color: colors.textMuted }}>{row.kategori}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                <span>Batch</span>
                <span style={{ fontWeight: 600 }}>{row.kodeBatch}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                <span>Expired</span>
                <span>{formatExpired(row.expired)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                <span>Stok</span>
                <span style={{ fontWeight: 600 }}>{row.stok} unit</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                <span>Status</span>
                <span style={{ fontWeight: 600 }}>{row.status}</span>
              </div>
              {row.no_faktur && row.no_faktur !== "-" && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                  <span>Faktur</span>
                  <span>{row.no_faktur}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={dashed}>
        <div style={{ fontWeight: 900, fontSize: 10, marginBottom: 4, textAlign: "center" }}>RINGKASAN</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
          <span>Total baris</span><span>{summary.totalBaris}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
          <span>Total batch</span><span>{summary.totalBatch}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
          <span>Total stok</span><span>{summary.totalStok} unit</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
          <span>Expired</span><span>{summary.expired}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
          <span>Peringatan</span><span>{summary.peringatan}</span>
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 9 }}>Laporan stok apotek</div>
      <div style={{ textAlign: "center", fontSize: 8, color: colors.textMuted }}>Dicetak otomatis oleh sistem</div>
    </div>
  );
};

export default LaporanStokPrint;