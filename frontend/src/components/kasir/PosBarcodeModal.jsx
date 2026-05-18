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
    <Modal open={open} onClose={onClose} width={460}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "#FDF2F8", color: "#E91E63", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <QrCodeScannerIcon />
        </div>
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>Scan Barcode Produk</h3>
        <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: 14 }}>Produk terdeteksi. Konfirmasi sebelum masuk keranjang.</p>
      </div>

      <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, marginBottom: 20, border: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 4 }}>OBAT TERDETEKSI</div>
        <div style={{ fontWeight: 800, fontSize: 17, color: "#1E293B", marginBottom: 8 }}>{produk.nama_produk}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "#64748B" }}>Harga unit</span>
          <span style={{ fontWeight: 800, color: "#E91E63" }}>Rp {formatRupiahPos(produk.harga_jual)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
          <span style={{ color: "#64748B" }}>Stok tersedia</span>
          <span style={{ fontWeight: 700 }}>{produk.stok ?? 0}</span>
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
        style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 16, marginBottom: 20 }}
        autoFocus
      />

      {noStock && (
        <div style={{ marginBottom: 16, color: '#DC2626', fontSize: 13, textAlign: 'center' }}>
          Stok produk kosong. Silakan pilih produk lain.
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={noStock}
        style={{
          width: "100%",
          padding: 16,
          borderRadius: 14,
          border: "none",
          background: noStock ? "#F1F5F9" : "#E91E63",
          color: noStock ? "#94A3B8" : "#fff",
          fontWeight: 800,
          fontSize: 15,
          cursor: noStock ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <ShoppingCartOutlinedIcon fontSize="small" />
        Tambah ke Keranjang
      </button>
    </Modal>
  );
};

export default PosBarcodeModal;
