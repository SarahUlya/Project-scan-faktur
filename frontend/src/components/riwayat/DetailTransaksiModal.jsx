import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import useTransaksiDb from "../../hooks/useTransaksiDb";
import PosStruk from "../kasir/PosStruk";
import { formatRupiahPos } from "../../utils/posCalculations";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { getUser, ROLE } from "../../auth/auth"; // ← PASTIKAN INI ADA
import {
  Box,
  Button,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  transitions,
} from "@/theme/designTokens";
import { 
  cancelTransaksiRequest, 
  approveCancellation, 
  rejectCancellation 
} from "../../api/transaksiApi";

const DetailTransaksiModal = ({ open, transaksiId, onClose, onRefresh }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const { getTransaksiDetail } = useTransaksiDb();
  const user = getUser(); // ← PASTIKAN INI ADA

  // ... rest of the code ...
  const loadDetail = async () => {
    if (!open || !transaksiId) return;
    setLoading(true);
    try {
      const d = await getTransaksiDetail(transaksiId);
      setDetail(d);
    } catch (error) {
      console.error("Error loading detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [open, transaksiId]);

  const handleCancelRequest = async () => {
    if (!user) {
      setSnackbar({ open: true, message: "Silakan login terlebih dahulu", severity: "error" });
      return;
    }

    if (!window.confirm("Apakah Anda yakin ingin mengajukan pembatalan transaksi ini?")) {
      return;
    }

    setActionLoading(true);
    try {
      await cancelTransaksiRequest(transaksiId, user.id);
      setSnackbar({ open: true, message: "Pengajuan pembatalan berhasil dikirim", severity: "success" });
      await loadDetail();
      if (onRefresh) onRefresh();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Gagal mengajukan pembatalan", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveCancellation = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menyetujui pembatalan transaksi ini?")) {
      return;
    }

    setActionLoading(true);
    try {
      await approveCancellation(transaksiId, user.id);
      setSnackbar({ open: true, message: "Transaksi berhasil dibatalkan", severity: "success" });
      await loadDetail();
      if (onRefresh) onRefresh();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Gagal membatalkan transaksi", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectCancellation = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menolak pengajuan pembatalan ini?")) {
      return;
    }

    setActionLoading(true);
    try {
      await rejectCancellation(transaksiId, user.id);
      setSnackbar({ open: true, message: "Pengajuan pembatalan ditolak", severity: "info" });
      await loadDetail();
      if (onRefresh) onRefresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrintStruk = () => {
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) {
      setSnackbar({ open: true, message: "Mohon izinkan pop-up untuk mencetak", severity: "warning" });
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
            * { 
              box-sizing: border-box; 
            }
            @media print {
              body { padding: 10px; }
            }
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

  const mappedDetail = detail ? {
    header: {
      no_transaksi: detail.no_transaksi,
      tanggal: detail.tanggal_transaksi,
      kasir: detail.user?.nama || "-",
      metode: detail.metode_bayar?.toUpperCase() || "TUNAI",
      subtotal: Number(detail.subtotal || detail.total),
      diskon_nominal: Number(detail.diskon_nominal || 0),
      total: Number(detail.total),
      uang_diterima: Number(detail.uang_diterima || 0),
      kembalian: Number(detail.kembalian || 0),
      status: detail.status || detail.status_transaksi || "SELESAI",
    },
    items: detail.transaksidetail?.map((item) => ({
      id: item.id_transaksi_detail,
      nama_produk: item.produk?.nama_produk || "-",
      qty: Number(item.qty),
      harga: Number(item.harga_jual),
      subtotal: Number(item.subtotal),
    })) || [],
  } : null;

  const isCancelled = detail?.status === "DIBATALKAN";
  const isPendingCancellation = detail?.status === "MENUNGGU_PEMBATALAN";
  const isAdmin = user?.role === ROLE.ADMIN;
  const isKasirOrStaff = user?.role === ROLE.KASIR || user?.role === ROLE.STAFF;

  const getStatusChip = () => {
    if (isCancelled) {
      return (
        <Chip
          label="DIBATALKAN"
          icon={<CancelIcon sx={{ fontSize: 16 }} />}
          sx={{
            backgroundColor: colors.danger,
            color: "white",
            fontWeight: 600,
            fontSize: 11,
            borderRadius: 1.5,
            "& .MuiChip-icon": { color: "white" },
          }}
        />
      );
    }
    if (isPendingCancellation) {
      return (
        <Chip
          label="MENUNGGU PERSETUJUAN"
          icon={<CloseIcon sx={{ fontSize: 16 }} />}
          sx={{
            backgroundColor: colors.warning,
            color: "white",
            fontWeight: 600,
            fontSize: 11,
            borderRadius: 1.5,
            "& .MuiChip-icon": { color: "white" },
          }}
        />
      );
    }
    return (
      <Chip
        label="SELESAI"
        icon={<CheckIcon sx={{ fontSize: 14 }} />}
        sx={{
          backgroundColor: colors.success,
          color: "white",
          fontWeight: 600,
          fontSize: 11,
          borderRadius: 1.5,
          "& .MuiChip-icon": { color: "white" },
        }}
      />
    );
  };

  return (
    <>
      <Modal open={open} onClose={onClose} width={500}>
        <Box sx={{ position: "relative" }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && detail && mappedDetail && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: colors.primaryLight,
                    color: colors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PrintIcon />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 18, color: colors.text }}>
                    Detail Transaksi
                  </Typography>
                  <Typography sx={{ color: colors.textSecondary, fontSize: 12 }}>
                    ID: {transaksiId}
                  </Typography>
                </Box>
                {getStatusChip()}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 1 }}>
                  <strong>Waktu:</strong> {new Date(detail.tanggal_transaksi).toLocaleString("id-ID")}
                </Typography>
                <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
                  <strong>Kasir:</strong> {detail.user?.nama || "-"}
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: colors.bgCard,
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    mb: 1.5,
                    letterSpacing: 0.5,
                  }}
                >
                  Rincian Barang
                </Typography>
                {mappedDetail.items.map((it) => (
                  <Box
                    key={it.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      mb: 1,
                      color: colors.text,
                      pb: 1,
                      borderBottom: `1px solid ${colors.border}`,
                      "&:last-child": { borderBottom: "none", mb: 0, pb: 0 },
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {it.nama_produk} × {it.qty}
                    </span>
                    <span style={{ fontWeight: 600, color: colors.text }}>
                      Rp {formatRupiahPos(it.subtotal)}
                    </span>
                  </Box>
                ))}
              </Box>

              <Box
                id="struk-print-content"
                sx={{
                  mb: 2,
                  bgcolor: colors.bgCard,
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <PosStruk data={{ header: mappedDetail.header, items: mappedDetail.items }} />
              </Box>

              {isCancelled && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Transaksi ini telah dibatalkan pada {detail.tanggal_pembatalan ? 
                    new Date(detail.tanggal_pembatalan).toLocaleString("id-ID") : ""}
                  {detail.dibatalkan_oleh && ` oleh ${detail.dibatalkan_oleh}`}
                </Alert>
              )}

              {isPendingCancellation && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Transaksi ini sedang menunggu persetujuan pembatalan.
                  {detail.alasan_pembatalan && ` Alasan: ${detail.alasan_pembatalan}`}
                </Alert>
              )}

              <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<PrintIcon />}
                  onClick={handlePrintStruk}
                  sx={{
                    flex: 1,
                    minWidth: 120,
                    fontWeight: 600,
                    background: "linear-gradient(135deg, color.textOnDark)",
                    "&:hover": {
                      background: "linear-gradient(135deg, color.textOnDark)",
                    },
                  }}
                >
                  Cetak Ulang
                </Button>

                {!isCancelled && !isPendingCancellation && isKasirOrStaff && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelRequest}
                    disabled={actionLoading}
                    sx={{ flex: 1, minWidth: 120, fontWeight: 600 }}
                  >
                    Ajukan Pembatalan
                  </Button>
                )}

                {isPendingCancellation && isAdmin && (
                  <>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleApproveCancellation}
                      disabled={actionLoading}
                      sx={{ flex: 1, minWidth: 120, fontWeight: 600 }}
                    >
                      Setujui
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleRejectCancellation}
                      disabled={actionLoading}
                      sx={{ flex: 1, minWidth: 120, fontWeight: 600 }}
                    >
                      Tolak
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DetailTransaksiModal;