import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { usePos } from "../../context/PosContext";
import useTransaksiDb from "../../hooks/useTransaksiDb";
import { getUser } from "../../auth/auth";
import { formatRupiahPos, hitungKembalian } from "../../utils/posCalculations";

const METODE = ["TUNAI", "QRIS", "TRANSFER"];
const QUICK_CASH = [50000, 100000, 200000];

const PosPaymentModal = ({ open, onClose, onSuccess }) => {
  const { cart, subtotal, diskon, diskonNominal, totalBayar, clearCart } = usePos();
  const { processTransaksi } = useTransaksiDb();
  const [metode, setMetode] = useState("TUNAI");
  const [uangDiterima, setUangDiterima] = useState("");
  const [cetakStruk, setCetakStruk] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setMetode("TUNAI");
      setUangDiterima(String(totalBayar));
      setCetakStruk(true);
    }
  }, [open, totalBayar]);

  const kembalian = metode === "TUNAI" ? hitungKembalian(uangDiterima, totalBayar) : 0;
  const isTunai = metode === "TUNAI";
  const canPay = !isTunai || Number(uangDiterima) >= totalBayar;

  const handleConfirm = async () => {
    if (!canPay) {
      alert("Uang diterima kurang dari total bayar.");
      return;
    }
    setLoading(true);
    const cartSnapshot = [...cart];
    try {
      const user = getUser();
      const result = await processTransaksi({
        cart,
        diskon,
        metode,
        uangDiterima: isTunai ? Number(uangDiterima) : totalBayar,
        subtotal,
        diskonNominal,
        total: totalBayar,
        kembalian,
        kasir: user?.nama || user?.username || "Kasir",
        cetakStruk,
      });
      clearCart();
      onSuccess?.({
        ...result,
        cetakStruk,
        metode,
        kembalian,
        subtotal,
        diskonNominal,
        total: totalBayar,
        uangDiterima: Number(uangDiterima) || totalBayar,
        cart: cartSnapshot,
        kasir: user?.nama || user?.username || "Kasir",
      });
    } catch (e) {
      alert(e.message || "Gagal memproses transaksi.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} width={680}>
      <h3 style={{ margin: "0 0 18px", fontWeight: 800, fontSize: 20, color: "#1E293B" }}>Konfirmasi Pembayaran</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 20 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 11, color: "#94A3B8", textTransform: "uppercase", marginBottom: 10, margin: "0 0 10px" }}>Ringkasan Pesanan</p>
          <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 12 }}>
            {cart.map((item) => (
              <div key={item.cartKey} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: "#475569" }}>
                <span>{item.nama}</span>
                <span style={{ fontWeight: 600 }}>{item.qty} × Rp {formatRupiahPos(item.harga)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 12 }}>
              <span style={{ color: "#64748B" }}>Subtotal</span><span style={{ fontWeight: 600 }}>Rp {formatRupiahPos(subtotal)}</span>
            </div>
            {diskonNominal > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#10B981" }}>
                <span>Diskon</span><span style={{ fontWeight: 600 }}>- Rp {formatRupiahPos(diskonNominal)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, color: "#E91E63" }}>
              <span>Total</span><span>Rp {formatRupiahPos(totalBayar)}</span>
            </div>
          </div>
        </div>

        <div>
          <p style={{ fontWeight: 700, fontSize: 11, color: "#94A3B8", textTransform: "uppercase", marginBottom: 10, margin: "0 0 10px" }}>Metode Pembayaran</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {METODE.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetode(m)}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: metode === m ? "2px solid #E91E63" : "1px solid #E2E8F0",
                  background: metode === m ? "#FFF1F2" : "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  color: metode === m ? "#E91E63" : "#64748B",
                  transition: "all 0.2s",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {isTunai && (
            <>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Uang Diterima</label>
              <input
                type="number"
                value={uangDiterima}
                onChange={(e) => setUangDiterima(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 16, fontWeight: 700, marginBottom: 10 }}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {QUICK_CASH.map((amt) => (
                  <button key={amt} type="button" onClick={() => setUangDiterima(String(amt))} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 11 }}>
                    Rp {(amt / 1000).toFixed(0)}rb
                  </button>
                ))}
                <button type="button" onClick={() => setUangDiterima(String(totalBayar))} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #E91E63", background: "#FFF1F2", color: "#E91E63", fontWeight: 700, cursor: "pointer", fontSize: 11 }}>
                  Pas
                </button>
              </div>
              <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 12, marginBottom: 14, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, marginBottom: 4 }}>KEMBALIAN</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#16A34A" }}>Rp {formatRupiahPos(kembalian)}</div>
              </div>
            </>
          )}

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, cursor: "pointer", fontSize: 12 }}>
            <input type="checkbox" checked={cetakStruk} onChange={(e) => setCetakStruk(e.target.checked)} style={{ cursor: "pointer" }} />
            <span>Cetak struk ke printer thermal</span>
          </label>

          <button
            type="button"
            disabled={!canPay || loading}
            onClick={handleConfirm}
            style={{
              width: "100%",
              padding: 13,
              borderRadius: 10,
              border: "none",
              background: canPay && !loading ? "#E91E63" : "#F1F5F9",
              color: canPay && !loading ? "#fff" : "#94A3B8",
              fontWeight: 800,
              fontSize: 13,
              cursor: canPay && !loading ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: canPay && !loading ? "0 3px 12px rgba(233,30,99,0.25)" : "none",
            }}
          >
            {loading ? "Memproses..." : "Konfirmasi Pembayaran"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PosPaymentModal;
