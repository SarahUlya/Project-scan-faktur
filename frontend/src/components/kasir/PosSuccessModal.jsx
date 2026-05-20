import React from "react";
import Modal from "../ui/Modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PosStruk from "./PosStruk";
import { formatRupiahPos } from "../../utils/posCalculations";

const PosSuccessModal = ({ open, data, onClose, onNewTransaction }) => {
  if (!open || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const strukData = {
    header: {
      no_transaksi: data.no_transaksi,
      tanggal: data.tanggal,
      kasir: data.kasir,
      subtotal: data.subtotal,
      diskon_nominal: data.diskonNominal,
      total: data.total,
      metode: data.metode,
      uang_diterima: data.uangDiterima,
      kembalian: data.kembalian,
    },
    items: data.cart?.map((c) => ({
      nama_produk: c.nama,
      qty: c.qty,
      harga: c.harga,
      subtotal: c.qty * c.harga,
    })),
    cetakStruk: data.cetakStruk,
  };

  return (
    <Modal open={open} onClose={onClose} width={440}>
      <div className="no-print" style={{ textAlign: "center", marginBottom: 18 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 56, color: "#10B981" }} />
        <h2 style={{ margin: "10px 0 4px", fontWeight: 800, fontSize: 20, color: "#1E293B" }}>Transaksi Berhasil!</h2>
        {data.metode === "TUNAI" && data.kembalian > 0 && (
          <p style={{ color: "#16A34A", fontWeight: 800, fontSize: 16, margin: "6px 0 0" }}>Kembalian: Rp {formatRupiahPos(data.kembalian)}</p>
        )}
      </div>

      <PosStruk data={strukData} />

      <div className="no-print" style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button type="button" onClick={onNewTransaction} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#E91E63", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          + Transaksi Baru
        </button>
        <button type="button" onClick={handlePrint} style={{ flex: 1, padding: 12, borderRadius: 10, border: "2px solid #E91E63", background: "#fff", color: "#E91E63", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          Cetak Ulang
        </button>
      </div>
    </Modal>
  );
};

export default PosSuccessModal;
