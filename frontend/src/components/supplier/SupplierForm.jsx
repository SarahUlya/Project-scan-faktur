import React, { useState, useEffect } from "react";
import Button from "../ui/Button";

const statusList = [
  { value: "AKTIF", label: "Aktif" },
  { value: "NONAKTIF", label: "Nonaktif" },
];

const initialState = {
  nama: "",
  penanggungJawab: "",
  telepon: "",
  alamat: "",
  status: "AKTIF",
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
        status: initialData.status || "AKTIF",
      });
    } else {
      setForm(initialState);
    }
    setError({});
  }, [open, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.nama.trim()) err.nama = "Nama supplier wajib diisi";
    if (!form.penanggungJawab.trim()) err.penanggungJawab = "Penanggung jawab wajib diisi";
    if (!form.telepon.trim()) err.telepon = "No. telepon wajib diisi";
    if (!form.alamat.trim()) err.alamat = "Alamat wajib diisi";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const inisial = form.nama.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0,2);
    const data = {
      ...initialData,
      ...form,
      inisial,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ minWidth: 340, maxWidth: 420 }}>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
        {mode === "add" ? "Tambah Supplier" : "Edit Supplier"}
      </h2>
      <div style={{ color: "#B0B0B0", fontSize: 15, marginBottom: 18 }}>
        {mode === "add"
          ? "Tambahkan informasi supplier ke dalam sistem."
          : "Perbarui informasi supplier pada sistem."}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>NAMA SUPPLIER *</label>
        <input
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Contoh: Kimia Farma Trading"
          style={{ width: "100%", border: error.nama ? "1.5px solid #F87171" : "1.5px solid #F3F6F9", borderRadius: 8, padding: 10, marginTop: 2, fontWeight: 700, fontSize: 15 }}
        />
        {error.nama && <div style={{ color: "#F87171", fontSize: 12, marginTop: 2 }}>{error.nama}</div>}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>PENANGGUNG JAWAB *</label>
        <input
          name="penanggungJawab"
          value={form.penanggungJawab}
          onChange={handleChange}
          placeholder="Contoh: Budi Santoso"
          style={{ width: "100%", border: error.penanggungJawab ? "1.5px solid #F87171" : "1.5px solid #F3F6F9", borderRadius: 8, padding: 10, marginTop: 2, fontWeight: 700, fontSize: 15 }}
        />
        {error.penanggungJawab && <div style={{ color: "#F87171", fontSize: 12, marginTop: 2 }}>{error.penanggungJawab}</div>}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>NO. TELEPON *</label>
        <input
          name="telepon"
          value={form.telepon}
          onChange={handleChange}
          placeholder="0812-3456-7890"
          style={{ width: "100%", border: error.telepon ? "1.5px solid #F87171" : "1.5px solid #F3F6F9", borderRadius: 8, padding: 10, marginTop: 2, fontWeight: 700, fontSize: 15 }}
        />
        {error.telepon && <div style={{ color: "#F87171", fontSize: 12, marginTop: 2 }}>{error.telepon}</div>}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>ALAMAT *</label>
        <input
          name="alamat"
          value={form.alamat}
          onChange={handleChange}
          placeholder="Alamat lengkap"
          style={{ width: "100%", border: error.alamat ? "1.5px solid #F87171" : "1.5px solid #F3F6F9", borderRadius: 8, padding: 10, marginTop: 2, fontWeight: 700, fontSize: 15 }}
        />
        {error.alamat && <div style={{ color: "#F87171", fontSize: 12, marginTop: 2 }}>{error.alamat}</div>}
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontWeight: 700, fontSize: 13, color: "#B0B0B0" }}>STATUS</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ width: "100%", border: "1.5px solid #F3F6F9", borderRadius: 8, padding: 10, marginTop: 2, fontWeight: 700 }}
        >
          {statusList.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <Button type="button" variant="outlined" color="pink" sx={{ flex: 1, fontWeight: 700, fontSize: 15 }} onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" color="pink" sx={{ flex: 1, fontWeight: 700, fontSize: 15 }}>
          {mode === "add" ? "Simpan Supplier" : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
};

export default SupplierForm;
