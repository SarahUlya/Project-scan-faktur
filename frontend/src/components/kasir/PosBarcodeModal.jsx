import React, { useState, useRef, useEffect } from "react";
import Modal from "../ui/Modal";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { formatRupiahPos } from "../../utils/posCalculations";

const PosBarcodeModal = ({ open, produk, onClose, onAdd }) => {
  const [qty, setQty] = useState(1);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && produk) {
      setQty(1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, produk]);

  if (!open || !produk) return null;

  const noStock = (produk.stok || 0) <= 0;
  const subtotal = qty * (produk.harga_jual || 0);

  const handleAdd = () => {
    if (qty < 1 || noStock) return;
    onAdd(produk, qty);
    onClose();
  };

  const incrementQty = () => {
    if (qty < (produk.stok || 999)) {
      setQty(qty + 1);
    }
  };

  const decrementQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  return (
    <Modal open={open} onClose={onClose} width={440}>
      {/* Header dengan icon */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "linear-gradient(135deg, #0F766E 0%, #EC407A 100%)",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)",
          }}
        >
          <QrCodeScannerIcon sx={{ fontSize: 32 }} />
        </div>
        <h3
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 20,
            color: "#1E293B",
            marginBottom: 6,
          }}
        >
          Produk Terdeteksi
        </h3>
        <p
          style={{
            margin: 0,
            color: "#64748B",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Pastikan data produk benar sebelum menambahkan
        </p>
      </div>

      {/* Detail Produk */}
      <div
        style={{
          background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
          borderRadius: 12,
          padding: 18,
          marginBottom: 22,
          border: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 16,
            color: "#1E293B",
            marginBottom: 14,
            lineHeight: 1.4,
          }}
        >
          {produk.nama_produk}
        </div>

        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                marginBottom: 4,
                letterSpacing: 0.5,
              }}
            >
              Harga Satuan
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: "#0F766E",
              }}
            >
              Rp {formatRupiahPos(produk.harga_jual)}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                marginBottom: 4,
                letterSpacing: 0.5,
              }}
            >
              Stok Tersedia
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: produk.stok > 10 ? "#10B981" : "#F59E0B",
              }}
            >
              {produk.stok ?? 0} Unit
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#E2E8F0",
            margin: "14px 0",
          }}
        />

        {/* Subtotal Preview */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Subtotal
          </span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "#1E293B",
            }}
          >
            Rp {formatRupiahPos(subtotal)}
          </span>
        </div>
      </div>

      {/* Quantity Control */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            color: "#94A3B8",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Kuantitas
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={decrementQty}
            disabled={qty <= 1 || noStock}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: "1px solid #E2E8F0",
              background: qty <= 1 ? "#F8FAFC" : "#fff",
              color: qty <= 1 ? "#CBD5E1" : "#64748B",
              fontWeight: 700,
              fontSize: 18,
              cursor: qty <= 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>

          <input
            ref={inputRef}
            type="number"
            min={1}
            max={produk.stok || 999}
            value={qty}
            onChange={(e) => {
              const val = Math.max(
                1,
                Math.min(produk.stok || 999, parseInt(e.target.value, 10) || 1)
              );
              setQty(val);
            }}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #E2E8F0",
              fontSize: 15,
              fontWeight: 800,
              textAlign: "center",
              color: "#1E293B",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0F766E";
              e.target.style.boxShadow = "0 0 0 3px rgba(15, 118, 110, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E2E8F0";
              e.target.style.boxShadow = "none";
            }}
          />

          <button
            type="button"
            onClick={incrementQty}
            disabled={qty >= (produk.stok || 999) || noStock}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: "none",
              background: qty >= (produk.stok || 999) || noStock ? "#F1F5F9" : "#0F766E",
              color: qty >= (produk.stok || 999) || noStock ? "#94A3B8" : "#fff",
              fontWeight: 700,
              fontSize: 18,
              cursor: qty >= (produk.stok || 999) || noStock ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Error Message */}
      {noStock && (
        <div
          style={{
            marginBottom: 18,
            color: "#DC2626",
            fontSize: 12,
            textAlign: "center",
            fontWeight: 600,
            padding: "10px 12px",
            background: "#FEE2E2",
            borderRadius: 8,
            border: "1px solid #FECACA",
          }}
        >
          Stok produk kosong. Pilih produk lain.
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={noStock}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          border: "none",
          background: noStock
            ? "#F1F5F9"
            : "linear-gradient(135deg, #0F766E 0%, #EC407A 100%)",
          color: noStock ? "#94A3B8" : "#fff",
          fontWeight: 800,
          fontSize: 14,
          cursor: noStock ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 0.2s",
          boxShadow: noStock ? "none" : "0 4px 14px rgba(15, 118, 110, 0.3)",
        }}
        onMouseEnter={(e) => {
          if (!noStock) {
            e.target.style.boxShadow = "0 6px 20px rgba(15, 118, 110, 0.4)";
            e.target.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!noStock) {
            e.target.style.boxShadow = "0 4px 14px rgba(15, 118, 110, 0.3)";
            e.target.style.transform = "translateY(0)";
          }
        }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
        Tambah ke Keranjang
      </button>
    </Modal>
  );
};

export default PosBarcodeModal;
