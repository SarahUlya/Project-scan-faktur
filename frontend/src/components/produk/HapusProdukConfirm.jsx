import React from "react";
import Button from "../ui/Button";

const HapusProdukConfirm = ({ open, onClose, onDelete, produk }) => {
  if (!open) return null;
  return (
    <div style={{ minWidth: 340, maxWidth: 420 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ background: "#FCE7F3", borderRadius: "50%", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 32, color: "#E91E63" }}>🗑️</span>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>Konfirmasi Hapus Produk</h2>
        <div style={{ color: "#B0B0B0", fontSize: 15, textAlign: "center" }}>
          Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
        </div>
        <div style={{ background: "#F3F6F9", borderRadius: 12, padding: 12, width: "100%", display: "flex", alignItems: "center", gap: 10, margin: "12px 0" }}>
          <span style={{ fontSize: 22, color: "#E91E63" }}>💊</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{produk?.nama}</div>
            <div style={{ color: "#B0B0B0", fontSize: 13 }}>ID: {produk?.id}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, width: "100%", marginTop: 8 }}>
          <Button type="button" variant="outlined" color="pink" sx={{ flex: 1, fontWeight: 700, fontSize: 15 }} onClick={onClose}>
            Batal
          </Button>
          <Button type="button" color="pink" sx={{ flex: 1, fontWeight: 700, fontSize: 15 }} onClick={onDelete}>
            Hapus Produk
          </Button>
        </div>
        <div style={{ color: "#E91E63", fontSize: 12, marginTop: 8, fontWeight: 700 }}>
          ▲ AKSI PERMANEN
        </div>
      </div>
    </div>
  );
};

export default HapusProdukConfirm;
