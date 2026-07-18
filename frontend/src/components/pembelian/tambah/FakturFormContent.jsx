import React from "react";
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
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import Button from "../../ui/Button";
import FakturFormSection, { FormField } from "./FakturFormSection";
import { colors, fieldInputSx as sharedFieldSx } from "../../../theme/designTokens";
import {
  GUDANG_OPTIONS,
  JENIS_PPN_OPTIONS,
  NILAI_PPN_OPTIONS,
  JENIS_PEMBAYARAN_OPTIONS,
  AKUN_KAS_OPTIONS,
  SATUAN_OPTIONS,
} from "../../../config/fakturFormConfig";
import Autocomplete from "@mui/material/Autocomplete";

const fieldInputSx = sharedFieldSx;

const tableInputSx = {
  ...fieldInputSx,
  "& .MuiOutlinedInput-input": { py: 1 },
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
              value={fakturInfo.supplier_id ? `${fakturInfo.supplier_id}|${fakturInfo.supplier_name}` : ""}
              onChange={(e) => {
                const [id, name] = e.target.value.split("|");
                setFakturInfo((p) => ({ ...p, supplier_id: id, supplier_name: name }));
              }}
              sx={fieldInputSx}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" disabled>Pilih Supplier</MenuItem>
              {supplier.map((s) => (
                <MenuItem key={s.id} value={`${s.id}|${s.nama}`}>{s.nama}</MenuItem>
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
              sx={fieldInputSx}
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
              sx={fieldInputSx}
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
              sx={fieldInputSx}
            />
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField label="Gudang Penerima" required>
            <TextField select fullWidth size="small" value={fakturInfo.gudang} onChange={(e) => setInfo("gudang", e.target.value)} sx={fieldInputSx}>
              {GUDANG_OPTIONS.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField label="Tanggal Penerimaan">
            <TextField fullWidth size="small" type="datetime-local" value={fakturInfo.tanggal_penerimaan} onChange={(e) => setInfo("tanggal_penerimaan", e.target.value)} sx={fieldInputSx} />
          </FormField>
        </Grid>
      </Grid>
    </FakturFormSection>

    <FakturFormSection title="Kode Batch" subtitle="1 faktur = 1 kode batch untuk semua item">
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={6}>
          <FormField label="Kode Batch" required>
            <TextField
              fullWidth
              size="small"
              value={kodeBatch}
              onChange={(e) => onBatchChange(e.target.value)}
              disabled={!batchManual}
              sx={fieldInputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCode2OutlinedIcon sx={{ color: colors.textMuted, fontSize: 20 }} />
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
            <ToggleButton value="auto" sx={{ px: 2, fontWeight: 600, fontSize: 13, textTransform: "none" }}>
              Otomatis
            </ToggleButton>
            <ToggleButton value="manual" sx={{ px: 2, fontWeight: 600, fontSize: 13, textTransform: "none" }}>
              Manual
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.5 }}>
            {batchManual ? "Kode batch diinput manual" : "Kode batch digenerate dari no. faktur & tanggal"}
          </Typography>
        </Grid>
      </Grid>
    </FakturFormSection>

    <FakturFormSection title="Pajak & Pembayaran">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Jenis PPN">
            <TextField select fullWidth size="small" value={fakturInfo.jenis_ppn} onChange={(e) => setInfo("jenis_ppn", e.target.value)} sx={fieldInputSx}>
              {JENIS_PPN_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Nilai PPN">
            <TextField select fullWidth size="small" value={fakturInfo.nilai_ppn} onChange={(e) => setInfo("nilai_ppn", Number(e.target.value))} sx={fieldInputSx}>
              {NILAI_PPN_OPTIONS.map((n) => <MenuItem key={n} value={n}>{n}%</MenuItem>)}
            </TextField>
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Jenis Pembayaran" required>
            <TextField select fullWidth size="small" value={fakturInfo.jenis_pembayaran} onChange={(e) => setInfo("jenis_pembayaran", e.target.value)} sx={fieldInputSx}>
              {JENIS_PEMBAYARAN_OPTIONS.map((j) => <MenuItem key={j} value={j}>{j}</MenuItem>)}
            </TextField>
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Akun Kas" required>
            <TextField select fullWidth size="small" value={fakturInfo.akun_kas} onChange={(e) => setInfo("akun_kas", e.target.value)} sx={fieldInputSx}>
              {AKUN_KAS_OPTIONS.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </TextField>
          </FormField>
        </Grid>
        {isKredit && (
          <Grid item xs={12} sm={6} md={3}>
            <FormField label="Jatuh Tempo">
              <TextField fullWidth size="small" type="date" value={fakturInfo.jatuh_tempo} onChange={(e) => setInfo("jatuh_tempo", e.target.value)} sx={fieldInputSx} />
            </FormField>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <FormField label="Cashback (Rp)">
            <TextField fullWidth size="small" type="number" inputProps={{ min: 0 }} value={fakturInfo.cashback || ""} onChange={(e) => setInfo("cashback", Number(e.target.value) || 0)} sx={fieldInputSx} />
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6} md={isKredit ? 6 : 9}>
          <FormField label="Catatan">
            <TextField fullWidth size="small" placeholder="Opsional" value={fakturInfo.catatan} onChange={(e) => setInfo("catatan", e.target.value)} sx={fieldInputSx} />
          </FormField>
        </Grid>
      </Grid>
    </FakturFormSection>

    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button onClick={onNext} endIcon={<ArrowForwardIcon />} color="primary" sx={{ px: 3, py: 1.25, fontWeight: 600 }}>
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
}) => (
  <Box sx={{ background: colors.bgCard, borderRadius: 2, border: `1px solid ${colors.borderLight}`, overflow: "hidden" }}>
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: `1px solid ${colors.borderLight}`,
        display: "flex",
        gap: 1.5,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <TextField
        inputRef={barcodeInputRef}
        size="small"
        placeholder="Scan barcode produk, tekan Enter..."
        value={barcodeInput}
        onChange={(e) => setBarcodeInput(e.target.value)}
        onKeyDown={handleBarcodeScan}
        sx={{ ...fieldInputSx, flex: 1, minWidth: 180 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <QrCodeScannerIcon sx={{ color: colors.primary, fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: colors.bgMuted,
          borderRadius: 1,
          border: `1px solid ${colors.borderLight}`,
          minWidth: 150,
        }}
      >
        <Typography sx={{ fontSize: 11, color: colors.textMuted, fontWeight: 600 }}>BATCH</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.primary, fontFamily: "monospace" }}>{kodeBatch || "—"}</Typography>
      </Box>
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={handleTambahBaris}
        variant="outlined"
        sx={{
          borderColor: colors.border,
          color: colors.text,
          px: 2,
          py: 0.6,
          minWidth: 120,
        }}
      >
        Tambah Baris
      </Button>
    </Box>

    <Box sx={{ overflowX: "auto" }}>
      <Box
        component="table"
        sx={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: 800,
          "& th": {
            px: 1.5,
            py: 1,
            fontSize: 11,
            fontWeight: 600,
            color: colors.textMuted,
            textTransform: "uppercase",
            borderBottom: `1px solid ${colors.borderLight}`,
            bgcolor: colors.bgMuted,
            whiteSpace: "nowrap",
          },
          "& td": { px: 1.5, py: 0.75, borderBottom: `1px solid ${colors.borderLight}`, verticalAlign: "middle" },
          "& tbody tr:hover": { bgcolor: colors.bgMuted },
        }}
      >
        <thead>
          <tr>
            {["No", "Produk", "Exp. Date", "Harga Beli", "Harga Jual", "Qty", "Satuan", "Diskon", "Subtotal", ""].map((h, i) => (
              <th key={h || "aksi"} style={{ textAlign: i >= 3 && i <= 7 ? "right" : "left", width: h === "" ? 40 : undefined }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td><Typography sx={{ fontSize: 13, color: colors.textMuted }}>{index + 1}</Typography></td>
              <td style={{ width: 320, minWidth: 320 }}>
                <Autocomplete
                  size="small"
                  options={produk}
                  value={
                    produk.find(
                      (p) => String(p.id_produk) === String(item.produk_id)
                    ) || null
                  }
                  getOptionLabel={(option) => option.nama_produk || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.id_produk === value.id_produk
                  }
                  onChange={(_, value) =>
                    updateItem(
                      item.id,
                      "produk_id",
                      value?.id_produk || ""
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Cari produk..."
                      sx={tableInputSx}
                    />
                  )}
                />
              </td>
              <td>
                <Typography>
                  <TextField
                    inputRef={(el) => { if (!inputRefs.current.exp_date) inputRefs.current.exp_date = {}; inputRefs.current.exp_date[item.id] = el; }}
                    type="date" size="small" value={item.exp_date || ""}
                    onChange={(e) => updateItem(item.id, "exp_date", e.target.value)}
                    onKeyDown={(e) => handleInputKeyDown(e, item.id, "exp_date")}
                    sx={{
                      ...tableInputSx,
                      width: 120,
                    }}
                  />
                </Typography>
              </td>
              <td>
                <TextField
                  inputRef={(el) => { if (!inputRefs.current.harga_beli) inputRefs.current.harga_beli = {}; inputRefs.current.harga_beli[item.id] = el; }}
                  type="number" size="small" value={item.harga_beli || ""}
                  onChange={(e) => updateItem(item.id, "harga_beli", parseInt(e.target.value, 10) || 0)}
                  onKeyDown={(e) => handleInputKeyDown(e, item.id, "harga_beli")}
                  sx={{ ...tableInputSx, width: 95 }}
                  inputProps={{ min: 0, style: { textAlign: "right" } }}
                />
              </td>
              <td>
                <TextField
                  inputRef={(el) => { if (!inputRefs.current.harga_jual) inputRefs.current.harga_jual = {}; inputRefs.current.harga_jual[item.id] = el; }}
                  type="number"
                  size="small"
                  value={item.harga_jual || ""}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "harga_jual",
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                  onKeyDown={(e) => handleInputKeyDown(e, item.id, "harga_jual")}
                  sx={{ ...tableInputSx, width: 95 }}
                  inputProps={{
                    min: 0,
                    style: { textAlign: "right" },
                  }}
                />
              </td>
              <td>
                <TextField
                  inputRef={(el) => { if (!inputRefs.current.qty) inputRefs.current.qty = {}; inputRefs.current.qty[item.id] = el; }}
                  type="number" size="small" value={item.qty || ""}
                  onChange={(e) => updateItem(item.id, "qty", parseInt(e.target.value, 10) || 0)}
                  onKeyDown={(e) => handleInputKeyDown(e, item.id, "qty")}
                  sx={{ ...tableInputSx, width: 64 }}
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                />
              </td>
              <td>
                <TextField select size="small" value={item.satuan || ""} onChange={(e) => updateItem(item.id, "satuan", e.target.value)} sx={{ ...tableInputSx, minWidth: 70 }}>
                  {SATUAN_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </td>
              <td>
                <Box sx={{ display: "flex", gap: 0.5, minWidth: 90 }}>
                  <TextField select size="small" value={item.diskon_tipe || "%"} onChange={(e) => updateItem(item.id, "diskon_tipe", e.target.value)} sx={{ ...tableInputSx, width: 52 }}>
                    <MenuItem value="%">%</MenuItem>
                    <MenuItem value="Rp">Rp</MenuItem>
                  </TextField>
                  <TextField
                    inputRef={(el) => { if (!inputRefs.current.diskon) inputRefs.current.diskon = {}; inputRefs.current.diskon[item.id] = el; }}
                    type="number" size="small" value={item.diskon || ""}
                    onChange={(e) => updateItem(item.id, "diskon", parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => handleInputKeyDown(e, item.id, "diskon")}
                    sx={{ ...tableInputSx, flex: 1 }}
                    inputProps={{ min: 0 }}
                  />
                </Box>
              </td>
              <td style={{ textAlign: "right" }}>
                <Typography sx={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
                  Rp {(item.total || 0).toLocaleString("id-ID")}
                </Typography>
              </td>
              <td style={{ textAlign: "center" }}>
                <IconButton size="small" onClick={() => handleHapusBaris(item.id)} sx={{ color: colors.danger }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  </Box>
);

export { FakturInfoForm, FakturItemForm };