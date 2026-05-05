import React, { useState, useEffect } from "react";
import { Box, TextField, FormControl, Select, MenuItem, Switch, Typography, Divider, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Button from "../ui/Button";

const satuanList = ["Strip", "Botol", "Box", "Tablet", "Pcs"];

const initialState = {
  nama: "",
  id_kategori: "",
  satuan: "",
  stokMinimum: 10,
  status: true,
  barcode: "",
  hargaJual: 0,
};

const ProdukForm = ({ onClose, onSubmit, mode = "add", initialData, kategori }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        nama: initialData.nama || initialData.namaItem || "",
        id_kategori: initialData.id_kategori || initialData.kategoriId || initialData.kategori || "",
        satuan: initialData.satuan || "",
        stokMinimum: initialData.stokMinimum || 10,
        status: (initialData.status || "NONAKTIF") === "AKTIF",
        barcode: initialData.barcode || "",
        hargaJual: initialData.hargaJual || 0,
      });
    } else {
      setForm(initialState);
    }
    setError({});
  }, [mode, initialData]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.nama.trim()) err.nama = "Nama produk wajib diisi";
    if (!form.id_kategori) err.id_kategori = "Kategori wajib dipilih";
    if (!form.satuan.trim()) err.satuan = "Satuan wajib diisi";
    if (!form.stokMinimum || isNaN(form.stokMinimum)) err.stokMinimum = "Stok minimum wajib diisi";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      ...initialData,
      id: initialData?.id,
      nama: form.nama,
      id_kategori: form.id_kategori,
      satuan: form.satuan,
      stokMinimum: Number(form.stokMinimum),
      status: form.status ? "AKTIF" : "NONAKTIF",
      barcode: form.barcode,
      hargaJual: Number(form.hargaJual || 0),
    };
    onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ minWidth: 340, maxWidth: 520 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {mode === "edit" && (
          <Box sx={{ width: 48, height: 48, background: '#FCE7F3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E63' }}>
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
            <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>ID PRODUK</Typography>
            <TextField
              value={initialData.id}
              disabled
              fullWidth
              size="small"
              sx={{ mt: 1, bgcolor: "#F8FAFC" }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>STATUS PRODUK</Typography>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <Select
                name="status"
                value={form.status ? "AKTIF" : "NONAKTIF"}
                onChange={(e) => handleChange("status", e.target.value === "AKTIF")}
              >
                <MenuItem value="AKTIF">Aktif (Tersedia)</MenuItem>
                <MenuItem value="NONAKTIF">Non-Aktif</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
          NAMA PRODUK <span style={{color: '#EF4444'}}>*</span>
        </Typography>
        <TextField
          placeholder="Contoh: Paracetamol 500mg"
          value={form.nama}
          onChange={(e) => handleChange("nama", e.target.value)}
          fullWidth
          size="small"
          error={!!error.nama}
          helperText={error.nama ? <span style={{color: '#EF4444', fontWeight: 600}}>{error.nama}</span> : ""}
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
              name="id_kategori"
              value={form.id_kategori}
              displayEmpty
              onChange={(e) => handleChange("id_kategori", e.target.value)}
              sx={{ borderRadius: 2, color: form.id_kategori ? 'inherit' : '#94A3B8' }}
            >
              <MenuItem value="" disabled>Pilih Kategori</MenuItem>
              {kategori?.map((k) => (
                <MenuItem key={k.id_kategori} value={k.id_kategori}>
                  {k.nama_kategori}
                </MenuItem>
              ))}
            </Select>
            {error.id_kategori && (
              <Typography variant="caption" sx={{ color: "#EF4444", fontWeight: 600, mt: 0.5 }}>{error.id_kategori}</Typography>
            )}
          </FormControl>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            SATUAN DASAR
          </Typography>
          <TextField
            placeholder="Strip, Tablet, Botol..."
            value={form.satuan}
            onChange={(e) => handleChange("satuan", e.target.value)}
            fullWidth
            size="small"
            error={!!error.satuan}
            helperText={error.satuan ? <span style={{color: '#EF4444', fontWeight: 600}}>{error.satuan}</span> : ""}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            STOK MINIMUM <span style={{ color: '#E91E63', fontWeight: 600, textTransform: 'none' }}>(Peringatan Stok Rendah)</span>
          </Typography>
          <TextField
            type="number"
            value={form.stokMinimum}
            onChange={(e) => handleChange("stokMinimum", e.target.value)}
            fullWidth
            size="small"
            error={!!error.stokMinimum}
            helperText={error.stokMinimum ? <span style={{color: '#EF4444', fontWeight: 600}}>{error.stokMinimum}</span> : ""}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              endAdornment: <Typography sx={{ color: '#94A3B8', fontSize: 14, fontWeight: 600 }}>Unit</Typography>
            }}
          />
        </Box>
        {mode === "add" && (
          <Box>
            <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
              STATUS PRODUK
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', height: 40, gap: 1 }}>
              <Switch
                checked={form.status}
                onChange={(e) => handleChange("status", e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#E91E63' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#E91E63' }
                }}
              />
              <Typography sx={{ fontWeight: 700, color: form.status ? '#E91E63' : '#94A3B8' }}>
                {form.status ? 'AKTIF' : 'NON-AKTIF'}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            HARGA JUAL
          </Typography>
          <TextField
            type="number"
            value={form.hargaJual}
            onChange={(e) => handleChange("hargaJual", e.target.value)}
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
        <Button type="submit" sx={{ flex: 1, fontWeight: 700, fontSize: 15, borderRadius: 2, bgcolor: '#E91E63', color: '#fff', '&:hover': { bgcolor: '#D81B60' }, boxShadow: '0 4px 14px rgba(233,30,99,0.3)', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
          {mode === "edit" && <SaveIcon fontSize="small" />}
          {mode === "add" ? "Simpan Produk" : "Simpan Perubahan"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProdukForm;
