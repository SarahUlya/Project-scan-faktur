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
    <Modal open={open} onClose={onClose} width={420}>
      <h3 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 18, color: "#1E293B" }}>Atur Diskon</h3>
      <p style={{ margin: "0 0 18px", color: "#64748B", fontSize: 12 }}>Diskon diterapkan pada keranjang saat ini.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["%", "Rp"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipe(t)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: tipe === t ? "2px solid #E91E63" : "1px solid #E2E8F0",
              background: tipe === t ? "#FFF1F2" : "#fff",
              fontWeight: 700,
              cursor: "pointer",
              color: tipe === t ? "#E91E63" : "#64748B",
              fontSize: 12,
              transition: "all 0.2s",
            }}
          >
            {t === "%" ? "Persen (%)" : "Nominal (Rp)"}
          </button>
        ))}
      </div>

      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748B", marginBottom: 6, textTransform: "uppercase" }}>
        Nilai Diskon
      </label>
      <input
        type="number"
        min={0}
        value={nilai}
        onChange={(e) => setNilai(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 15, fontWeight: 700, marginBottom: 16 }}
      />

      <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 14, marginBottom: 18, border: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: "#64748B" }}>Subtotal</span>
          <span style={{ fontWeight: 700 }}>Rp {formatRupiahPos(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#10B981", fontWeight: 700, fontSize: 12 }}>Potongan</span>
          <span style={{ fontWeight: 800, color: "#10B981", fontSize: 13 }}>- Rp {formatRupiahPos(preview)}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
          Batal
        </button>
        <button type="button" onClick={handleApply} style={{ flex: 1, padding: 12, borderRadius: 8, border: "none", background: "#E91E63", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
          Terapkan
        </button>
      </div>
    </Modal>
  );
};

export default PosDiscountModal;
