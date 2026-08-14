import React from "react";
import Modal from "../ui/Modal";
import AlertIcon from "@mui/icons-material/WarningAmber";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
} from "@/theme/designTokens";

const CancelTransactionConfirmModal = ({
  open,
  onConfirm,
  onCancel,
  transaksiId,
  isLoading = false,
}) => {
  return (
    <Modal open={open} onClose={onCancel} width={420}>
      {/* Header Icon */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            width: 70,
            height: 40,
            borderRadius: 14,
            background: colors.dangerLight,
            color: colors.danger,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <AlertIcon sx={{ fontSize: 32 }} />
        </div>
        <h3
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 18,
            color: colors.text,
            marginBottom: 6,
          }}
        >
          Batalkan Transaksi?
        </h3>
        <p
          style={{
            margin: 0,
            color: colors.textSecondary,
            fontSize: 13,
            marginTop: 6,
          }}
        >
          Tindakan ini tidak dapat dibatalkan. Transaksi akan ditandai sebagai
          "dibatalkan" dan tidak dapat diubah.
        </p>
      </div>

      {/* Alert Box */}
      <div
        style={{
          background: colors.dangerLight,
          border: "1px solid " + colors.danger,
          borderRadius: 10,
          padding: 12,
          marginBottom: 22,
          color: colors.danger,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        ⚠️ Pastikan Anda yakin ingin membatalkan transaksi ini sebelum melanjutkan.
      </div>

      {/* Transaksi ID Info */}
      <div
        style={{
          background: colors.bgMuted,
          borderRadius: 10,
          padding: 12,
          marginBottom: 22,
          border: "1px solid " + colors.border,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94A3B8",
            textTransform: "uppercase",
            marginBottom: 6,
            letterSpacing: 0.5,
          }}
        >
          ID Transaksi
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 13,
            color: "#1E293B",
          }}
        >
          {transaksiId}
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #E2E8F0",
            background: "#F8FAFC",
            color: "#1E293B",
            fontWeight: 700,
            fontSize: 14,
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: colors.danger,
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: isLoading ? 0.6 : 1,
            boxShadow: isLoading ? "none" : "0 4px 12px rgba(220, 38, 38, 0.25)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = colors.danger;
              e.target.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background = colors.danger;
              e.target.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.25)";
            }
          }}
        >
          {isLoading ? "Memproses..." : "Ya, Batalkan Transaksi"}
        </button>
      </div>
    </Modal>
  );
};

export default CancelTransactionConfirmModal;
