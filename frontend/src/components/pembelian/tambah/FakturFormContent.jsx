import React, { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import Button from "../../ui/Button";
import FakturFormSection, { FormField } from "./FakturFormSection";
import { colors, fieldInputSx as sharedFieldSx } from "@/theme/designTokens";
import {
  GUDANG_OPTIONS,
  JENIS_PPN_OPTIONS,
  NILAI_PPN_OPTIONS,
  JENIS_PEMBAYARAN_OPTIONS,
  AKUN_KAS_OPTIONS,
  SATUAN_OPTIONS,
} from "../../../config/apotek";
import Autocomplete from "@mui/material/Autocomplete";

const fieldInputSx = sharedFieldSx;

// Helper Format Angka ke Rupiah / Ribuan
const formatNumber = (val) => {
  if (val === "" || val === undefined || val === null) return "";
  const num = Number(val);
  if (isNaN(num)) return "";
  return num.toLocaleString("id-ID");
};

// Helper Parse String Format ke Number
const parseNumber = (formattedStr) => {
  const clean = String(formattedStr).replace(/[^0-9]/g, "");
  return clean ? parseInt(clean, 10) : 0;
};

const FakturInfoForm = ({
  fakturInfo,
  setInfo,
  setFakturInfo,
  supplier,
  isKredit,
  kodeBatch,
  batchManual,
  onBatchChange,
  onBatchModeChange,
  onNext,
}) => (
  <>
    <FakturFormSection title="Data Faktur">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <FormField label="Supplier" required>
            <TextField
              select
              fullWidth
              size="small"
              value={
                fakturInfo.supplier_id
                  ? `${fakturInfo.supplier_id}|${fakturInfo.supplier_name}`
                  : ""
              }
              onChange={(e) => {
                const [id, name] = e.target.value.split("|");
                setFakturInfo((p) => ({
                  ...p,
                  supplier_id: id,
                  supplier_name: name,
                }));
              }}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" disabled>
                Pilih Supplier
              </MenuItem>
              {supplier.map((s) => (
                <MenuItem key={s.id} value={`${s.id}|${s.nama}`}>
                  {s.nama}
                </MenuItem>
              ))}
            </TextField>
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField label="No. Faktur" required>
            <TextField
              fullWidth
              size="small"
              placeholder="INV/2026/001"
              value={fakturInfo.no_faktur}
              onChange={(e) => setInfo("no_faktur", e.target.value)}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            />
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField label="Tanggal Faktur" required>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={fakturInfo.tanggal}
              onChange={(e) => setInfo("tanggal", e.target.value)}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            />
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField label="No. Surat Pesanan">
            <TextField
              fullWidth
              size="small"
              placeholder="No. PO / SP"
              value={fakturInfo.no_surat_pesanan}
              onChange={(e) => setInfo("no_surat_pesanan", e.target.value)}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            />
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField label="Gudang Penerima" required>
            <TextField
              select
              fullWidth
              size="small"
              value={fakturInfo.gudang}
              onChange={(e) => setInfo("gudang", e.target.value)}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            >
              {GUDANG_OPTIONS.map((g) => (
                <MenuItem key={g.value} value={g.value}>
                  {g.label}
                </MenuItem>
              ))}
            </TextField>
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField label="Tanggal Penerimaan">
            <TextField
              fullWidth
              size="small"
              type="datetime-local"
              value={fakturInfo.tanggal_penerimaan}
              onChange={(e) => setInfo("tanggal_penerimaan", e.target.value)}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            />
          </FormField>
        </Grid>
      </Grid>
    </FakturFormSection>

    <FakturFormSection
      title="Kode Batch"
      subtitle="1 faktur = 1 kode batch untuk semua item"
    >
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={6}>
          <FormField label="Kode Batch" required>
            <TextField
              fullWidth
              size="small"
              value={kodeBatch}
              onChange={(e) => onBatchChange(e.target.value)}
              disabled={!batchManual}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCode2OutlinedIcon
                      sx={{ color: colors.textMuted, fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={batchManual ? "manual" : "auto"}
            onChange={(_, val) => val && onBatchModeChange(val === "manual")}
            sx={{ mb: 0.5 }}
          >
            <ToggleButton
              value="auto"
              sx={{
                px: 2,
                fontWeight: 600,
                fontSize: 13,
                textTransform: "none",
              }}
            >
              Otomatis
            </ToggleButton>
            <ToggleButton
              value="manual"
              sx={{
                px: 2,
                fontWeight: 600,
                fontSize: 13,
                textTransform: "none",
              }}
            >
              Manual
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.5 }}>
            {batchManual
              ? "Kode batch diinput manual"
              : "Kode batch digenerate dari no. faktur & tanggal"}
          </Typography>
        </Grid>
      </Grid>
    </FakturFormSection>

    <FakturFormSection title="Pajak & Pembayaran">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Jenis PPN">
            <TextField
              select
              fullWidth
              size="small"
              value={fakturInfo.jenis_ppn}
              onChange={(e) => setInfo("jenis_ppn", e.target.value)}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            >
              {JENIS_PPN_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Nilai PPN">
            <TextField
              select
              fullWidth
              size="small"
              value={fakturInfo.nilai_ppn}
              onChange={(e) => setInfo("nilai_ppn", Number(e.target.value))}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            >
              {NILAI_PPN_OPTIONS.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}%
                </MenuItem>
              ))}
            </TextField>
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Jenis Pembayaran" required>
            <TextField
              select
              fullWidth
              size="small"
              value={fakturInfo.jenis_pembayaran}
              onChange={(e) => setInfo("jenis_pembayaran", e.target.value)}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            >
              {JENIS_PEMBAYARAN_OPTIONS.map((j) => (
                <MenuItem key={j.value} value={j.value}>
                  {j.label}
                </MenuItem>
              ))}
            </TextField>
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Akun Kas" required>
            <TextField
              select
              fullWidth
              size="small"
              value={fakturInfo.akun_kas}
              onChange={(e) => setInfo("akun_kas", e.target.value)}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            >
              {AKUN_KAS_OPTIONS.map((a) => (
                <MenuItem key={a.value} value={a.value}>
                  {a.label}
                </MenuItem>
              ))}
            </TextField>
          </FormField>
        </Grid>
        {isKredit && (
          <Grid item xs={12} sm={6} md={3}>
            <FormField label="Jatuh Tempo">
              <TextField
                fullWidth
                size="small"
                type="date"
                value={fakturInfo.jatuh_tempo}
                onChange={(e) => setInfo("jatuh_tempo", e.target.value)}
                sx={{
                  ...fieldInputSx,
                  width: 300,
                }}
              />
            </FormField>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Cashback (Rp)">
            <TextField
              fullWidth
              size="small"
              type="text"
              value={formatNumber(fakturInfo.cashback)}
              onChange={(e) => setInfo("cashback", parseNumber(e.target.value))}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                      Rp
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={isKredit ? 6 : 9}>
          <FormField label="Catatan">
            <TextField
              fullWidth
              size="small"
              placeholder="Opsional"
              value={fakturInfo.catatan}
              onChange={(e) => setInfo("catatan", e.target.value)}
              sx={{
                ...fieldInputSx,
                width: 300,
              }}
            />
          </FormField>
        </Grid>
      </Grid>
    </FakturFormSection>

    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        onClick={onNext}
        endIcon={<ArrowForwardIcon />}
        color="primary"
        sx={{ px: 3, py: 1.25, fontWeight: 600 }}
      >
        Lanjut ke Daftar Barang
      </Button>
    </Box>
  </>
);

const FakturItemForm = ({
  items,
  produk,
  kodeBatch,
  barcodeInput,
  setBarcodeInput,
  barcodeInputRef,
  inputRefs,
  handleBarcodeScan,
  handleInputKeyDown,
  updateItem,
  handleTambahBaris,
  handleHapusBaris,
}) => {
  // EFECT UTAMA: Pastikan kursor MENGUNCI balik ke Barcode Input setiap kali ada penambahan baris baru
  useEffect(() => {
    const timer = setTimeout(() => {
      if (barcodeInputRef?.current) {
        barcodeInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [items.length]);

  const onBarcodeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (handleBarcodeScan) {
        handleBarcodeScan(e);
      }
      if (!barcodeInput || barcodeInput.trim() === "") {
        handleTambahBaris();
      }
    }
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* HEADER BARCODE SCANNER */}
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
        <TextField
          inputRef={barcodeInputRef}
          size="small"
          placeholder="Scan barcode produk atau tekan Enter untuk tambah baris..."
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyDown={onBarcodeKeyDown}
          sx={{ ...fieldInputSx, flex: 1, minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <QrCodeScannerIcon
                  sx={{ color: colors.primary, fontSize: 22 }}
                />
              </InputAdornment>
            ),
          }}
        />
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

      {/* ITEM LIST CARDS - LAYOUT PER ITEM SANGAT LUAS & JELAS */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              p: 2.5,
              background: colors.bgCard,
              borderRadius: 2,
              border: `1px solid ${colors.borderLight}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
              position: "relative",
            }}
          >
            {/* Header Kartu Item */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    bgcolor: colors.primary,
                    color: colors.textOnDark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography
                  sx={{ fontWeight: 600, fontSize: 14, color: colors.text }}
                >
                  Barang #{index + 1}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => handleHapusBaris(item.id)}
                sx={{
                  color: colors.danger,
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
                }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Grid Form Input Per Barang */}
            <Grid container spacing={2}>
              {/* Row 1: Produk & Exp Date */}
              <Grid item xs={12} md={8}>
                <FormField label="Pilih Produk" required>
                  <Autocomplete
                    size="small"
                    options={produk}
                    value={
                      produk.find(
                        (p) => String(p.id_produk) === String(item.produk_id),
                      ) || null
                    }
                    getOptionLabel={(option) => option.nama_produk || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.id_produk === value.id_produk
                    }
                    onChange={(_, value) =>
                      updateItem(item.id, "produk_id", value?.id_produk || "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Cari nama atau barcode produk..."
                        sx={{ fieldInputSx, width: 300 }}
                      />
                    )}
                  />
                </FormField>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormField label="Tanggal Kadaluarsa (Exp Date)">
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
                    sx={{
                      ...fieldInputSx,
                      width: 300,
                    }}
                  />
                </FormField>
              </Grid>

              {/* Row 2: Harga Beli, Harga Jual, Qty, Satuan */}
              <Grid item xs={12} sm={6} md={3}>
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
                    sx={{ ...fieldInputSx, width: 300, flexShrink: 0 }}
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

              <Grid item xs={12} sm={6} md={3}>
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
                    sx={{ ...fieldInputSx, width: 300, flexShrink: 0 }}
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

              <Grid item xs={6} md={3}>
                <FormField label="Jumlah (Qty)" required>
                  <TextField
                    inputRef={(el) => {
                      if (!inputRefs.current.qty) inputRefs.current.qty = {};
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
                    sx={{ ...fieldInputSx, width: 300 }}
                    inputProps={{
                      min: 0,
                      style: { textAlign: "center", fontWeight: 600 },
                    }}
                  />
                </FormField>
              </Grid>

              <Grid item xs={6} md={3}>
                <FormField label="Satuan">
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={item.satuan || ""}
                    onChange={(e) =>
                      updateItem(item.id, "satuan", e.target.value)
                    }
                    sx={{ ...fieldInputSx, width: 300 }}
                  >
                    {SATUAN_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormField>
              </Grid>

              {/* Row 3: Diskon & Subtotal */}
              <Grid item xs={12} sm={6} md={6}>
                <FormField label="Diskon Per Barang">
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      select
                      size="small"
                      value={item.diskon_tipe || "%"}
                      onChange={(e) =>
                        updateItem(item.id, "diskon_tipe", e.target.value)
                      }
                      sx={{ ...fieldInputSx, width: 300, flexShrink: 0 }}
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
                      sx={{
                        ...fieldInputSx,
                        width: 300,
                      }}
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
                        style: {
                          textAlign: "right",
                          fontWeight: 600,
                          width: 100,
                        },
                      }}
                    />
                  </Box>
                </FormField>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormField label="Subtotal Harga">
                  <Box
                    sx={{
                      height: 40,
                      px: 2,
                      bgcolor: colors.bgMuted,
                      borderRadius: 1,
                      border: `1px solid ${colors.borderLight}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, fontSize: 16, color: colors.text }}
                    >
                      Rp {(item.total || 0).toLocaleString("id-ID")}
                    </Typography>
                  </Box>
                </FormField>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export { FakturInfoForm, FakturItemForm };
