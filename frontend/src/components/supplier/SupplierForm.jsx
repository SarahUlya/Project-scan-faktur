import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Button from "../ui/Button";
import StatusToggle from "../ui/StatusToggle";
import {
  formatPhoneInput,
  formatNameInput,
  validatePhoneNumber,
} from "../../utils/inputValidation";

const initialState = {
  nama: "",
  penanggungJawab: "",
  telepon: "",
  alamat: "",
  status: true,
};

const SupplierForm = ({ open, onClose, onSubmit, mode = "add", initialData }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        nama: initialData.nama || "",
        penanggungJawab: initialData.penanggungJawab || "",
        telepon: initialData.telepon || "",
        alamat: initialData.alamat || "",
        status: (initialData.status || "AKTIF") === "AKTIF",
      });
    } else {
      setForm(initialState);
    }
    setError({});
  }, [open, mode, initialData]);

  const handleChange = (name, value) => {
    // Validasi input khusus untuk telepon dan penanggungJawab
    if (name === "telepon") {
      value = formatPhoneInput(value);
    } else if (name === "penanggungJawab") {
      value = formatNameInput(value);
    }
    
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.nama.trim()) err.nama = "Nama supplier wajib diisi";
    if (!form.penanggungJawab.trim()) err.penanggungJawab = "Penanggung jawab wajib diisi";
    if (!form.telepon.trim()) {
      err.telepon = "No. telepon wajib diisi";
    } else if (!validatePhoneNumber(form.telepon)) {
      err.telepon = "No. telepon harus 10-13 digit";
    }
    if (!form.alamat.trim()) err.alamat = "Alamat wajib diisi";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const inisial = form.nama.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const data = {
      ...initialData,
      nama: form.nama,
      penanggungJawab: form.penanggungJawab,
      telepon: form.telepon,
      alamat: form.alamat,
      status: form.status ? "AKTIF" : "NONAKTIF",
      inisial,
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
            {mode === "add" ? "Input Supplier Baru" : "Edit Detail Supplier"}
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13, mt: 0.5 }}>
            {mode === "add"
              ? "Tambahkan informasi mitra pemasok obat ke dalam sistem."
              : "Perbarui informasi mitra pemasok pada sistem katalog."}
          </Typography>
        </Box>
      </Box>

      {mode === "edit" && initialData && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
              ID SUPPLIER
            </Typography>
            <TextField
              value={initialData.id}
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
          NAMA SUPPLIER <span style={{ color: '#EF4444' }}>*</span>
        </Typography>
        <TextField
          placeholder="Contoh: PT. Kimia Farma Trading"
          value={form.nama}
          onChange={(e) => handleChange("nama", e.target.value)}
          fullWidth
          size="small"
          error={!!error.nama}
          helperText={error.nama ? <span style={{ color: '#EF4444', fontWeight: 600 }}>{error.nama}</span> : ""}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mb: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            PENANGGUNG JAWAB <span style={{ color: '#EF4444' }}>*</span>
          </Typography>
          <TextField
            placeholder="Contoh: Budi Santoso"
            value={form.penanggungJawab}
            onChange={(e) => handleChange("penanggungJawab", e.target.value)}
            fullWidth
            size="small"
            error={!!error.penanggungJawab}
            helperText={error.penanggungJawab ? <span style={{ color: '#EF4444', fontWeight: 600 }}>{error.penanggungJawab}</span> : ""}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            NO. TELEPON <span style={{ color: '#EF4444' }}>*</span>
          </Typography>
          <TextField
            placeholder="08123456789"
            value={form.telepon}
            onChange={(e) => handleChange("telepon", e.target.value)}
            fullWidth
            size="small"
            error={!!error.telepon}
            helperText={error.telepon ? <span style={{ color: '#EF4444', fontWeight: 600 }}>{error.telepon}</span> : ""}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            inputProps={{ inputMode: "numeric" }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            ALAMAT <span style={{ color: '#EF4444' }}>*</span>
          </Typography>
          <TextField
            placeholder="Alamat lengkap supplier"
            value={form.alamat}
            onChange={(e) => handleChange("alamat", e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={2}
            error={!!error.alamat}
            helperText={error.alamat ? <span style={{ color: '#EF4444', fontWeight: 600 }}>{error.alamat}</span> : ""}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Box>
        <Box>
          <StatusToggle
            value={form.status}
            onChange={(value) => handleChange("status", value)}
            label="STATUS SUPPLIER"
            variant="horizontal"
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
          {mode === "add" ? "Simpan Supplier" : "Simpan Perubahan"}
        </Button>
      </Box>
    </Box>
  );
};

export default SupplierForm;
