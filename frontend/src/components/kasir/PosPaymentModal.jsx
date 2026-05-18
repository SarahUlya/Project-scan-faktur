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
    <Modal open={open} onClose={onClose} width={720}>
      <h3 style={{ margin: "0 0 20px", fontWeight: 800, fontSize: 22, color: "#1E293B" }}>Pilih Metode Pembayaran</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 12, color: "#94A3B8", textTransform: "uppercase", marginBottom: 12 }}>Detail Pesanan</p>
          {cart.map((item) => (
            <div key={item.cartKey} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "#475569" }}>
              <span>{item.nama} × {item.qty}</span>
              <span>Rp {formatRupiahPos(item.qty * item.harga)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 12, paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>Subtotal</span><span>Rp {formatRupiahPos(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Diskon</span><span>- Rp {formatRupiahPos(diskonNominal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, color: "#E91E63" }}>
              <span>Total Bayar</span><span>Rp {formatRupiahPos(totalBayar)}</span>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {METODE.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetode(m)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: metode === m ? "2px solid #E91E63" : "1px solid #E2E8F0",
                  background: metode === m ? "#FFF1F2" : "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {isTunai && (
            <>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Uang Diterima</label>
              <input
                type="number"
                value={uangDiterima}
                onChange={(e) => setUangDiterima(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 18, fontWeight: 700, margin: "8px 0 12px" }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {QUICK_CASH.map((amt) => (
                  <button key={amt} type="button" onClick={() => setUangDiterima(String(amt))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
                    Rp {(amt / 1000).toFixed(0)}rb
                  </button>
                ))}
                <button type="button" onClick={() => setUangDiterima(String(totalBayar))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #E91E63", background: "#FFF1F2", color: "#E91E63", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                  Uang Pas
                </button>
              </div>
              <div style={{ background: "#F0FDF4", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#64748B", fontWeight: 700 }}>KEMBALIAN</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#16A34A" }}>Rp {formatRupiahPos(kembalian)}</div>
              </div>
            </>
          )}

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, cursor: "pointer", fontSize: 14 }}>
            <input type="checkbox" checked={cetakStruk} onChange={(e) => setCetakStruk(e.target.checked)} />
            Cetak struk otomatis setelah bayar
          </label>

          <button
            type="button"
            disabled={!canPay || loading}
            onClick={handleConfirm}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              border: "none",
              background: canPay && !loading ? "#E91E63" : "#F1F5F9",
              color: canPay && !loading ? "#fff" : "#94A3B8",
              fontWeight: 800,
              fontSize: 15,
              cursor: canPay && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Memproses..." : "Konfirmasi & Cetak Struk"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PosPaymentModal;
