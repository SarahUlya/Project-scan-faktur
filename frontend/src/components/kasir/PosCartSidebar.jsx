import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { usePos } from "../../context/PosContext";
import { formatRupiahPos } from "../../utils/posCalculations";
import { colors, radii, spacing, typography } from "@/theme/designTokens";
import PosDiscountModal from "./PosDiscountModal";
import PosPaymentModal from "./PosPaymentModal";
import { printReceipt } from "@/utils/print/receiptPrinter";

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
        bgcolor: colors.bgCard,
        borderRadius: `${radii.md}px`,
        border: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 120px)",
        position: "sticky",
        top: 16,
        boxShadow: "0 2px 8px " + colors.shadow,
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 15, color: colors.text }}>
          Keranjang
        </Typography>
        {cart.length > 0 && (
          <Typography
            onClick={clearCart}
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: colors.primary,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { opacity: 0.7 },
            }}
          >
            BERSIHKAN
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
        {cart.length === 0 ? (
          <Typography
            sx={{
              color: colors.textSecondary,
              textAlign: "center",
              py: 4,
              fontSize: 13,
            }}
          >
            Keranjang kosong. Pilih produk atau scan barcode.
          </Typography>
        ) : (
          cart.map((item) => (
            <Box
              key={item.cartKey}
              sx={{
                mb: 1.5,
                pb: 1.5,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: colors.text,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.nama}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 10, color: colors.textSecondary }}
                  >
                    {item.barcode || `ID: ${item.produk_id}`}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => removeFromCart(item.cartKey)}
                  sx={{ color: colors.danger, p: 0.4, flexShrink: 0 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  marginTop: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.xs,
                    bgcolor: colors.bgMuted,
                    borderRadius: `${radii.sm}px`,
                    p: spacing.xs,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => updateQty(item.cartKey, item.qty - 1)}
                    disabled={item.qty <= 1}
                    sx={{ p: spacing.xs, fontSize: typography.body }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      minWidth: 24,
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: typography.body,
                    }}
                  >
                    {item.qty}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => updateQty(item.cartKey, item.qty + 1)}
                    disabled={item.qty >= item.stok}
                    sx={{
                      bgcolor: colors.primary,
                      color: colors.bgCard,
                      p: spacing.xs,
                      "&:hover": { bgcolor: colors.primaryHover },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 13,
                    color: colors.danger,
                    whiteSpace: "nowrap",
                  }}
                >
                  Rp {formatRupiahPos(item.qty * item.harga)}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box
        sx={{
          p: 1.5,
          borderTop: `1px solid ${colors.border}`,
          bgcolor: colors.bgMuted,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography sx={{ color: colors.textSecondary, fontSize: 12 }}>
            Subtotal
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
            Rp {formatRupiahPos(subtotal)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
            alignItems: "center",
          }}
        >
          <Typography
            onClick={() => setDiscountOpen(true)}
            sx={{
              color: colors.primary,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: spacing.xs,
              transition: "all 0.2s",
              "&:hover": { opacity: 0.7 },
            }}
          >
            <LocalOfferOutlinedIcon sx={{ fontSize: 14 }} /> Diskon
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 12,
              color: diskonNominal > 0 ? colors.success : colors.textSecondary,
            }}
          >
            - Rp {formatRupiahPos(diskonNominal)}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 20,
            color: colors.primary,
            textAlign: "right",
            mb: 1.5,
          }}
        >
          Rp {formatRupiahPos(totalBayar)}
        </Typography>
        <Typography
          sx={{
            fontSize: 10,
            color: colors.textSecondary,
            textAlign: "right",
            mb: 1.5,
          }}
        >
          Total Bayar
        </Typography>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={() => setPaymentOpen(true)}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: `${radii.md}px`,
            border: "none",
            background: cart.length === 0 ? colors.bg : colors.primary,
            color: cart.length === 0 ? colors.textSecondary : colors.bgCard,
            fontWeight: 800,
            fontSize: 13,
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
            boxShadow:
              cart.length === 0 ? "none" : `0 3px 12px ${colors.primary}40`,
            transition: "all 0.2s",
          }}
        >
          PROSES
        </button>
      </Box>

      <PosDiscountModal
        open={discountOpen}
        onClose={() => setDiscountOpen(false)}
      />
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
