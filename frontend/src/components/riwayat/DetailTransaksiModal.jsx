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
  onClose,
  onRefresh
}) => {
  const {
    getTransaksiDetail,
    cancelTransaksi
  } = useTransaksiDb();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadDetail = async () => {
    if (!open || !transaksiId) return;
    setLoading(true);
    try {
      const d = await getTransaksiDetail(transaksiId);
      setDetail(d);
    } catch (err) {
      console.error("Gagal memuat detail transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [open, transaksiId]);

  const handleBatalkan = async () => {
    setCancelLoading(true);
    try {
      await cancelTransaksi(transaksiId);
      alert("Transaksi berhasil dibatalkan");
      
      await loadDetail();
      setCancelConfirmOpen(false);
      
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || "Gagal membatalkan transaksi");
    } finally {
      setCancelLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) {
      alert("Mohon izinkan pop-up untuk mencetak struk.");
      return;
    }

    const strukContent = document.getElementById("struk-print-content");
    if (!strukContent) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Transaksi</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              padding: 20px; 
              margin: 0;
              background: white;
            }
            * { box-sizing: border-box; }
            @media print { body { padding: 10px; } }
          </style>
        </head>
        <body>
          ${strukContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!open) return null;

  // PERBAIKAN: Mengambil status asli dari database (tidak lagi di-hardcode ke "SELESAI")
  const mappedDetail = detail
    ? {
        header: {
          no_transaksi: detail.no_transaksi,
          tanggal: detail.tanggal_transaksi,
          kasir: detail.user?.nama || "-",
          metode: detail.metode_bayar,
          total: Number(detail.total),
          status: (detail.status || detail.status_transaksi || "SELESAI").toUpperCase(),
        },
        items: detail.transaksidetail?.map((item) => ({
          id: item.id_transaksi_detail,
          nama_produk: item.produk?.nama_produk || "-",
          qty: item.qty,
          subtotal: Number(item.subtotal),
          harga: Number(item.harga_jual),
        })) || [],
      }
    : null;

  const strukData = mappedDetail
    ? {
        header: mappedDetail.header,
        items: mappedDetail.items,
        cetakStruk: true,
      }
    : null;

  const user = getUser();
  const isCanceled = mappedDetail?.header.status === "DIBATALKAN";
  const canCancel = user?.role === ROLE.ADMIN && !isCanceled;

  return (
    <>
      <Modal open={open} onClose={onClose} width={500}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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

          {/* Badge Status */}
          {isCanceled ? (
            <span
              style={{
                background: "#FEE2E2",
                color: "#991B1B",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              DIBATALKAN
            </span>
          ) : (
            <span
              style={{
                background: "#DCFCE7",
                color: "#166534",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              SELESAI
            </span>
          )}
        </div>

        {loading && (
          <p style={{ color: "#94A3B8", textAlign: "center", padding: "20px 0" }}>
            Memuat...
          </p>
        )}

        {!loading && detail && mappedDetail && (
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
              {mappedDetail.items.map((it) => (
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

            {/* Struk Content */}
            <div
              id="struk-print-content"
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

            {/* Info Status Batal */}
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
                ✕ Transaksi telah dibatalkan
              </div>
            )}

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              {/* Cetak Button */}
              <button
                onClick={handlePrint}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  border: "none",
                  background: "#0F766E",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <PrintIcon sx={{ fontSize: 16 }} />
                Cetak Ulang
              </button>

              {/* Batalkan Button (Khusus Admin & belum dibatalkan) */}
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  Batalkan Transaksi
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