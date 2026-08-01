import React from "react";
import { APOTEK_INFO } from "../../config/apotek";
import { formatRupiahPos } from "../../utils/posCalculations";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
} from "@/theme/designTokens";

const PosStruk = ({ data }) => {
  if (!data) return null;
  const { header, items = [], cetakStruk } = data;

  // Format tanggal
  const tanggal = new Date(header?.tanggal);
  const tglStr = tanggal.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const jamStr = tanggal.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className="struk-print-area"
      style={{
        maxWidth: 300,
        margin: "0 auto",
        fontFamily: "'Courier New', monospace",
        fontSize: 11,
        color: colors.text,
        padding: 0,
        background: colors.bgCard,
        lineHeight: 1.3,
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 8,
          borderBottom: `1px dashed ${colors.border}`,
          paddingBottom: 8,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 2 }}>
          {APOTEK_INFO.nama.toUpperCase()}
        </div>
        <div style={{ fontSize: 9 }}>{APOTEK_INFO.alamat}</div>
        <div style={{ fontSize: 9 }}>Telp: {APOTEK_INFO.telepon}</div>
      </div>

      {/* Nomor & Waktu */}
      <div
        style={{
          marginBottom: 8,
          borderBottom: "1px dashed colors.border",
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
          }}
        >
          <span>No: {header?.no_transaksi}</span>
          <span>Kasir: {header?.kasir}</span>
        </div>
        <div style={{ fontSize: 9, marginTop: 2 }}>
          {tglStr} {jamStr}
        </div>
      </div>

      {/* Items */}
      <div
        style={{
          marginBottom: 8,
          borderBottom: `1px dashed ${colors.border}`,
          paddingBottom: 8,
        }}
      >
        {items.map((it, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            <div style={{ fontWeight: 700, wordBreak: "break-word" }}>
              {it.nama_produk || it.nama}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 9,
              }}
            >
              <span>
                {it.qty} × Rp {formatRupiahPos(it.harga)}
              </span>
              <span style={{ fontWeight: 700 }}>
                Rp {formatRupiahPos(it.subtotal || it.qty * it.harga)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          marginBottom: 8,
          borderBottom: `1px dashed ${colors.border}`,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            marginBottom: 2,
          }}
        >
          <span>Subtotal</span>
          <span>Rp {formatRupiahPos(header?.subtotal)}</span>
        </div>
        {header?.diskon_nominal > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              marginBottom: 2,
              color: colors.danger,
            }}
          >
            <span>Diskon</span>
            <span>- Rp {formatRupiahPos(header?.diskon_nominal)}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 900,
            fontSize: 12,
            borderTop: `1px dashed ${colors.border}`,
            paddingTop: 4,
          }}
        >
          <span>TOTAL</span>
          <span>Rp {formatRupiahPos(header?.total)}</span>
        </div>
      </div>

      {/* Pembayaran */}
      <div
        style={{
          marginBottom: 8,
          borderBottom: `1px dashed ${colors.border}`,
          paddingBottom: 8,
        }}
      >
        <div style={{ fontSize: 9, marginBottom: 2 }}>
          <span style={{ fontWeight: 700 }}>Metode:</span> {header?.metode}
        </div>
        {header?.metode === "TUNAI" && (
          <>
            <div style={{ fontSize: 9, marginBottom: 2 }}>
              <span style={{ fontWeight: 700 }}>Diterima:</span> Rp{" "}
              {formatRupiahPos(header?.uang_diterima)}
            </div>
            <div style={{ fontSize: 9, color: colors.success, fontWeight: 700 }}>
              <span>Kembalian:</span> Rp {formatRupiahPos(header?.kembalian)}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginBottom: 4, fontSize: 9 }}>
        Terima kasih atas kunjungan Anda
      </div>
      <div style={{ textAlign: "center", fontSize: 8, color: colors.textSecondary }}>
        Semoga lekas sembuh
      </div>
      {!cetakStruk && (
        <div
          style={{
            textAlign: "center",
            fontSize: 8,
            color: colors.textSecondary,
            marginTop: 6,
            fontStyle: "italic",
          }}
        >
          (Preview — cetak opsional)
        </div>
      )}
    </div>
  );
};

export default PosStruk;
