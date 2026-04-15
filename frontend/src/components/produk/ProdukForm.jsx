import React, { useState, useEffect } from "react";
import Button from "../ui/Button";

const kategoriList = [
  "Obat",
  "Suplemen",
  "Alat Kesehatan",
  "Vitamin",
  "Herbal"
];
const satuanList = ["Strip", "Botol", "Box", "Tablet", "Pcs"];

const initialState = {
  nama: "",
  kategori: "",
  satuan: "",
  stokMinimum: 10,
  status: true,
};

const ProdukForm = ({ open, onClose, onSubmit, mode = "add", initialData }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        nama: initialData.nama || "",
        kategori: initialData.kategori || "",
        satuan: initialData.satuan || "",
        stokMinimum: initialData.stokMinimum || 10,
        status: initialData.status === "AKTIF",
      });
    } else {
      setForm(initialState);
    }
    setError({});
  }, [open, mode, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validate = () => {
    const err = {};
    if (!form.nama.trim()) err.nama = "Nama produk wajib diisi";
    if (!form.kategori) err.kategori = "Kategori wajib dipilih";
    if (!form.satuan) err.satuan = "Satuan wajib diisi";
    if (!form.stokMinimum || isNaN(form.stokMinimum)) err.stokMinimum = "Stok minimum wajib diisi";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      ...initialData,
      ...form,
      status: form.status ? "AKTIF" : "NON-AKTIF",
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ minWidth: 340, maxWidth: 420 }}>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
        {mode === "add" ? "Input Produk Baru" : "Edit Detail Produk"}
      </h2>
      <div style={{ color: "#B0B0B0", fontSize: 15, marginBottom: 18 }}>
        {mode === "add"
          ? "Tambahkan informasi obat ke dalam sistem."
          : "Perbarui informasi produk pada sistem katalog."}
      </div>
      {mode === "edit" && (
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>ID PRODUK</label>
            <input value={initialData.id} disabled style={{ width: "100%", background: "#F3F6F9", border: "none", borderRadius: 8, padding: 8, fontWeight: 700, marginTop: 2 }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>STATUS PRODUK</label>
            <select name="status" value={form.status ? "AKTIF" : "NON-AKTIF"} onChange={e => setForm(f => ({ ...f, status: e.target.value === "AKTIF" }))} style={{ width: "100%", background: "#F3F6F9", border: "none", borderRadius: 8, padding: 8, fontWeight: 700, marginTop: 2 }}>
              <option value="AKTIF">Aktif (Tersedia)</option>
              <option value="NON-AKTIF">Non-Aktif</option>
            </select>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>NAMA PRODUK *</label>
        <input
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Contoh: Paracetamol 500mg"
          style={{ width: "100%", border: error.nama ? "1.5px solid #F87171" : "1.5px solid #F3F6F9", borderRadius: 8, padding: 10, marginTop: 2, fontWeight: 700, fontSize: 15 }}
        />
        {error.nama && <div style={{ color: "#F87171", fontSize: 12, marginTop: 2 }}>{error.nama}</div>}
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>KATEGORI OBAT</label>
          <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            style={{ width: "100%", border: error.kategori ? "1.5px solid #F87171" : "1.5px solid #F3F6F9", borderRadius: 8, padding: 10, marginTop: 2, fontWeight: 700 }}
          >
            <option value="">Pilih Kategori</option>
            {kategoriList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          {error.kategori && <div style={{ color: "#F87171", fontSize: 12, marginTop: 2 }}>{error.kategori}</div>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>SATUAN DASAR</label>
          <input
            name="satuan"
            value={form.satuan}
            onChange={handleChange}
            placeholder="Strip, Tablet, Botol..."
            style={{ width: "100%", border: error.satuan ? "1.5px solid #F87171" : "1.5px solid #F3F6F9", borderRadius: 8, padding: 10, marginTop: 2, fontWeight: 700 }}
            list="satuan-list"
          />
          <datalist id="satuan-list">
            {satuanList.map((s) => <option key={s} value={s} />)}
          </datalist>
          {error.satuan && <div style={{ color: "#F87171", fontSize: 12, marginTop: 2 }}>{error.satuan}</div>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>STOK MINIMUM</label>
          <input
            name="stokMinimum"
            type="number"
            value={form.stokMinimum}
            onChange={handleChange}
            style={{ width: "100%", border: error.stokMinimum ? "1.5px solid #F87171" : "1.5px solid #F3F6F9", borderRadius: 8, padding: 10, marginTop: 2, fontWeight: 700 }}
            min={1}
          />
          {error.stokMinimum && <div style={{ color: "#F87171", fontSize: 12, marginTop: 2 }}>{error.stokMinimum}</div>}
        </div>
        {mode === "add" && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
              style={{ width: 22, height: 22, accentColor: "#E91E63" }}
              id="status-produk"
            />
            <label htmlFor="status-produk" style={{ color: form.status ? "#E91E63" : "#B0B0B0", fontWeight: 700, fontSize: 15 }}>
              AKTIF
            </label>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <Button type="button" variant="outlined" color="pink" sx={{ flex: 1, fontWeight: 700, fontSize: 15 }} onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" color="pink" sx={{ flex: 1, fontWeight: 700, fontSize: 15 }}>
          {mode === "add" ? "Simpan Produk" : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
};

export default ProdukForm;
