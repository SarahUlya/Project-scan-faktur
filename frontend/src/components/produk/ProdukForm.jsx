import React, { useState, useEffect } from "react";
import { Box, TextField, FormControl, Select, MenuItem, Typography, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Button from "../ui/Button";
import StatusToggle from "../ui/StatusToggle";
import { SATUAN_OPTIONS } from "../../config/fakturFormConfig";

const initialState = {
  nama_produk: "",
  id_kategori: "",
  satuan_id: "",
  stok_minimum: 0,
  is_active: true,
  barcode: "",
  harga_jual: 0,
};

const ProdukForm = ({
  onClose,
  onSubmit,
  mode = "add",
  initialData,
  kategori,
  satuanList
}) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        nama_produk: initialData.nama_produk || "",
        id_kategori: initialData.id_kategori ?? initialData.kategoriId ?? "",
        satuan_id: initialData.satuan_id ?? initialData.satuanId ?? initialData.satuan ?? "",
        stok_minimum: initialData.stok_minimum || 0,
        is_active: initialData.is_active ?? true,
        barcode: initialData.barcode || "",
        harga_jual: initialData.harga_jual || 0,
      });
    } else {
      setForm(initialState);
    }
    setError({});
  }, [mode, initialData]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const satuanOptions = satuanList?.length
    ? satuanList
    : SATUAN_OPTIONS.map((value) => ({ id: value, nama: value }));

  const selectedSatuan = satuanOptions?.find(
    (s) => String(s.id) === String(form.satuan_id)
  );
  const stokUnitLabel = selectedSatuan?.nama || "Unit";

  const validate = () => {
    const err = {};
    if (!form.nama_produk.trim()) err.nama_produk = "Nama produk wajib diisi";
    if (!form.id_kategori) err.id_kategori = "Kategori wajib dipilih";
    if (!form.satuan_id) err.satuan_id = "Satuan wajib diisi";
    if (form.stok_minimum === "" || isNaN(form.stok_minimum)) err.stok_minimum = "Stok minimum wajib diisi";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = {
      id_produk: initialData?.id_produk,
      ...form,
    };

    onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ minWidth: 340, maxWidth: 520 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {mode === "edit" && (
          <Box sx={{ width: 48, height: 48, background: '#FCE4EC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E63' }}>
            <EditIcon />
          </Box>
        )}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B' }}>
            {mode === "add" ? "Input Produk Baru" : "Edit Detail Produk"}
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13, mt: 0.5 }}>
            {mode === "add"
              ? "Tambahkan informasi obat ke dalam sistem."
              : "Perbarui informasi produk pada sistem katalog."}
          </Typography>
        </Box>
      </Box>

      {mode === "edit" && initialData && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
              ID PRODUK
            </Typography>
            <TextField
              value={initialData.id_produk}
              disabled
              fullWidth
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, mt: 1, bgcolor: "#F8FAFC" }}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
          NAMA PRODUK <span style={{ color: '#EF4444' }}>*</span>
        </Typography>
        <TextField
          placeholder="Contoh: Paracetamol 500mg"
          value={form.nama_produk}
          onChange={(e) => handleChange("nama_produk", e.target.value)}
          fullWidth
          size="small"
          error={!!error.nama_produk}
          helperText={error.nama_produk ? <span style={{ color: '#EF4444', fontWeight: 600 }}>{error.nama_produk}</span> : ""}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mb: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            KATEGORI OBAT
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={form.id_kategori || ""}
              onChange={(e) =>
                handleChange(
                  "id_kategori",
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
              displayEmpty
            >
              <MenuItem value="">
                Pilih Kategori
              </MenuItem>

              {kategori?.map((k) => (
                <MenuItem
                  key={k.id_kategori}
                  value={k.id_kategori}
                >
                  {k.nama_kategori}
                </MenuItem>
              ))}
            </Select>

            {error.id_kategori && (
              <Typography
                variant="caption"
                sx={{
                  color: "#EF4444",
                  fontWeight: 600,
                  mt: 0.5
                }}
              >
                {error.id_kategori}
              </Typography>
            )}
          </FormControl>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            SATUAN DASAR
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={form.satuan_id || ""}
              onChange={(e) => handleChange("satuan_id", e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                Pilih Satuan
              </MenuItem>

              {satuanOptions?.map((s) => (
                <MenuItem
                  key={s.id}
                  value={s.id}
                >
                  {s.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            STOK MINIMUM <span style={{ color: '#E91E63', fontWeight: 600, textTransform: 'none' }}>(Peringatan Stok Rendah)</span>
          </Typography>
          <TextField
            type="number"
            value={form.stok_minimum}
            onChange={(e) => handleChange("stok_minimum", e.target.value)}
            fullWidth
            size="small"
            error={!!error.stok_minimum}
            helperText={error.stok_minimum ? <span style={{ color: '#EF4444', fontWeight: 600 }}>{error.stok_minimum}</span> : ""}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              endAdornment: <Typography sx={{ color: '#94A3B8', fontSize: 14, fontWeight: 600 }}>{stokUnitLabel}</Typography>
            }}
          />
        </Box>
        <Box>
          <StatusToggle
            value={form.is_active}
            onChange={(value) => handleChange("is_active", value)}
            label="STATUS PRODUK"
            variant="horizontal"
          />
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            HARGA JUAL
          </Typography>
          <TextField
            type="number"
            value={form.harga_jual}
            onChange={(e) => handleChange("harga_jual", e.target.value)}
            fullWidth
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            BARCODE
          </Typography>
          <TextField
            value={form.barcode}
            onChange={(e) => handleChange("barcode", e.target.value)}
            fullWidth
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <Button type="button" variant="outlined" sx={{ flex: 1, fontWeight: 700, fontSize: 15, borderRadius: 2, borderColor: '#F1F5F9', color: '#1E293B', '&:hover': { bgcolor: '#F8FAFC', borderColor: '#E2E8F0' } }} onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" sx={{ flex: 1, fontWeight: 700, fontSize: 15, borderRadius: 2, bgcolor: '#E91E63', color: '#fff', '&:hover': { bgcolor: '#C2185B' }, boxShadow: '0 4px 14px rgba(233, 30, 99, 0.3)', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
          {mode === "edit" && <SaveIcon fontSize="small" />}
          {mode === "add" ? "Simpan Produk" : "Simpan Perubahan"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProdukForm;
