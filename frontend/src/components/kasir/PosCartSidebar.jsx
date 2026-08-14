import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
} from "@mui/material";
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


const DiscountInputCell = ({ value, onSave }) => {
  const [localValue, setLocalValue] = useState(value ?? 0);

  useEffect(() => {
    setLocalValue(value ?? 0);
  }, [value]);

  const handleBlur = () => {
    const numericValue = Math.max(0, parseFloat(localValue) || 0);
    onSave(numericValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <TextField
      size="small"
      type="number"
      value={localValue === 0 ? "" : localValue}
      placeholder="0"
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ mr: 0.3 }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#888" }}>
              Rp</span>
          </InputAdornment>
        ),
      }}
      sx={{
        width: "85px",
        "& .MuiOutlinedInput-root": {
          height: "28px",
          fontSize: "11px",
          fontWeight: 600,
          bgcolor: colors.bgCard,
          px: 0.8,
          "& fieldset": {
            borderColor: colors.border,
          },
        },
        "& .MuiInputBase-input": {
          p: 0,
          textAlign: "right",
          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&[type=number]": {
            MozAppearance: "textfield",
          },
        },
      }}
    />
  );
};

const PosCartSidebar = ({ onTransaksiSukses }) => {
  const {
    cart,
    subtotal,
    diskonNominal,
    totalBayar,
    updateQty,
    updateItemDiscount,
    removeFromCart,
    clearCart,
    diskon,
  } = usePos();

  const [discountOpen, setDiscountOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
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
      {/* Header Keranjang */}
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

      {/* Area Tabel Item */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
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
          <TableContainer>
            <Table size="small" stickyHeader aria-label="cart table">
              <TableHead
                sx={{
                  "& th": {
                    backgroundColor: colors.primary,
                    color:" #ffffff",
                    fontWeight: 700,
                    fontSize: 12,
                    py: 1.2,
                    borderBottom: `1px solid ${colors.border}`,
                  },
                }}
              >
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Nama Produk</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell align="center">Satuan</TableCell>
                  <TableCell align="center">Diskon</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item, index) => {
                  const itemDiscount = item.diskonNominal || 0;
                  const lineSubtotal = Math.max(0, item.qty * item.harga - itemDiscount);
                  console.log("ITEM CART:", item);
                  
                  return (
                    <TableRow key={item.cartKey}>
                      {/* No */}
                      <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{index + 1}</TableCell>

                      {/* Nama Produk & Detail */}
                      <TableCell sx={{ py: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: colors.textPrimary,
                            lineHeight: 1.3,
                          }}
                        >
                          {item.nama}
                        </Typography>
                      </TableCell>

                      {/* Qty */}
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `1px solid ${colors.border}`,
                            borderRadius: `${radii.sm}px`,
                            overflow: "hidden",
                            height: "30px",
                            bgcolor: colors.bgCard,
                          }}
                        >
                          <IconButton
                            size="small"
                            disabled={item.qty <= 1}
                            onClick={() => updateQty(item.cartKey, item.qty - 1)}
                            sx={{
                              width: 28,
                              height: 30,
                              borderRadius: 0,
                              color: item.qty <= 1
                                ? colors.textSecondary
                                : colors.text,
                              "&:hover": {
                                bgcolor: colors.bgMuted,
                              },
                            }}
                          >
                            <RemoveIcon sx={{ fontSize: 16 }} />
                          </IconButton>

                          <Typography
                            sx={{
                              minWidth: 30,
                              textAlign: "center",
                              fontSize: 12,
                              fontWeight: 700,
                              color: colors.text,
                            }}
                          >
                            {item.qty}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() => updateQty(item.cartKey, item.qty + 1)}
                            sx={{
                              width: 28,
                              height: 30,
                              borderRadius: 0,
                              color: colors.primary,
                              "&:hover": {
                                bgcolor: colors.bgMuted,
                              },
                            }}
                          >
                            <AddIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </TableCell>

                      {/* Satuan */}
                      <TableCell align="center" sx={{ fontSize: 13, color: colors.textSecondary }}>
                        {item.satuan?.nama || item.satuan || "-"}
                      </TableCell>

                      {/* Input Diskon */}
                      <TableCell align="center" sx={{ py: 0.8, px: 0.5, verticalAlign: "middle", width: "95px" }}>
                        <DiscountInputCell
                          value={item.diskonNominal}
                          onSave={(newDiscount) => updateItemDiscount(item.cartKey, newDiscount)}
                        />
                      </TableCell>

                      {/* Subtotal Item */}
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: 13, color: colors.primary }}>
                        Rp {formatRupiahPos(lineSubtotal)}
                      </TableCell>

                      {/* Aksi Hapus */}
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => removeFromCart(item.cartKey)}>
                          <DeleteOutlineIcon sx={{ fontSize: 18, color: colors.danger }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Footer Ringkasan Pembayaran */}
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
            <LocalOfferOutlinedIcon sx={{ fontSize: 14 }} /> Diskon Nota
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
            mb: 0.5,
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
