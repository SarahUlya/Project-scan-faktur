import React from "react";
import { APOTEK_INFO } from "../../../config/apotekConfig";
import { formatExpired, formatJamCetak, formatTanggalCetak } from "../../../utils/stokPrintUtils";

const baseStyle = {
  maxWidth: 300,
  margin: "0 auto",
  fontFamily: "'Courier New', monospace",
  fontSize: 11,
  color: "#000",
  padding: 0,
  background: "#fff",
  lineHeight: 1.3,
};

const dashed = {
  borderBottom: "1px dashed #000",
  paddingBottom: 8,
  marginBottom: 8,
};

const KartuBatchPrint = ({ batch }) => {
  if (!batch) return null;

  const kode = batch.kodeBatch || batch.no_batch || "-";
  const now = new Date();

  return (
    <div className="struk-print-area kartu-batch-print" style={baseStyle}>
      <div style={{ textAlign: "center", ...dashed }}>
        <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 2 }}>
          {APOTEK_INFO.nama.toUpperCase()}
        </div>
        <div style={{ fontSize: 9 }}>{APOTEK_INFO.alamat}</div>
        <div style={{ fontSize: 9 }}>Telp: {APOTEK_INFO.telepon}</div>
      </div>

      <div style={dashed}>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 11 }}>KARTU STOK BATCH</div>
        <div style={{ textAlign: "center", fontSize: 9, marginTop: 2 }}>
          {formatTanggalCetak(now)} {formatJamCetak(now)}
        </div>
      </div>

      <div style={dashed}>
        <div style={{ fontWeight: 700, wordBreak: "break-word" }}>{batch.namaProduk || "-"}</div>
        <div style={{ fontSize: 9, color: "#444", marginBottom: 4 }}>{batch.kategori || "-"}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
          <span>Batch</span>
          <span style={{ fontWeight: 700 }}>{kode}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
          <span>Expired</span>
          <span>{formatExpired(batch.expired)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
          <span>Sisa stok</span>
          <span style={{ fontWeight: 700 }}>{batch.stok || 0} unit</span>
        </div>
        {batch.no_faktur && batch.no_faktur !== "-" && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
            <span>Faktur</span>
            <span>{batch.no_faktur}</span>
          </div>
        )}
      </div>

      <div style={dashed}>
        <div style={{ fontWeight: 900, fontSize: 10, marginBottom: 4, textAlign: "center" }}>
          RIWAYAT PERGERAKAN
        </div>
        {(batch.history || []).length === 0 ? (
          <div style={{ textAlign: "center", fontSize: 9 }}>Belum ada pergerakan stok</div>
        ) : (
          batch.history.map((log, idx) => (
            <div key={idx} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 700 }}>
                {new Date(log.tanggal).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </div>
              <div style={{ fontSize: 9 }}>{log.aktivitas}</div>
              {log.referensi && <div style={{ fontSize: 8, color: "#666" }}>{log.referensi}</div>}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                <span>Masuk: {log.masuk ? `+${log.masuk}` : "-"}</span>
                <span>Keluar: {log.keluar ? `-${log.keluar}` : "-"}</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700 }}>Saldo: {log.saldoAkhir}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 10 }}>
        Sisa akhir: {batch.stok || 0} unit
      </div>
    </div>
  );
};

export default KartuBatchPrint;
