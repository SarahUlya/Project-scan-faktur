import React, { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  InputAdornment,
  Chip,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";

import Button from "../../ui/Button";
import { FormField } from "./FakturFormSection";
import { colors, fieldInputSx as sharedFieldSx } from "@/theme/designTokens";

const fieldInputSx = sharedFieldSx;

/* ══════════════════════════════════════════════════════════════════
 * HELPER
 * ══════════════════════════════════════════════════════════════════ */
const formatNumber = (val) => {
  if (val === "" || val === undefined || val === null) return "";
  const num = Number(val);
  if (isNaN(num)) return "";
  return num.toLocaleString("id-ID");
};

const parseNumber = (formattedStr) => {
  const clean = String(formattedStr).replace(/[^0-9]/g, "");
  return clean ? parseInt(clean, 10) : 0;
};

/**
 * Deteksi apakah input berupa barcode — semua digit & panjang >= 7
 */
const isBarcodeLike = (str) => {
  const s = String(str || "").trim();
  if (s.length < 7) return false;
  return /^\d+$/.test(s);
};

/* ══════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ══════════════════════════════════════════════════════════════════ */
const FakturItemForm = ({
  items,
  produk,
  kodeBatch,
  barcodeInput,
  setBarcodeInput,
  barcodeInputRef,
  inputRefs,
  handleSelectProduk,
  onBarcodeScan,
  onBarcodeBlur,
  handleInputKeyDown,
  updateItem,
  handleTambahBaris,
  handleHapusBaris,
}) => {
  // Auto-focus ke kolom search saat jumlah item berubah
  useEffect(() => {
    const timer = setTimeout(() => {
      if (barcodeInputRef?.current) {
        barcodeInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [items.length]);

  /* ── Key handler header search ────────────────────────────── */
  const onSearchKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const query = (barcodeInput || "").trim();
    if (!query) {
      handleTambahBaris();
      return;
    }
    if (onBarcodeScan) onBarcodeScan(query);
  };

  const handleLastInputKeyDown = (e, itemId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (barcodeInputRef?.current) {
        barcodeInputRef.current.focus();
      }
    } else if (handleInputKeyDown) {
      handleInputKeyDown(e, itemId, "diskon");
    }
  };

  const isBarcodeInput = isBarcodeLike(barcodeInput);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* ═══ HEADER SEARCH ═══ */}
      <Box
        sx={{
          p: 2,
          background: colors.bgCard,
          borderRadius: 2,
          border: `1px solid ${colors.borderLight}`,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Autocomplete
          freeSolo
          size="small"
          options={produk || []}
          inputValue={barcodeInput || ""}
          onInputChange={(_, val) => setBarcodeInput(val)}
          getOptionLabel={(opt) =>
            typeof opt === "string" ? opt : opt?.nama_produk || ""
          }
          isOptionEqualToValue={(opt, val) =>
            String(opt?.id_produk) === String(val?.id_produk)
          }
          filterOptions={(options, state) => {
            const q = state.inputValue.trim();
            if (!q) return [];
            if (isBarcodeLike(q)) return [];
            const lower = q.toLowerCase();
            return options
              .filter(
                (p) =>
                  p.nama_produk?.toLowerCase().includes(lower) ||
                  p.barcode?.toLowerCase().includes(lower),
              )
              .slice(0, 10);
          }}
          onChange={(_, value) => {
            if (value && typeof value === "object" && value.id_produk) {
              if (handleSelectProduk) handleSelectProduk(value);
              setBarcodeInput("");
              setTimeout(() => barcodeInputRef?.current?.focus(), 50);
            }
          }}
          onKeyDown={onSearchKeyDown}
          onBlur={onBarcodeBlur}
          sx={{ ...fieldInputSx, flex: 1, minWidth: 320 }}
          componentsProps={{
            popper: {
              sx: {
                display: isBarcodeInput ? "none !important" : "block",
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={barcodeInputRef}
              placeholder="Scan barcode atau ketik nama produk..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCodeScannerIcon
                      sx={{ color: colors.primary, fontSize: 22 }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id_produk}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: colors.text }}
                >
                  {option.nama_produk}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: colors.textMuted,
                      fontFamily: "monospace",
                    }}
                  >
                    {option.barcode || "-"}
                  </Typography>
                  {option.satuan?.nama && (
                    <Chip
                      label={option.satuan.nama}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: 9,
                        bgcolor: colors.bgMuted,
                        color: colors.textSecondary,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </li>
          )}
        />

        {/* Kode batch indicator */}
        <Box
          sx={{
            px: 2,
            py: 0.75,
            bgcolor: colors.bgMuted,
            borderRadius: 1.5,
            border: `1px solid ${colors.borderLight}`,
          }}
        >
          <Typography
            sx={{ fontSize: 11, color: colors.textMuted, fontWeight: 600 }}
          >
            KODE BATCH
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.primary,
              fontFamily: "monospace",
            }}
          >
            {kodeBatch || "—"}
          </Typography>
        </Box>

        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            handleTambahBaris();
            if (barcodeInputRef?.current) barcodeInputRef.current.focus();
          }}
          variant="contained"
          color="primary"
          sx={{ px: 3, py: 1, fontWeight: 600 }}
        >
          Tambah Baris
        </Button>
      </Box>

      {/* ═══ ITEM LIST ═══ */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              background: colors.bgCard,
              borderRadius: 2,
              border: `1px solid ${colors.borderLight}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
              overflow: "hidden",
            }}
          >
            {/* ═══ HEADER CARD — nama produk di sini ═══ */}
            <Box
              sx={{
                px: 2.5,
                py: 1.75,
                bgcolor: colors.bgMuted,
                borderBottom: `1px solid ${colors.borderLight}`,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: colors.primary,
                  color: colors.textOnDark,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: item.produk_id ? colors.text : colors.textMuted,
                    fontStyle: item.produk_id ? "normal" : "italic",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: 1.3,
                  }}
                >
                  {item.nama_produk ||
                    "Scan barcode atau ketik nama di kolom atas"}
                </Typography>
                {(item.barcode || item.satuan) && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      mt: 0.25,
                    }}
                  >
                    {item.barcode && (
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontFamily: "monospace",
                          color: colors.textMuted,
                          lineHeight: 1.2,
                        }}
                      >
                        {item.barcode}
                      </Typography>
                    )}
                    {item.satuan && (
                      <>
                        {item.barcode && (
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: colors.textMuted,
                              lineHeight: 1,
                            }}
                          >
                            •
                          </Typography>
                        )}
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: colors.textSecondary,
                            fontWeight: 600,
                            lineHeight: 1.2,
                          }}
                        >
                          {item.satuan}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>

              <IconButton
                size="small"
                onClick={() => handleHapusBaris(item.id)}
                sx={{
                  color: colors.danger,
                  flexShrink: 0,
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* ═══ BODY FORM ═══ */}
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                {/* Row 1: Exp Date, Harga Beli, Harga Jual */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormField label="Tanggal Kadaluarsa">
                    <TextField
                      inputRef={(el) => {
                        if (!inputRefs.current.exp_date)
                          inputRefs.current.exp_date = {};
                        inputRefs.current.exp_date[item.id] = el;
                      }}
                      type="date"
                      size="small"
                      fullWidth
                      value={item.exp_date || ""}
                      onChange={(e) =>
                        updateItem(item.id, "exp_date", e.target.value)
                      }
                      onKeyDown={(e) =>
                        handleInputKeyDown(e, item.id, "exp_date")
                      }
                      sx={fieldInputSx}
                    />
                  </FormField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormField label="Harga Beli (Rp)" required>
                    <TextField
                      inputRef={(el) => {
                        if (!inputRefs.current.harga_beli)
                          inputRefs.current.harga_beli = {};
                        inputRefs.current.harga_beli[item.id] = el;
                      }}
                      type="text"
                      size="small"
                      fullWidth
                      value={formatNumber(item.harga_beli)}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "harga_beli",
                          parseNumber(e.target.value),
                        )
                      }
                      onKeyDown={(e) =>
                        handleInputKeyDown(e, item.id, "harga_beli")
                      }
                      sx={fieldInputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: 13,
                                color: colors.textMuted,
                              }}
                            >
                              Rp
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        style: { textAlign: "right", fontWeight: 600 },
                      }}
                    />
                  </FormField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormField label="Harga Jual (Rp)">
                    <TextField
                      inputRef={(el) => {
                        if (!inputRefs.current.harga_jual)
                          inputRefs.current.harga_jual = {};
                        inputRefs.current.harga_jual[item.id] = el;
                      }}
                      type="text"
                      size="small"
                      fullWidth
                      value={formatNumber(item.harga_jual)}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "harga_jual",
                          parseNumber(e.target.value),
                        )
                      }
                      onKeyDown={(e) =>
                        handleInputKeyDown(e, item.id, "harga_jual")
                      }
                      sx={fieldInputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 13,
                                color: colors.textMuted,
                              }}
                            >
                              Rp
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        style: { textAlign: "right", fontWeight: 600 },
                      }}
                    />
                  </FormField>
                </Grid>

                {/* Row 2: Qty | Satuan | Diskon | Subtotal — compact */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "flex-end",
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                    }}
                  >
                    {/* Qty */}
                    <Box
                      sx={{
                        width: { xs: "calc(50% - 6px)", sm: 90 },
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: colors.textMuted,
                          mb: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: 0.3,
                        }}
                      >
                        Qty <span style={{ color: colors.danger }}>*</span>
                      </Typography>
                      <TextField
                        inputRef={(el) => {
                          if (!inputRefs.current.qty)
                            inputRefs.current.qty = {};
                          inputRefs.current.qty[item.id] = el;
                        }}
                        type="number"
                        size="small"
                        fullWidth
                        value={item.qty || ""}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "qty",
                            parseInt(e.target.value, 10) || 0,
                          )
                        }
                        onKeyDown={(e) => handleInputKeyDown(e, item.id, "qty")}
                        sx={fieldInputSx}
                        inputProps={{
                          min: 0,
                          style: { textAlign: "center", fontWeight: 600 },
                        }}
                      />
                    </Box>

                    {/* Satuan */}
                    <Box
                      sx={{
                        width: { xs: "calc(50% - 6px)", sm: 100 },
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: colors.textMuted,
                          mb: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: 0.3,
                        }}
                      >
                        Satuan
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={item.satuan || ""}
                        slotProps={{ input: { readOnly: true } }}
                        sx={fieldInputSx}
                      />
                    </Box>

                    {/* Diskon — tipe + nilai inline */}
                    <Box
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        flex: { xs: "auto", sm: 1 },
                        minWidth: 160,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: colors.textMuted,
                          mb: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: 0.3,
                        }}
                      >
                        Diskon
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <TextField
                          select
                          size="small"
                          value={item.diskon_tipe || "%"}
                          onChange={(e) =>
                            updateItem(item.id, "diskon_tipe", e.target.value)
                          }
                          sx={{ ...fieldInputSx, width: 64, flexShrink: 0 }}
                        >
                          <MenuItem value="%">%</MenuItem>
                          <MenuItem value="Rp">Rp</MenuItem>
                        </TextField>
                        <TextField
                          inputRef={(el) => {
                            if (!inputRefs.current.diskon)
                              inputRefs.current.diskon = {};
                            inputRefs.current.diskon[item.id] = el;
                          }}
                          type="text"
                          size="small"
                          fullWidth
                          value={
                            item.diskon_tipe === "Rp"
                              ? formatNumber(item.diskon)
                              : item.diskon || ""
                          }
                          onChange={(e) => {
                            const val =
                              item.diskon_tipe === "Rp"
                                ? parseNumber(e.target.value)
                                : parseFloat(e.target.value) || 0;
                            updateItem(item.id, "diskon", val);
                          }}
                          onKeyDown={(e) => handleLastInputKeyDown(e, item.id)}
                          sx={fieldInputSx}
                          InputProps={
                            item.diskon_tipe === "Rp"
                              ? {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Typography
                                        sx={{
                                          fontWeight: 700,
                                          fontSize: 13,
                                          color: colors.textMuted,
                                        }}
                                      >
                                        Rp
                                      </Typography>
                                    </InputAdornment>
                                  ),
                                }
                              : undefined
                          }
                          inputProps={{
                            style: { textAlign: "right", fontWeight: 600 },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Subtotal — di kanan, aligned */}
                    <Box
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        minWidth: { xs: "auto", sm: 160 },
                        ml: { xs: 0, sm: "auto" },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: colors.textMuted,
                          mb: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: 0.3,
                          textAlign: "right",
                        }}
                      >
                        Subtotal
                      </Typography>
                      <Box
                        sx={{
                          height: 40,
                          px: 2,
                          bgcolor: colors.primaryLight,
                          borderRadius: 1,
                          border: `1px solid ${colors.primary}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: colors.primary,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          Rp {(item.total || 0).toLocaleString("id-ID")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FakturItemForm;
