import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { usePos } from "../../context/PosContext";
import { formatRupiahPos, hitungNominalDiskon } from "../../utils/posCalculations";
import { colors, radii, spacing } from "@/theme/designTokens";

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
      <h3 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 18, color: colors.text }}>Atur Diskon</h3>
      <p style={{ margin: "0 0 18px", color: colors.textSecondary, fontSize: 12 }}>Diskon diterapkan pada keranjang saat ini.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["%", "Rp"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipe(t)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: radii.sm,
              border: tipe === t ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
              background: tipe === t ? colors.primaryLight : colors.bgCard,
              fontWeight: 700,
              cursor: "pointer",
              color: tipe === t ? colors.primary : colors.textSecondary,
              fontSize: 12,
              transition: "all 0.2s",
            }}
          >
            {t === "%" ? "Persen (%)" : "Nominal (Rp)"}
          </button>
        ))}
      </div>

      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: colors.textSecondary, marginBottom: 6, textTransform: "uppercase" }}>
        Nilai Diskon
      </label>
      <input
        type="number"
        min={0}
        value={nilai}
        onChange={(e) => setNilai(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: radii.sm, border: `1px solid ${colors.border}`, fontSize: 15, fontWeight: 700, marginBottom: 16 }}
      />

      <div style={{ background: colors.bgMuted, borderRadius: radii.sm, padding: 14, marginBottom: 18, border: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: colors.textSecondary }}>Subtotal</span>
          <span style={{ fontWeight: 700, color: colors.text }}>Rp {formatRupiahPos(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: colors.success, fontWeight: 700, fontSize: 12 }}>Potongan</span>
          <span style={{ fontWeight: 800, color: colors.success, fontSize: 13 }}>- Rp {formatRupiahPos(preview)}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: radii.sm, border: `1px solid ${colors.border}`, background: colors.bgCard, color: colors.textSecondary, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
          Batal
        </button>
        <button type="button" onClick={handleApply} style={{ flex: 1, padding: 12, borderRadius: radii.sm, border: "none", background: colors.primary, color: colors.bgCard, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
          Terapkan
        </button>
      </div>
    </Modal>
  );
};

export default PosDiscountModal;
