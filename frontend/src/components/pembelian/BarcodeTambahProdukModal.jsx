import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { SATUAN_OPTIONS } from "../../config/fakturFormConfig";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #E2E8F0",
  fontSize: 15,
  color: "#1E293B",
  outline: "none",
};

const labelStyle = {
  display: "block",
  color: "#64748B",
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

  useEffect(() => {
    if (produk) {
      setQty(1);
      setSatuan(produk.satuan || produk.nama_satuan || "Pcs");
      setHargaBeli(produk.harga_beli || produk.harga_jual || 0);
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
      satuan,
      harga_satuan: Number(hargaBeli) || 0,
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
            background: "#F0FDFA",
            color: "#0F766E",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <QrCodeScannerIcon />
        </div>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1E293B" }}>
          Konfirmasi Barang
        </h3>
        <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: 14 }}>
          Pastikan produk yang discan sesuai, lalu isi kuantitas dan satuan.
        </p>
      </div>

      <div
        style={{
          background: "#F8FAFC",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          border: "1px solid #E2E8F0",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 16, color: "#1E293B", marginBottom: 4 }}>
          {produk.nama_produk}
        </div>
        <div style={{ fontSize: 13, color: "#64748B" }}>
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

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              background: "#fff",
              color: "#64748B",
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
              background: "#0F766E",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)",
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
