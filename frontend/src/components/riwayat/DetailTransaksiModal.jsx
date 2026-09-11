import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import useTransaksiDb from "../../hooks/useTransaksiDb";
import PosStruk from "../kasir/PosStruk";
import { formatRupiahPos } from "../../utils/posCalculations";
import { getUser, ROLE } from "../../auth/auth";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import { colors } from "@/theme/designTokens";

const STATUS_STYLE = {
  LUNAS: { bg: colors.successLight, color: colors.success, label: "LUNAS" },
  SELESAI: { bg: colors.successLight, color: colors.success, label: "LUNAS" },
  MENUNGGU_PEMBAYARAN: {
    bg: colors.warningLight,
    color: colors.warning,
    label: "MENUNGGU PEMBAYARAN",
  },
  DIBATALKAN: {
    bg: colors.dangerLight,
    color: colors.danger,
    label: "DIBATALKAN",
  },
};

const normalizeStatus = (status) =>
  String(status || "LUNAS").toUpperCase().replace(/\s+/g, "_");

const DetailTransaksiModal = ({
  open,
  transaksiId,
  onClose,
  onRefresh,
}) => {
  const { getTransaksiDetail, verifikasiLunas, returBarang } = useTransaksiDb();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleVerifikasi = async () => {
    if (
      !window.confirm(
        "Verifikasi transaksi ini sebagai LUNAS? Omzet akan dihitung dan stok dikonfirmasi."
      )
    ) {
      return;
    }
    setActionLoading(true);
    try {
      await verifikasiLunas(transaksiId);
      await loadDetail();
      onRefresh?.();
      alert("Transaksi berhasil diverifikasi lunas.");
    } catch (err) {
      alert(err.message || "Gagal verifikasi transaksi.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetur = async () => {
    if (
      !window.confirm(
        "Proses retur barang untuk transaksi ini? Stok akan dikembalikan."
      )
    ) {
      return;
    }
    setActionLoading(true);
    try {
      await returBarang(transaksiId);
      await loadDetail();
      onRefresh?.();
      alert("Retur barang berhasil diproses.");
    } catch (err) {
      alert(err.message || "Gagal memproses retur.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!open) return null;

  const mappedDetail = detail
    ? {
        header: {
          no_transaksi: detail.no_transaksi,
          tanggal: detail.tanggal_transaksi,
          kasir: detail.user?.nama || "-",
          metode: detail.metode_bayar,
          total: Number(detail.total),
          status: normalizeStatus(
            detail.status || detail.status_transaksi || "LUNAS"
          ),
        },
        items:
          detail.transaksidetail?.map((item) => ({
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
  const status = mappedDetail?.header.status || "LUNAS";
  const statusStyle = STATUS_STYLE[status] || STATUS_STYLE.LUNAS;
  const isAdmin = user?.role === ROLE.ADMIN;
  const canVerify = isAdmin && status === "MENUNGGU_PEMBAYARAN";
  const canRetur = isAdmin && (status === "LUNAS" || status === "SELESAI");
  const isCanceled = status === "DIBATALKAN";

  return (
    <Modal open={open} onClose={onClose} width={500}>
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
              background: colors.primaryLight,
              color: colors.primary,
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
                color: colors.text,
              }}
            >
              Detail Transaksi
            </h3>
            <p
              style={{
                margin: "4px 0 0",
                color: colors.textSecondary,
                fontSize: 12,
              }}
            >
              {mappedDetail?.header.no_transaksi || transaksiId}
            </p>
          </div>
        </div>

        {mappedDetail && (
          <span
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {statusStyle.label}
          </span>
        )}
      </div>

      {loading && (
        <p style={{ color: colors.textSecondary, textAlign: "center", padding: "20px 0" }}>
          Memuat...
        </p>
      )}

      {!loading && detail && mappedDetail && (
        <>
          <div
            style={{
              background: colors.bgMuted,
              borderRadius: 12,
              padding: 16,
              marginBottom: 18,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: colors.textSecondary,
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
                  color: colors.text,
                  paddingBottom: 8,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {it.nama_produk} × {it.qty}
                </span>

                <span style={{ fontWeight: 700, color: colors.text }}>
                  Rp {formatRupiahPos(it.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div
            id="struk-print-content"
            style={{
              marginBottom: 18,
              background: colors.bgMuted,
              padding: 14,
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
            }}
          >
            <PosStruk data={strukData} />
          </div>

          {isCanceled && (
            <div
              style={{
                background: colors.dangerLight,
                border: `1px solid ${colors.danger}`,
                borderRadius: 10,
                padding: 12,
                marginBottom: 18,
                textAlign: "center",
                color: colors.danger,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Transaksi telah dibatalkan
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 16,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            {canVerify && (
              <button
                type="button"
                onClick={handleVerifikasi}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding: 12,
                  borderRadius: 10,
                  border: "none",
                  background: colors.warning,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 16 }} />
                Verifikasi Lunas
              </button>
            )}
            {canRetur && (
              <button
                type="button"
                onClick={handleRetur}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding: 12,
                  borderRadius: 10,
                  border: `1px solid ${colors.danger}`,
                  background: colors.bgCard,
                  color: colors.danger,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <ReplayIcon sx={{ fontSize: 16 }} />
                Retur Barang
              </button>
            )}
            <button
              type="button"
              onClick={handlePrint}
              style={{
                flex: 1,
                minWidth: 140,
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: colors.primary,
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
          </div>
        </>
      )}
    </Modal>
  );
};

export default DetailTransaksiModal;