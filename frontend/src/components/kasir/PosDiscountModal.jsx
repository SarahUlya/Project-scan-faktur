import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { usePos } from "../../context/PosContext";
import { formatRupiahPos, hitungNominalDiskon } from "../../utils/posCalculations";

const PosDiscountModal = ({ open, onClose }) => {
  const { diskon, setDiskon, subtotal } = usePos();
  const [tipe, setTipe] = useState(diskon.tipe);
  const [nilai, setNilai] = useState(diskon.nilai);

  useEffect(() => {
    if (open) {
      setTipe(diskon.tipe);
      setNilai(diskon.nilai);
    }
  }, [open, diskon]);

  const preview = hitungNominalDiskon(subtotal, { tipe, nilai: Number(nilai) || 0 });

  const handleApply = () => {
    setDiskon({ tipe, nilai: Number(nilai) || 0 });
    onClose();
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} width={440}>
      <h3 style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 20, color: "#1E293B" }}>Atur Diskon</h3>
      <p style={{ margin: "0 0 20px", color: "#64748B", fontSize: 14 }}>Diskon diterapkan pada total keranjang saat ini.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["%", "Rp"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipe(t)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: tipe === t ? "2px solid #E91E63" : "1px solid #E2E8F0",
              background: tipe === t ? "#FFF1F2" : "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {t === "%" ? "Persen (%)" : "Nominal (Rp)"}
          </button>
        ))}
      </div>

      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 6, textTransform: "uppercase" }}>
        Nilai Diskon
      </label>
      <input
        type="number"
        min={0}
        value={nilai}
        onChange={(e) => setNilai(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 16, marginBottom: 16 }}
      />

      <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#64748B" }}>Subtotal</span>
          <span style={{ fontWeight: 700 }}>Rp {formatRupiahPos(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#10B981", fontWeight: 700 }}>Potongan</span>
          <span style={{ fontWeight: 800, color: "#10B981" }}>- Rp {formatRupiahPos(preview)}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid #E2E8F0", background: "#fff", fontWeight: 700, cursor: "pointer" }}>
          Batal
        </button>
        <button type="button" onClick={handleApply} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "#E91E63", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          Terapkan Diskon
        </button>
      </div>
    </Modal>
  );
};

export default PosDiscountModal;
