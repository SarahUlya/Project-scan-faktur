import React from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
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
} from "../../../config/apotek";

const fieldInputSx = sharedFieldSx;

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

/* ══════════════════════════════════════════════════════════════════
 * FAKTUR INFO FORM
 * ══════════════════════════════════════════════════════════════════ */
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
              sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ px: 2, fontWeight: 600, fontSize: 13, textTransform: "none" }}
            >
              Otomatis
            </ToggleButton>
            <ToggleButton
              value="manual"
              sx={{ px: 2, fontWeight: 600, fontSize: 13, textTransform: "none" }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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
          <FormField label="Besaran PPN (%)">
            <TextField
              type="number"
              fullWidth
              size="small"
              placeholder="Contoh: 11"
              disabled={fakturInfo.jenis_ppn === "non_ppn"}
              value={fakturInfo.nilai_ppn || ""}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                setInfo("nilai_ppn", val === 0 ? "" : val);
              }}
              sx={{ ...fieldInputSx, width: 300 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
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
              sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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
                sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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
              sx={{ ...fieldInputSx, width: 300 }}
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

export default FakturInfoForm;