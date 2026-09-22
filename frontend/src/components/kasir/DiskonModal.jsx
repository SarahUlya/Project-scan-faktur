import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  MenuItem,
  Paper,
  Chip,
} from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/* ══════════════════════════════════════════════════════════════════
 * HELPERS
 * ══════════════════════════════════════════════════════════════════ */
const formatRupiah = (val) => {
  const n = Number(val) || 0;
  return n.toLocaleString("id-ID");
};

/* ══════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ══════════════════════════════════════════════════════════════════ */
const DiskonModal = ({
  open,
  onClose,
  kategoriDiskon,
  setKategoriDiskon,
  tipeDiskon,
  setTipeDiskon,
  inputDiskon,
  setInputDiskon,
  subtotal,
  setDiskonNominal,
  handleApplyDiskon,
  // ⚡ Props baru untuk Per Item
  cart = [],
  onApplyItemDiscount,
  onRemoveItemDiscount,
}) => {
  // State untuk tab Per Item
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemTipe, setItemTipe] = useState("Rp");
  const [itemNilai, setItemNilai] = useState("");

  // Hitung total diskon dari per item (untuk display summary)
  const totalDiskonItem = useMemo(() => {
    return cart.reduce((acc, it) => {
      return acc + (Number(it.diskon_item) || 0) * Number(it.qty || 0);
    }, 0);
  }, [cart]);

  const handleOpenItemForm = (item) => {
    const id = item.id_produk || item.id;
    setSelectedItemId(id);
    setItemTipe(item.diskon_tipe || "Rp");
    setItemNilai(item.diskon_input ? String(item.diskon_input) : "");
  };

  const handleApplyItem = (item) => {
    const id = item.id_produk || item.id;
    const nilai = Number(itemNilai) || 0;

    if (nilai <= 0) return;

    onApplyItemDiscount?.(id, { tipe: itemTipe, nilai });
    // Close form
    setSelectedItemId(null);
    setItemNilai("");
  };

  const handleRemoveItem = (item) => {
    const id = item.id_produk || item.id;
    onRemoveItemDiscount?.(id);
    if (selectedItemId === id) {
      setSelectedItemId(null);
      setItemNilai("");
    }
  };

  // Hitung preview diskon per item
  const getPreview = (item) => {
    const hargaAsli = Number(item.harga || item.harga_jual || 0);
    const nilai = Number(itemNilai) || 0;
    let diskonPerUnit = 0;

    if (itemTipe === "%") {
      diskonPerUnit = Math.round(hargaAsli * (nilai / 100));
    } else {
      diskonPerUnit = nilai;
    }

    if (diskonPerUnit > hargaAsli) diskonPerUnit = hargaAsli;
    if (diskonPerUnit < 0) diskonPerUnit = 0;

    return {
      hargaAsli,
      diskonPerUnit,
      hargaAkhir: Math.max(0, hargaAsli - diskonPerUnit),
      subtotalBaru: Math.max(0, hargaAsli - diskonPerUnit) * Number(item.qty || 1),
    };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          width: kategoriDiskon === "item" ? "560px" : "480px",
          p: 0,
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 2.5,
          pb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              bgcolor: "#FFF0F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DiscountIcon sx={{ color: "#D81B60", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 16,
                color: "#1E293B",
                lineHeight: 1.2,
              }}
            >
              Terapkan Diskon
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#64748B" }}>
              Tentukan potongan untuk nota atau per item
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#94A3B8" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* TAB SELECTOR */}
        <Box
          sx={{
            display: "flex",
            bgcolor: "#F1F5F9",
            p: "4px",
            borderRadius: "10px",
            mb: 2.5,
          }}
        >
          <Button
            fullWidth
            size="small"
            onClick={() => setKategoriDiskon("nota")}
            sx={{
              bgcolor: kategoriDiskon === "nota" ? "#FFFFFF" : "transparent",
              color: kategoriDiskon === "nota" ? "#1E293B" : "#64748B",
              fontWeight: 700,
              borderRadius: "8px",
              textTransform: "none",
              boxShadow:
                kategoriDiskon === "nota"
                  ? "0 1px 3px rgba(0,0,0,0.1)"
                  : "none",
            }}
          >
            Diskon Nota
          </Button>
          <Button
            fullWidth
            size="small"
            onClick={() => setKategoriDiskon("item")}
            sx={{
              bgcolor: kategoriDiskon === "item" ? "#FFFFFF" : "transparent",
              color: kategoriDiskon === "item" ? "#1E293B" : "#64748B",
              fontWeight: 700,
              borderRadius: "8px",
              textTransform: "none",
              boxShadow:
                kategoriDiskon === "item"
                  ? "0 1px 3px rgba(0,0,0,0.1)"
                  : "none",
            }}
          >
            Per Item
          </Button>
        </Box>

        {/* ══════════════════════════════════════════════════════════
            TAB: DISKON NOTA
            ══════════════════════════════════════════════════════════ */}
        {kategoriDiskon === "nota" && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#64748B",
                  textTransform: "uppercase",
                }}
              >
                Pilihan Diskon Cepat
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => setTipeDiskon("%")}
                  sx={{
                    minWidth: 28,
                    height: 24,
                    fontSize: 11,
                    fontWeight: 800,
                    bgcolor:
                      tipeDiskon === "%" ? "#FFF0F5" : "transparent",
                    color: tipeDiskon === "%" ? "#D81B60" : "#64748B",
                  }}
                >
                  %
                </Button>
                <Button
                  size="small"
                  onClick={() => setTipeDiskon("Rp")}
                  sx={{
                    minWidth: 28,
                    height: 24,
                    fontSize: 11,
                    fontWeight: 800,
                    bgcolor:
                      tipeDiskon === "Rp" ? "#FFF0F5" : "transparent",
                    color: tipeDiskon === "Rp" ? "#D81B60" : "#64748B",
                  }}
                >
                  Rp
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
              {[5, 10, 15, 20].map((num) => (
                <Button
                  key={num}
                  variant="outlined"
                  onClick={() => {
                    setTipeDiskon("%");
                    setInputDiskon(String(num));
                  }}
                  sx={{
                    flex: 1,
                    borderColor: "#E2E8F0",
                    color: "#334155",
                    fontWeight: 700,
                    fontSize: 13,
                    py: 1,
                    borderRadius: "8px",
                    "&:hover": {
                      borderColor: "#D81B60",
                      bgcolor: "#FFF0F5",
                    },
                  }}
                >
                  {num}%
                </Button>
              ))}
              <Button
                variant="outlined"
                onClick={() => {
                  setTipeDiskon("Rp");
                  setInputDiskon("5000");
                }}
                sx={{
                  flex: 1.2,
                  borderColor: "#E2E8F0",
                  color: "#334155",
                  fontWeight: 700,
                  fontSize: 12,
                  py: 1,
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#D81B60",
                    bgcolor: "#FFF0F5",
                  },
                }}
              >
                Rp5.000
              </Button>
            </Box>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Nilai Potongan
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                select
                size="small"
                value={tipeDiskon}
                onChange={(e) => setTipeDiskon(e.target.value)}
                sx={{
                  width: "90px",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                }}
              >
                <MenuItem value="Rp">Rp</MenuItem>
                <MenuItem value="%">%</MenuItem>
              </TextField>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder={
                  tipeDiskon === "%" ? "Contoh: 10" : "Contoh: 15000"
                }
                value={inputDiskon}
                onChange={(e) => setInputDiskon(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                }}
                autoFocus
              />
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "#F8FAFC",
                borderRadius: "10px",
                border: "1px solid #E2E8F0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                  fontSize: 13,
                }}
              >
                <Typography sx={{ color: "#64748B" }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 600, color: "#1E293B" }}>
                  Rp{formatRupiah(subtotal)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                  fontSize: 13,
                }}
              >
                <Typography sx={{ color: "#64748B" }}>Diskon</Typography>
                <Typography sx={{ fontWeight: 600, color: "#D81B60" }}>
                  - Rp
                  {tipeDiskon === "%"
                    ? formatRupiah(
                        (subtotal * (Number(inputDiskon) || 0)) / 100
                      )
                    : formatRupiah(Number(inputDiskon) || 0)}
                </Typography>
              </Box>
            </Paper>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB: DISKON PER ITEM
            ══════════════════════════════════════════════════════════ */}
        {kategoriDiskon === "item" && (
          <>
            {cart.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: "#F8FAFC",
                  borderRadius: "10px",
                  border: "1px dashed #E2E8F0",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: 13, color: "#64748B" }}>
                  Keranjang masih kosong. Tambahkan produk dulu.
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  maxHeight: 380,
                  overflowY: "auto",
                  pr: 0.5,
                }}
              >
                {cart.map((item, idx) => {
                  const id = item.id_produk || item.id;
                  const isFormOpen = selectedItemId === id;
                  const sudahDiskon = (Number(item.diskon_item) || 0) > 0;
                  const hargaAsli = Number(
                    item.harga || item.harga_jual || 0
                  );
                  const preview = isFormOpen ? getPreview(item) : null;

                  return (
                    <Paper
                      key={id || idx}
                      elevation={0}
                      sx={{
                        border: `1px solid ${
                          sudahDiskon ? "#D81B60" : "#E2E8F0"
                        }`,
                        borderRadius: "10px",
                        bgcolor: sudahDiskon ? "#FFF5F8" : "#FFFFFF",
                        p: 1.5,
                        transition: "all 0.15s",
                      }}
                    >
                      {/* Header baris item */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: isFormOpen ? 1.5 : 0,
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: "#1E293B",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.nama_produk || item.nama}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 11, color: "#64748B", mt: 0.3 }}
                          >
                            Rp {formatRupiah(hargaAsli)} × {item.qty}
                            {sudahDiskon && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  color: "#D81B60",
                                  fontWeight: 700,
                                }}
                              >
                                • Diskon Rp
                                {formatRupiah(item.diskon_item)}
                                {item.diskon_tipe === "%"
                                  ? ` (${item.diskon_input}%)`
                                  : ""}
                              </span>
                            )}
                          </Typography>
                        </Box>

                        {!isFormOpen && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.75,
                              alignItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            {sudahDiskon && (
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveItem(item)}
                                sx={{
                                  color: "#EF4444",
                                  p: 0.5,
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            )}
                            <Button
                              size="small"
                              variant={sudahDiskon ? "outlined" : "contained"}
                              onClick={() => handleOpenItemForm(item)}
                              sx={{
                                minWidth: 80,
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: 11,
                                borderRadius: "6px",
                                bgcolor: sudahDiskon
                                  ? "transparent"
                                  : "#D81B60",
                                color: sudahDiskon ? "#D81B60" : "#FFFFFF",
                                borderColor: "#D81B60",
                                boxShadow: "none",
                                "&:hover": {
                                  bgcolor: sudahDiskon
                                    ? "#FFF0F5"
                                    : "#C2185B",
                                  boxShadow: "none",
                                },
                              }}
                            >
                              {sudahDiskon ? "Ubah" : "Beri Diskon"}
                            </Button>
                          </Box>
                        )}
                      </Box>

                      {/* Form input diskon */}
                      {isFormOpen && (
                        <Box>
                          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                            <TextField
                              select
                              size="small"
                              value={itemTipe}
                              onChange={(e) => setItemTipe(e.target.value)}
                              sx={{
                                width: 80,
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "6px",
                                  bgcolor: "#FFFFFF",
                                },
                              }}
                            >
                              <MenuItem value="Rp">Rp</MenuItem>
                              <MenuItem value="%">%</MenuItem>
                            </TextField>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              placeholder={
                                itemTipe === "%" ? "Contoh: 10" : "Contoh: 2000"
                              }
                              value={itemNilai}
                              onChange={(e) => setItemNilai(e.target.value)}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "6px",
                                  bgcolor: "#FFFFFF",
                                },
                              }}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleApplyItem(item);
                                }
                                if (e.key === "Escape") {
                                  setSelectedItemId(null);
                                  setItemNilai("");
                                }
                              }}
                            />
                          </Box>

                          {/* Preview */}
                          {preview && Number(itemNilai) > 0 && (
                            <Box
                              sx={{
                                p: 1.25,
                                bgcolor: "#F8FAFC",
                                borderRadius: "6px",
                                mb: 1.25,
                                fontSize: 12,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 0.5,
                                }}
                              >
                                <Typography sx={{ color: "#64748B" }}>
                                  Diskon per unit
                                </Typography>
                                <Typography
                                  sx={{ fontWeight: 600, color: "#D81B60" }}
                                >
                                  Rp {formatRupiah(preview.diskonPerUnit)}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography sx={{ color: "#64748B" }}>
                                  Subtotal baru
                                </Typography>
                                <Typography
                                  sx={{ fontWeight: 700, color: "#1E293B" }}
                                >
                                  Rp {formatRupiah(preview.subtotalBaru)}
                                </Typography>
                              </Box>
                            </Box>
                          )}

                          {/* Tombol action */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedItemId(null);
                                setItemNilai("");
                              }}
                              sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                color: "#64748B",
                                fontSize: 12,
                              }}
                            >
                              Batal
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              disabled={!itemNilai || Number(itemNilai) <= 0}
                              onClick={() => handleApplyItem(item)}
                              startIcon={<CheckCircleIcon fontSize="small" />}
                              sx={{
                                bgcolor: "#D81B60",
                                color: "#FFFFFF",
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: 12,
                                borderRadius: "6px",
                                boxShadow: "none",
                                "&:hover": {
                                  bgcolor: "#C2185B",
                                  boxShadow: "none",
                                },
                                "&.Mui-disabled": {
                                  bgcolor: "#E2E8F0",
                                  color: "#94A3B8",
                                },
                              }}
                            >
                              Terapkan
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            )}

            {/* Summary total diskon item */}
            {totalDiskonItem > 0 && (
              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#FFF5F8",
                  borderRadius: "10px",
                  border: "1px solid #F8BBD0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                    fontSize: 13,
                  }}
                >
                  <Typography sx={{ color: "#64748B" }}>
                    Subtotal (sebelum diskon item)
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1E293B" }}>
                    Rp{" "}
                    {formatRupiah(
                      subtotal + totalDiskonItem
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                    fontSize: 13,
                  }}
                >
                  <Typography sx={{ color: "#64748B" }}>
                    Total diskon item
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#D81B60" }}>
                    - Rp {formatRupiah(totalDiskonItem)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1, borderColor: "#F8BBD0" }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#1E293B" }}>
                    Subtotal akhir
                  </Typography>
                  <Typography sx={{ fontWeight: 800, color: "#D81B60" }}>
                    Rp {formatRupiah(subtotal)}
                  </Typography>
                </Box>
              </Paper>
            )}
          </>
        )}
      </DialogContent>

      {/* FOOTER */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {kategoriDiskon === "nota" ? (
          <>
            <Button
              onClick={() => {
                setDiskonNominal(0);
                onClose();
              }}
              sx={{
                color: "#EF4444",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Hapus Diskon
            </Button>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={onClose}
                sx={{
                  color: "#64748B",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyDiskon}
                sx={{
                  bgcolor: "#D81B60",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  borderRadius: "8px",
                  textTransform: "none",
                  boxShadow: "none",
                  px: 3,
                  "&:hover": { bgcolor: "#C2185B" },
                }}
              >
                Terapkan
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box />
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                bgcolor: "#D81B60",
                color: "#FFFFFF",
                fontWeight: 700,
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "none",
                px: 3,
                "&:hover": { bgcolor: "#C2185B" },
              }}
            >
              Selesai
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DiskonModal;