import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const formatRupiah = (val) => {
  const n = Number(val) || 0;
  return n.toLocaleString("id-ID");
};

const safeString = (val) => {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    return val.nama || val.kode || val.label || String(val.id || "");
  }
  return String(val);
};

/* ══════════════════════════════════════════════════════════════════
 * QTY INPUT
 * ══════════════════════════════════════════════════════════════════ */
const QtyInput = ({
  value,
  max,
  onCommit,
  onDecrement,
  onRemove,
  onExceedStock,
}) => {
  const [localValue, setLocalValue] = useState(String(value || 1));
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalValue(String(value || 1));
  }, [value]);

  const commit = () => {
    const parsed = parseInt(localValue, 10);
    let newQty = isNaN(parsed) ? 1 : parsed;

    if (newQty < 1) newQty = 1;
    if (max && newQty > max) {
      newQty = max;
      if (onExceedStock) onExceedStock(max);
    }

    if (newQty === value) {
      setLocalValue(String(value));
      return;
    }
    onCommit(newQty);
    setLocalValue(String(newQty));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setLocalValue(String(value));
      inputRef.current?.blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = (Number(value) || 1) + 1;
      if (max && next > max) {
        if (onExceedStock) onExceedStock(max);
        return;
      }
      onCommit(next);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max((Number(value) || 1) - 1, 1);
      if (next < 1) onRemove();
      else onCommit(next);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
      }}
    >
      <IconButton
        size="small"
        onClick={onDecrement}
        sx={{
          bgcolor: "#FCE4EC",
          color: "#D81B60",
          borderRadius: "4px",
          p: "2px",
          "&:hover": { bgcolor: "#F8BBD0" },
        }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <TextField
        inputRef={inputRef}
        value={localValue}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, "");
          setLocalValue(raw);
        }}
        onFocus={(e) => e.target.select()}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        variant="outlined"
        size="small"
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
          style: {
            textAlign: "center",
            fontWeight: 700,
            fontSize: 13,
            padding: "4px 0",
          },
        }}
        sx={{
          width: "50px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            bgcolor: "#FFFFFF",
            fontSize: 13,
            padding: 0,
            "& fieldset": { borderColor: "#E2E8F0" },
            "&:hover fieldset": { borderColor: "#CBD5E1" },
            "&.Mui-focused fieldset": {
              borderColor: "#D81B60",
              borderWidth: "1.5px",
            },
          },
          "& .MuiOutlinedInput-input": {
            textAlign: "center",
            padding: "4px 0",
            height: "22px",
            width: "100%",
          },
        }}
      />

      <IconButton
        size="small"
        onClick={() => {
          const next = (Number(value) || 1) + 1;
          if (max && next > max) {
            if (onExceedStock) onExceedStock(max);
            return;
          }
          onCommit(next);
        }}
        sx={{
          bgcolor: "#FCE4EC",
          color: "#D81B60",
          borderRadius: "4px",
          p: "2px",
          "&:hover": { bgcolor: "#F8BBD0" },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

/* ══════════════════════════════════════════════════════════════════
 * MAIN
 * ══════════════════════════════════════════════════════════════════ */
const KeranjangTable = ({
  cart,
  updateQuantity,
  removeFromCart,
  onExceedStock,
}) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        flex: 1,
        borderRadius: "10px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: "#FCE4EC" }}>
          <TableRow>
            <TableCell width="6%" sx={{ fontWeight: 700, color: "#D81B60" }}>
              #
            </TableCell>
            <TableCell width="40%" sx={{ fontWeight: 700, color: "#D81B60" }}>
              PRODUK
            </TableCell>
            <TableCell
              width="18%"
              align="right"
              sx={{ fontWeight: 700, color: "#D81B60" }}
            >
              HARGA
            </TableCell>
            <TableCell
              width="18%"
              align="center"
              sx={{ fontWeight: 700, color: "#D81B60" }}
            >
              QTY
            </TableCell>
            <TableCell
              width="18%"
              align="right"
              sx={{ fontWeight: 700, color: "#D81B60" }}
            >
              SUBTOTAL
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                sx={{ py: 8, color: "#94A3B8" }}
              >
                Keranjang belanja masih kosong.
              </TableCell>
            </TableRow>
          ) : (
            cart.map((item, index) => {
              const hargaAsli = Number(item.harga || item.harga_jual || 0);
              const diskonPerUnit = Number(item.diskon_item) || 0;
              const hargaEfektif = Math.max(0, hargaAsli - diskonPerUnit);
              const adaDiskon = diskonPerUnit > 0;
              const subtotalItem = hargaEfektif * item.qty;

              let batchNo = "-";
              if (
                typeof item.batch === "string" ||
                typeof item.batch === "number"
              )
                batchNo = item.batch;
              else if (item.batch?.no_batch) batchNo = item.batch.no_batch;
              else if (item.no_batch)
                batchNo =
                  typeof item.no_batch === "object"
                    ? item.no_batch?.no_batch || "-"
                    : item.no_batch;

              let expDate = "-";
              if (typeof item.exp === "string" || typeof item.exp === "number")
                expDate = item.exp;
              else if (
                typeof item.expired === "string" ||
                typeof item.expired === "number"
              )
                expDate = item.expired;
              else if (item.expired_date)
                expDate =
                  typeof item.expired_date === "object"
                    ? item.expired_date?.expired_date || "-"
                    : item.expired_date;
              else if (item.batch?.expired_date)
                expDate = item.batch.expired_date;

              const satuan = safeString(item.satuan?.nama || item.satuan || "");
              const maxStok = Number(item.stok) || 9999;

              return (
                <TableRow key={item.id_produk || index} hover>
                  <TableCell sx={{ color: "#64748B", fontWeight: 600 }}>
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#1E293B",
                        fontSize: 14,
                        mb: 0.25,
                      }}
                    >
                      {item.nama_produk || item.nama}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#94A3B8" }}>
                      Batch: {String(batchNo)} • Exp: {String(expDate)} • Sisa
                      Stok: {item.stok}
                      {satuan && ` ${satuan}`}
                    </Typography>
                  </TableCell>

                  {/* HARGA — tampil coret kalau ada diskon */}
                  <TableCell
                    align="right"
                    sx={{ color: "#475569", fontWeight: 600, fontSize: 13 }}
                  >
                    {adaDiskon ? (
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#94A3B8",
                            textDecoration: "line-through",
                          }}
                        >
                          Rp {formatRupiah(hargaAsli)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: "#D81B60",
                            fontWeight: 700,
                          }}
                        >
                          Rp {formatRupiah(hargaEfektif)}
                        </Typography>
                        <Chip
                          label={
                            item.diskon_tipe === "%"
                              ? `-${item.diskon_input}%`
                              : `-Rp ${formatRupiah(item.diskon_input)}`
                          }
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: 9,
                            fontWeight: 700,
                            bgcolor: "#FCE4EC",
                            color: "#D81B60",
                            mt: 0.3,
                          }}
                        />
                      </Box>
                    ) : (
                      `Rp ${formatRupiah(hargaAsli)}`
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <QtyInput
                      value={item.qty}
                      max={maxStok}
                      onCommit={(newQty) =>
                        updateQuantity(item.id_produk, newQty)
                      }
                      onDecrement={() => {
                        if (item.qty > 1) {
                          updateQuantity(item.id_produk, item.qty - 1);
                        } else {
                          removeFromCart(item.id_produk);
                        }
                      }}
                      onRemove={() => removeFromCart(item.id_produk)}
                      onExceedStock={onExceedStock}
                    />
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, color: "#1E293B" }}
                  >
                    Rp {formatRupiah(subtotalItem)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KeranjangTable;