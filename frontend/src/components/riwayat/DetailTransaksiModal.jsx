import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import CancelTransactionConfirmModal from "./CancelTransactionConfirmModal";
import useTransaksiDb from "../../hooks/useTransaksiDb";
import PosStruk from "../kasir/PosStruk";
import { formatRupiahPos } from "../../utils/posCalculations";
import { getUser, ROLE } from "../../auth/auth";
import PrintIcon from "@mui/icons-material/Print";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DetailTransaksiModal = ({
  open,
  transaksiId,
  onClose
}) => {

  const {
    getTransaksiDetail,
    cancelTransaksi
  } = useTransaksiDb();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!open || !transaksiId) return;

    setLoading(true);

    getTransaksiDetail(transaksiId)
      .then((d) => {
        setDetail(d);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [open, transaksiId, getTransaksiDetail]);

  const handleBatalkan = async () => {
    setCancelLoading(true);
    try {
      await cancelTransaksi(transaksiId);

      alert("Transaksi berhasil dibatalkan");

      // refresh detail
      const d = await getTransaksiDetail(
        transaksiId
      );

      setDetail(d);
      setCancelConfirmOpen(false);

    } catch (err) {
      alert(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  if (!open) return null;

  const strukData = detail
    ? {
        header: detail.header,
        items: detail.items,
        cetakStruk: true,
      }
    : null;

  const user = getUser();
  const isCanceled = detail?.header.status === "DIBATALKAN";
  const canCancel = user?.role === ROLE.ADMIN && !isCanceled;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        width={500}
      >

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#F0FDFA",
              color: "#0F766E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PrintIcon />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 18,
                color: "#1E293B",
              }}
            >
              Detail Transaksi
            </h3>
            <p
              style={{
                margin: "4px 0 0",
                color: "#64748B",
                fontSize: 12,
              }}
            >
              ID: {transaksiId}
            </p>
          </div>
        </div>

        {loading && (
          <p
            style={{
              color: "#94A3B8",
              textAlign: "center",
            }}
          >
            Memuat...
          </p>
        )}

        {!loading && detail && (
          <>
            {/* Items List */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: 12,
                padding: 16,
                marginBottom: 18,
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  letterSpacing: 0.5,
                }}
              >
                Rincian Barang
              </div>
              {detail.items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 8,
                    color: "#475569",
                    paddingBottom: 8,
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {it.nama_produk} × {it.qty}
                  </span>

                  <span style={{ fontWeight: 700, color: "#1E293B" }}>
                    Rp {formatRupiahPos(it.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Struk */}
            <div
              style={{
                marginBottom: 18,
                background: "#FAFBFC",
                padding: 14,
                borderRadius: 10,
                border: "1px solid #E2E8F0",
              }}
            >
              <PosStruk data={strukData} />
            </div>

            {/* Status Badge */}
            {isCanceled && (
              <div
                style={{
                  background: "#FEE2E2",
                  border: "1px solid #FECACA",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 18,
                  textAlign: "center",
                  color: "#991B1B",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                ✓ Transaksi telah dibatalkan
              </div>
            )}

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
              }}
            >
              {/* Cetak Button */}
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #0F766E 0%, #EC407A 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = "0 6px 16px rgba(15, 118, 110, 0.35)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = "0 4px 12px rgba(15, 118, 110, 0.25)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <PrintIcon sx={{ fontSize: 16 }} />
                Cetak Ulang
              </button>

              {/* Batalkan Button */}
              {canCancel && (
                <button
                  onClick={() => setCancelConfirmOpen(true)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    border: "1px solid #FECACA",
                    background: "#FEE2E2",
                    color: "#DC2626",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#FECACA";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#FEE2E2";
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  Batalkan
                </button>
              )}
            </div>

          </>
        )}

      </Modal>

      {/* Confirmation Modal */}
      <CancelTransactionConfirmModal
        open={cancelConfirmOpen}
        onConfirm={handleBatalkan}
        onCancel={() => setCancelConfirmOpen(false)}
        transaksiId={transaksiId}
        isLoading={cancelLoading}
      />
    </>
  );
};

export default DetailTransaksiModal;