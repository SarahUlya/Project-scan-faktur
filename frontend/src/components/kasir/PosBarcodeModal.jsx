import React, { useState, useRef, useEffect } from "react";
import Modal from "../ui/Modal";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { formatRupiahPos } from "../../utils/posCalculations";

const PosBarcodeModal = ({ open, produk, onClose, onAdd }) => {
  const [qty, setQty] = useState(1);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && produk) setQty(1);
  }, [open, produk]);

  if (!open || !produk) return null;

  const noStock = (produk.stok || 0) <= 0;

  const handleAdd = () => {
    if (qty < 1 || noStock) return;
    onAdd(produk, qty);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width={420}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FDF2F8", color: "#E91E63", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <QrCodeScannerIcon />
        </div>
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: 18, color: "#1E293B" }}>Produk Terdeteksi</h3>
        <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 13 }}>Masukkan kuantitas untuk menambahkan ke keranjang</p>
      </div>

      <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 14, marginBottom: 18, border: "1px solid #E2E8F0" }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#1E293B", marginBottom: 8 }}>{produk.nama_produk}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: "#64748B" }}>Harga</span>
          <span style={{ fontWeight: 800, color: "#E91E63" }}>Rp {formatRupiahPos(produk.harga_jual)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "#64748B" }}>Stok Tersedia</span>
          <span style={{ fontWeight: 700, color: "#10B981" }}>{produk.stok ?? 0}</span>
        </div>
      </div>

      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 6, textTransform: "uppercase" }}>Kuantitas</label>
      <input
        ref={inputRef}
        type="number"
        min={1}
        max={produk.stok || 999}
        value={qty}
        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
        style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 15, marginBottom: 18, fontWeight: 700, outline: "none" }}
        autoFocus
      />

      {noStock && (
        <div style={{ marginBottom: 16, color: '#DC2626', fontSize: 12, textAlign: 'center', fontWeight: 600 }}>
          Stok produk kosong. Silakan pilih produk lain.
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={noStock}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 10,
          border: "none",
          background: noStock ? "#F1F5F9" : "#E91E63",
          color: noStock ? "#94A3B8" : "#fff",
          fontWeight: 800,
          fontSize: 14,
          cursor: noStock ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 0.2s",
        }}
      >
        <ShoppingCartOutlinedIcon fontSize="small" />
        Tambah ke Keranjang
      </button>
    </Modal>
  );
};

export default PosBarcodeModal;
