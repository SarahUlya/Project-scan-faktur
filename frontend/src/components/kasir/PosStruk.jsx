import React from "react";
import { APOTEK_INFO } from "../../config/apotekConfig";
import { formatRupiahPos } from "../../utils/posCalculations";

const PosStruk = ({ data }) => {
  if (!data) return null;
  const { header, items = [], cetakStruk } = data;

  return (
    <div className="struk-print-area" style={{ maxWidth: 320, margin: "0 auto", fontFamily: "monospace", fontSize: 12, color: "#111", padding: 16, background: "#fff", border: "1px dashed #ccc" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 900, fontSize: 14 }}>{APOTEK_INFO.nama.toUpperCase()}</div>
        <div style={{ fontSize: 10 }}>{APOTEK_INFO.alamat}</div>
        <div style={{ fontSize: 10 }}>Telp: {APOTEK_INFO.telepon}</div>
      </div>
      <div style={{ borderTop: "1px dashed #999", borderBottom: "1px dashed #999", padding: "8px 0", marginBottom: 8 }}>
        <div>No: {header?.no_transaksi}</div>
        <div>{new Date(header?.tanggal).toLocaleString("id-ID")}</div>
        <div>Kasir: {header?.kasir}</div>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ marginBottom: 6 }}>
          <div style={{ fontWeight: 700 }}>{it.nama_produk || it.nama}</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{it.qty} × Rp {formatRupiahPos(it.harga)}</span>
            <span>Rp {formatRupiahPos(it.subtotal || it.qty * it.harga)}</span>
          </div>
        </div>
      ))}
      <div style={{ borderTop: "1px dashed #999", marginTop: 8, paddingTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>Rp {formatRupiahPos(header?.subtotal)}</span></div>
        {header?.diskon_nominal > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Diskon</span><span>- Rp {formatRupiahPos(header?.diskon_nominal)}</span></div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 14, marginTop: 4 }}>
          <span>TOTAL</span><span>Rp {formatRupiahPos(header?.total)}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 11 }}>
          <div>Bayar: {header?.metode}</div>
          {header?.metode === "TUNAI" && (
            <>
              <div>Diterima: Rp {formatRupiahPos(header?.uang_diterima)}</div>
              <div>Kembali: Rp {formatRupiahPos(header?.kembalian)}</div>
            </>
          )}
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 10 }}>Terima kasih — semoga lekas sembuh</div>
      {!cetakStruk && <div style={{ textAlign: "center", fontSize: 9, color: "#999", marginTop: 8 }}>(Preview — cetak opsional)</div>}
    </div>
  );
};

export default PosStruk;

