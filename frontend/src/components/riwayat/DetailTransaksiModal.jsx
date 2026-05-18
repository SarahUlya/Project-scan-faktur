import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import useTransaksiDb from "../../hooks/useTransaksiDb";
import PosStruk from "../kasir/PosStruk";
import { formatRupiahPos } from "../../utils/posCalculations";

const DetailTransaksiModal = ({ open, transaksiId, onClose }) => {
  const { getTransaksiDetail } = useTransaksiDb();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !transaksiId) return;
    setLoading(true);
    getTransaksiDetail(transaksiId).then((d) => {
      setDetail(d);
      setLoading(false);
    });
  }, [open, transaksiId, getTransaksiDetail]);

  if (!open) return null;

  const strukData = detail
    ? {
        header: detail.header,
        items: detail.items,
        cetakStruk: true,
      }
    : null;

  return (
    <Modal open={open} onClose={onClose} width={480}>
      <h3 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: 20 }}>Detail Transaksi</h3>
      {loading && <p style={{ color: "#94A3B8" }}>Memuat...</p>}
      {!loading && detail && (
        <>
          <div style={{ marginBottom: 16 }}>
            {detail.items.map((it) => (
              <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, color: "#475569" }}>
                <span>{it.nama_produk} × {it.qty}</span>
                <span>Rp {formatRupiahPos(it.subtotal)}</span>
              </div>
            ))}
          </div>
          <PosStruk data={strukData} />
          <button
            type="button"
            onClick={() => window.print()}
            style={{ width: "100%", marginTop: 16, padding: 12, borderRadius: 10, border: "none", background: "#E91E63", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Cetak Ulang Struk
          </button>
        </>
      )}
    </Modal>
  );
};

export default DetailTransaksiModal;
