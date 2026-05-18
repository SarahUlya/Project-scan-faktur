import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { usePos } from "../../context/PosContext";
import { formatRupiahPos } from "../../utils/posCalculations";
import PosDiscountModal from "./PosDiscountModal";
import PosPaymentModal from "./PosPaymentModal";

const PosCartSidebar = ({ onTransaksiSukses }) => {
  const {
    cart,
    subtotal,
    diskonNominal,
    totalBayar,
    updateQty,
    removeFromCart,
    clearCart,
    diskon,
  } = usePos();

  const [discountOpen, setDiscountOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <Box
      sx={{
        width: 380,
        flexShrink: 0,
        bgcolor: "#fff",
        borderRadius: 4,
        border: "1px solid #F1F5F9",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 120px)",
        position: "sticky",
        top: 16,
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#1E293B" }}>Keranjang Belanja</Typography>
        {cart.length > 0 && (
          <Typography onClick={clearCart} sx={{ fontSize: 12, fontWeight: 700, color: "#E91E63", cursor: "pointer" }}>
            BERSIHKAN
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {cart.length === 0 ? (
          <Typography sx={{ color: "#94A3B8", textAlign: "center", py: 4, fontSize: 14 }}>
            Keranjang masih kosong. Pilih produk atau scan barcode.
          </Typography>
        ) : (
          cart.map((item) => (
            <Box key={item.cartKey} sx={{ mb: 2, pb: 2, borderBottom: "1px solid #F8FAFC" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#1E293B" }}>{item.nama}</Typography>
              <Typography sx={{ fontSize: 11, color: "#94A3B8", mb: 1 }}>{item.barcode || item.produk_id}</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <IconButton size="small" onClick={() => updateQty(item.cartKey, item.qty - 1)} disabled={item.qty <= 1} sx={{ border: "1px solid #E2E8F0" }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 28, textAlign: "center", fontWeight: 700 }}>{item.qty}</Typography>
                  <IconButton size="small" onClick={() => updateQty(item.cartKey, item.qty + 1)} disabled={item.qty >= item.stok} sx={{ bgcolor: "#E91E63", color: "#fff", "&:hover": { bgcolor: "#BE185D" } }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14 }}>Rp {formatRupiahPos(item.qty * item.harga)}</Typography>
                  <IconButton size="small" onClick={() => removeFromCart(item.cartKey)} sx={{ color: "#EF4444", p: 0.5 }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid #F1F5F9" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>Subtotal</Typography>
          <Typography sx={{ fontWeight: 600 }}>Rp {formatRupiahPos(subtotal)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
          <Typography
            onClick={() => setDiscountOpen(true)}
            sx={{ color: "#E91E63", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <LocalOfferOutlinedIcon sx={{ fontSize: 16 }} /> Diskon
          </Typography>
          <Typography sx={{ fontWeight: 600, color: diskonNominal > 0 ? "#10B981" : "#64748B" }}>
            - Rp {formatRupiahPos(diskonNominal)}
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: "#E91E63", textAlign: "right", mb: 2 }}>
          Rp {formatRupiahPos(totalBayar)}
        </Typography>
        <Typography sx={{ fontSize: 11, color: "#94A3B8", textAlign: "right", mb: 2 }}>Total Bayar</Typography>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={() => setPaymentOpen(true)}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 14,
            border: "none",
            background: cart.length === 0 ? "#F1F5F9" : "#E91E63",
            color: cart.length === 0 ? "#94A3B8" : "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
            boxShadow: cart.length === 0 ? "none" : "0 4px 16px rgba(233,30,99,0.3)",
          }}
        >
          PROSES TRANSAKSI
        </button>
      </Box>

      <PosDiscountModal open={discountOpen} onClose={() => setDiscountOpen(false)} />
      <PosPaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={(result) => {
          setPaymentOpen(false);
          onTransaksiSukses?.(result);
        }}
      />
    </Box>
  );
};

export default PosCartSidebar;
