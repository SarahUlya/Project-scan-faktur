import React, { useEffect, useRef } from "react";
import Modal from "../ui/Modal";
import { Box } from "@mui/material"; // ⚡ FIX: import Box yang hilang
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PrintIcon from "@mui/icons-material/Print";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { formatRupiahPos } from "../../utils/posCalculations";
import { radii } from "@/theme/designTokens";
import { printReceipt } from "@/utils/print/receiptPrinter"; // ⚡ FIX: import printReceipt

const PosSuccessModal = ({ open, data, onClose, onNewTransaction }) => {
  const hasPrintedRef = useRef(false);

  // ⚡ AUTO PRINT — jalan sekali saat modal dibuka
  useEffect(() => {
    if (!open) {
      hasPrintedRef.current = false;
      return;
    }
    if (data?.cetakStruk && data?.receiptData && !hasPrintedRef.current) {
      hasPrintedRef.current = true;
      // Delay kecil biar modal selesai render dulu
      setTimeout(() => {
        try {
          printReceipt(data.receiptData);
        } catch (err) {
          console.error("[Auto Print] Gagal:", err);
        }
      }, 400);
    }
  }, [open, data]);

  if (!open || !data) return null;

  // Handler Tombol Cetak Struk (manual, kalau user klik ulang)
  const handlePrint = () => {
    if (data?.receiptData) {
      try {
        printReceipt(data.receiptData);
      } catch (err) {
        console.error("[Manual Print] Gagal:", err);
      }
    } else {
      alert("Data struk tidak tersedia.");
    }
  };

  // Handler Tombol Kirim WhatsApp
  const handleSendWA = () => {
    const itemsList = (data.cart || [])
      .map(
        (c) =>
          `• ${c.qty}x ${c.nama || c.nama_produk} (Rp ${formatRupiahPos(
            c.qty * (c.harga || c.harga_jual),
          )})`,
      )
      .join("\n");

    const message = encodeURIComponent(
      `Halo! Terima kasih telah berbelanja di Apotek Ampuh Tayu.\n\n` +
        `*No. Transaksi:* ${data.no_transaksi || "TRX-SUKSES"}\n` +
        `*Tanggal:* ${new Date().toLocaleDateString("id-ID")}\n` +
        `*Kasir:* ${data.kasir || "Admin Utama"}\n\n` +
        `*Ringkasan Item:*\n${itemsList}\n\n` +
        `*Total Belanja:* Rp ${formatRupiahPos(
          data.total || data.total_bayar,
        )}\n` +
        `*Metode:* ${data.metode || "TUNAI"}\n` +
        `Status: *LUNAS*\n\n` +
        `Semoga lekas sembuh!`,
    );

    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  return (
    <Modal open={open} onClose={onClose} width={560}>
      <div style={{ padding: "10px 10px 0 10px" }}>
        {/* HEADER ICON & TITLE */}
        <div
          className="no-print"
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "#E8F5E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px auto",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 38, color: "#2E7D32" }} />
          </Box>
          <h2
            style={{
              margin: "0 0 4px",
              fontWeight: 800,
              fontSize: 22,
              color: "#1E293B",
            }}
          >
            Transaksi Berhasil
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
            Terima kasih atas pembelian Anda di Apotek Ampuh Tayu
          </p>
        </div>

        {/* CARD DETAIL TRANSAKSI & PEMBAYARAN */}
        <div
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#1E293B",
                marginBottom: 10,
              }}
            >
              Detail Transaksi
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#64748B" }}>ID Transaksi</span>
              <span style={{ fontWeight: 600, color: "#1E293B" }}>
                {data.no_transaksi || data.kode_transaksi || "TRX-SUKSES"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#64748B" }}>Waktu</span>
              <span style={{ fontWeight: 600, color: "#1E293B" }}>
                {new Date().toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                ,{" "}
                {new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#64748B" }}>Kasir</span>
              <span style={{ fontWeight: 600, color: "#1E293B" }}>
                {data.kasir || "Admin Utama"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span style={{ color: "#64748B" }}>Pelanggan</span>
              <span style={{ fontWeight: 600, color: "#1E293B" }}>Umum</span>
            </div>
          </div>

          <div style={{ width: "1px", background: "#E2E8F0" }} />

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#1E293B",
                marginBottom: 10,
              }}
            >
              Pembayaran
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#64748B" }}>Total Belanja</span>
              <span style={{ fontWeight: 700, color: "#1E293B" }}>
                Rp {formatRupiahPos(data.total || data.total_bayar)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
                alignItems: "center",
              }}
            >
              <span style={{ color: "#64748B" }}>Metode</span>
              <span
                style={{
                  fontWeight: 600,
                  color: "#1E293B",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {data.metode || "TUNAI"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 8,
                alignItems: "center",
              }}
            >
              <span style={{ color: "#64748B" }}>Status</span>
              <span
                style={{
                  background: "#E8F5E9",
                  color: "#2E7D32",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                LUNAS
              </span>
            </div>
            <div
              style={{
                borderTop: "1px dashed #CBD5E1",
                paddingTop: 6,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
              }}
            >
              <span style={{ color: "#94A3B8" }}>Reff</span>
              <span style={{ color: "#64748B", fontFamily: "monospace" }}>
                QR-{Math.floor(1000000000 + Math.random() * 9000000000)}
              </span>
            </div>
          </div>
        </div>

        {/* RINGKASAN ITEM */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#1E293B",
              marginBottom: 8,
            }}
          >
            Ringkasan Item (
            {(data.cart || []).reduce((acc, i) => acc + (i.qty || 0), 0)})
          </div>
          <div
            style={{
              maxHeight: "160px",
              overflowY: "auto",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              background: "#FFFFFF",
            }}
          >
            {(data.cart || []).map((item, index) => {
              const itemName = item.nama || item.nama_produk || "Produk";
              const itemQty = item.qty || 1;
              const itemHarga = item.harga || item.harga_jual || 0;
              const itemDiskon = (item.diskon_item || 0) * itemQty;
              const itemSubtotal = Math.max(0, itemHarga * itemQty - itemDiskon);

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderBottom:
                      index < data.cart.length - 1
                        ? "1px solid #F1F5F9"
                        : "none",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "#475569" }}>
                    <strong style={{ color: "#1E293B" }}>{itemQty}x</strong>{" "}
                    {itemName}
                  </span>
                  <span style={{ fontWeight: 700, color: "#1E293B" }}>
                    Rp {formatRupiahPos(itemSubtotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOMBOL AKSI BAWAH */}
        <div
          className="no-print"
          style={{
            display: "flex",
            gap: 10,
            borderTop: "1px solid #E2E8F0",
            paddingTop: 16,
          }}
        >
          <button
            type="button"
            onClick={handlePrint}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: radii.sm,
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#475569",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <PrintIcon sx={{ fontSize: 18 }} />
            Cetak Ulang
          </button>

          <button
            type="button"
            onClick={handleSendWA}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: radii.sm,
              border: "1px solid #A5D6A7",
              background: "#F1F8F5",
              color: "#2E7D32",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 18 }} />
            Kirim WA
          </button>

          <button
            type="button"
            onClick={onNewTransaction}
            style={{
              flex: 1.2,
              padding: "12px 14px",
              borderRadius: radii.sm,
              border: "none",
              background: "#D81B60",
              color: "#FFFFFF",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            Transaksi Baru
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PosSuccessModal;