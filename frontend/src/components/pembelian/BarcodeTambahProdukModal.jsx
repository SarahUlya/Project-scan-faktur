import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { SATUAN_OPTIONS } from "../../config/apotek";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
} from "@/theme/designTokens";


const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid " + colors.border,
  fontSize: 15,
  color: colors.text,
  outline: "none",
};

const labelStyle = {
  display: "block",
  color: colors.textSecondary,
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 6,
};

const BarcodeTambahProdukModal = ({ open, produk, onClose, onConfirm }) => {
  const [qty, setQty] = useState(1);
  const [satuan, setSatuan] = useState("Pcs");
  const [hargaBeli, setHargaBeli] = useState(0);
  const [hargaJual, setHargaJual] = useState(0);

  useEffect(() => {
    if (produk) {
      setQty(1);
      setSatuan(produk.id_satuan || produk.nama_satuan || "Pcs");
      setHargaBeli(produk.harga_beli || 0);
      setHargaJual(produk.harga_jual || 0);
    }
  }, [produk]);

  if (!open || !produk) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!qty || qty <= 0) {
      alert("Kuantitas harus lebih dari 0");
      return;
    }
    onConfirm({
      produk_id: produk.id_produk,
      nama_produk: produk.nama_produk,
      qty: Number(qty),
      satuan : produk.id_satuan || produk.nama_satuan || satuan || "Pcs",
      harga_beli: Number(hargaBeli) || 0,
      harga_jual: Number(hargaJual) || 0,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width={480}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: colors.bgMuted,
            color: colors.primary,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <QrCodeScannerIcon />
        </div>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.text, marginBottom: 6 }}>
          Konfirmasi Barang
        </h3>
        <p style={{ margin: "8px 0 0", color: colors.textSecondary, fontSize: 14 }}>
          Pastikan produk yang discan sesuai, lalu isi kuantitas dan satuan.
        </p>
      </div>

      <div
        style={{
          background: colors.bgMuted,
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          border: "1px solid " + colors.border,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 16, color: colors.text, marginBottom: 4 }}>
          {produk.nama_produk}
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary }}>
          Barcode: <strong>{produk.barcode || "-"}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Kuantitas *</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              style={inputStyle}
              autoFocus
            />
          </div>
          <div>
            <label style={labelStyle}>Satuan *</label>
            <select
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
              style={inputStyle}
            >
              {SATUAN_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Harga Beli (Rp)</label>
          <input
            type="number"
            min={0}
            value={hargaBeli}
            onChange={(e) => setHargaBeli(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Harga Jual (Rp)</label>
          <input
            type="number"
            min={0}
            value={hargaJual}
            onChange={(e) => setHargaJual(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 12,
              border: "1px solid " + colors.border,
              background: colors.bgMuted,
              color: colors.textSecondary,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Batal
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 12,
              border: "none",
              background: colors.primary,
              color: colors.white,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px " + colors.primary40,
            }}
          >
            Tambahkan ke Faktur
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BarcodeTambahProdukModal;
