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
        width: 360,
        flexShrink: 0,
        bgcolor: "#fff",
        borderRadius: 3,
        border: "1px solid #F1F5F9",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 120px)",
        position: "sticky",
        top: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Box sx={{ p: 1.5, borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 800, fontSize: 15, color: "#1E293B" }}>Keranjang</Typography>
        {cart.length > 0 && (
          <Typography onClick={clearCart} sx={{ fontSize: 11, fontWeight: 700, color: "#E91E63", cursor: "pointer", transition: "all 0.2s", "&:hover": { opacity: 0.7 } }}>
            BERSIHKAN
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
        {cart.length === 0 ? (
          <Typography sx={{ color: "#94A3B8", textAlign: "center", py: 4, fontSize: 13 }}>
            Keranjang kosong. Pilih produk atau scan barcode.
          </Typography>
        ) : (
          cart.map((item) => (
            <Box key={item.cartKey} sx={{ mb: 1.5, pb: 1.5, borderBottom: "1px solid #F8FAFC" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1E293B", lineHeight: 1.2 }}>{item.nama}</Typography>
                  <Typography sx={{ fontSize: 10, color: "#94A3B8" }}>{item.barcode || `ID: ${item.produk_id}`}</Typography>
                </Box>
                <IconButton size="small" onClick={() => removeFromCart(item.cartKey)} sx={{ color: "#EF4444", p: 0.4, flexShrink: 0 }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, marginTop: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, bgcolor: "#F8FAFC", borderRadius: 1, p: 0.3 }}>
                  <IconButton size="small" onClick={() => updateQty(item.cartKey, item.qty - 1)} disabled={item.qty <= 1} sx={{ p: 0.4, fontSize: 14 }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 24, textAlign: "center", fontWeight: 700, fontSize: 12 }}>{item.qty}</Typography>
                  <IconButton size="small" onClick={() => updateQty(item.cartKey, item.qty + 1)} disabled={item.qty >= item.stok} sx={{ bgcolor: "#E91E63", color: "#fff", p: 0.4, "&:hover": { bgcolor: "#BE185D" } }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#E91E63", whiteSpace: "nowrap" }}>Rp {formatRupiahPos(item.qty * item.harga)}</Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ p: 1.5, borderTop: "1px solid #F1F5F9", bgcolor: "#FAFBFC" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography sx={{ color: "#64748B", fontSize: 12 }}>Subtotal</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 12 }}>Rp {formatRupiahPos(subtotal)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
          <Typography
            onClick={() => setDiscountOpen(true)}
            sx={{ color: "#E91E63", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 0.3, transition: "all 0.2s", "&:hover": { opacity: 0.7 } }}
          >
            <LocalOfferOutlinedIcon sx={{ fontSize: 14 }} /> Diskon
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 12, color: diskonNominal > 0 ? "#10B981" : "#64748B" }}>
            - Rp {formatRupiahPos(diskonNominal)}
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: "#E91E63", textAlign: "right", mb: 1.5 }}>
          Rp {formatRupiahPos(totalBayar)}
        </Typography>
        <Typography sx={{ fontSize: 10, color: "#94A3B8", textAlign: "right", mb: 1.5 }}>Total Bayar</Typography>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={() => setPaymentOpen(true)}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 10,
            border: "none",
            background: cart.length === 0 ? "#F1F5F9" : "#E91E63",
            color: cart.length === 0 ? "#94A3B8" : "#fff",
            fontWeight: 800,
            fontSize: 13,
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
            boxShadow: cart.length === 0 ? "none" : "0 3px 12px rgba(233,30,99,0.25)",
            transition: "all 0.2s",
          }}
        >
          PROSES
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
