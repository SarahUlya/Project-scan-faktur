import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePembelianDb from "../hooks/usePembelianDb";
import useProdukDb from "../hooks/useProdukDb";
import useSupplierDb from "../hooks/useSupplierDb";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BarcodeTambahProdukModal from "../components/pembelian/BarcodeTambahProdukModal";
import {
  defaultFakturInfo,
  emptyItem,
  hitungSubtotalItem,
  JENIS_PPN_OPTIONS,
  NILAI_PPN_OPTIONS,
  GUDANG_OPTIONS,
  JENIS_PEMBAYARAN_OPTIONS,
  AKUN_KAS_OPTIONS,
  SATUAN_OPTIONS,
} from "../config/fakturFormConfig";

const labelStyle = {
  display: "block",
  color: "#64748B",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #E2E8F0",
  fontSize: 14,
  color: "#1E293B",
  outline: "none",
};

const Field = ({ label, required, children }) => (
  <div>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "#E11D48" }}> *</span>}
    </label>
    {children}
  </div>
);

const TambahFakturPage = () => {
  const navigate = useNavigate();
  const { addPembelian } = usePembelianDb();
  const { produk } = useProdukDb();
  const { supplier } = useSupplierDb();

  const [fakturInfo, setFakturInfo] = useState(defaultFakturInfo);
  const [items, setItems] = useState([emptyItem()]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scanModal, setScanModal] = useState({ open: false, produk: null });
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  const setInfo = (field, value) => {
    setFakturInfo((prev) => ({ ...prev, [field]: value }));
  };

  const recalcItem = (item) => ({
    ...item,
    total: hitungSubtotalItem(item),
  });

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = recalcItem({
          ...item,
          [field]: value,
        });

        if (field === "produk_id") {
          const p = produk.find(
            (x) =>
              String(x.id_produk) ===
              String(value)
          );

          if (p) {
            updated.nama_produk =
              p.nama_produk;

            updated.harga_satuan =
              p.harga_beli ||
              p.harga_jual ||
              0;

            updated.satuan =
              p.nama_satuan ||
              p.satuan ||
              "Pcs";

            updated.barcode =
              p.barcode; // ← tambahkan ini
          }
        }

        return updated;
      })
    );
  };

  const handleBarcodeScan = (e) => {
    if (e.key !== "Enter") return;
    const barcode = barcodeInput.trim();
    if (!barcode) return;

    const foundProduct = produk.find((p) => p.barcode === barcode);
    if (!foundProduct) {
      alert("Produk tidak ditemukan untuk barcode tersebut.");
      setBarcodeInput("");
      return;
    }

    setScanModal({ open: true, produk: foundProduct });
    setBarcodeInput("");
  };

  const handleKonfirmasiScan = ({ produk_id, nama_produk, qty, satuan, harga_satuan }) => {
    const existing = items.find(
      (it) =>
        it.produk_id === produk_id &&
        it.satuan === satuan &&
        !it.no_batch
    );

    if (existing) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === existing.id
            ? recalcItem({
              ...it,
              qty: (it.qty || 0) + qty,
              harga_satuan: harga_satuan || it.harga_satuan,
            })
            : it
        )
      );
    } else {
      const emptyIdx = items.findIndex((it) => !it.produk_id);
      const newItem = recalcItem({
        id: Date.now(),
        produk_id,
        nama_produk,
        no_batch: "",
        exp_date: "",
        qty,
        satuan,
        harga_satuan,
        diskon: 0,
        diskon_tipe: "%",
        total: 0,
      });

      if (emptyIdx !== -1) {
        setItems((prev) => prev.map((it, i) => (i === emptyIdx ? newItem : it)));
      } else {
        setItems((prev) => [...prev, newItem]);
      }
    }
    barcodeInputRef.current?.focus();
  };

  const handleTambahBaris = () => setItems((prev) => [...prev, emptyItem()]);

  const handleHapusBaris = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    } else {
      setItems([emptyItem()]);
    }
  };

  const subtotalBruto = items.reduce((acc, it) => acc + (it.total || 0), 0);
  const nilaiPpn = Number(fakturInfo.nilai_ppn) || 11;
  const ppn =
    fakturInfo.jenis_ppn === "sudah_termasuk"
      ? Math.round(subtotalBruto - subtotalBruto / (1 + nilaiPpn / 100))
      : Math.round(subtotalBruto * (nilaiPpn / 100));
  const grandTotal =
    fakturInfo.jenis_ppn === "sudah_termasuk"
      ? subtotalBruto
      : subtotalBruto + ppn;
  const grandTotalSetelahCashback = Math.max(0, grandTotal - (Number(fakturInfo.cashback) || 0));

  const handleSimpan = async () => {
    if (!fakturInfo.supplier_id || !fakturInfo.tanggal || !fakturInfo.no_faktur) {
      alert("Harap isi Supplier, No. Faktur, dan Tanggal Faktur!");
      return;
    }

    const validItems = items.filter((it) => it.produk_id && it.qty > 0);
    if (validItems.length === 0) {
      alert("Harap isi minimal 1 item produk dengan kuantitas > 0");
      return;
    }

    const incompleteBatch = validItems.some((it) => !it.no_batch || !it.exp_date);
    if (incompleteBatch && !window.confirm("Ada item tanpa batch/ED. Tetap simpan?")) {
      return;
    }

    try {
      await addPembelian(
        {
          ...fakturInfo,
          total: grandTotalSetelahCashback,
        },
        validItems
      );
      alert("Faktur berhasil disimpan! Stok dan batch otomatis terupdate.");
      navigate("/pembelian");
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat menyimpan faktur.");
    }
  };

  const isKredit = fakturInfo.jenis_pembayaran === "Kredit";

  return (
    <Box>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", gap: 8, color: "#EC4899", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/pembelian")}>PEMBELIAN</span>
            <span style={{ color: "#94A3B8" }}>&gt;</span>
            <span>TAMBAH PENERIMAAN BARANG</span>
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 28, color: "#1E293B" }}>Tambah Data Faktur Pembelian</h2>
          <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 15 }}>
            Isi informasi faktur lengkap, tambah produk via barcode atau manual.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" onClick={() => navigate("/pembelian")} style={{ background: "none", border: "none", color: "#64748B", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
            Batal
          </button>
          <button type="button" onClick={handleSimpan} style={{ padding: "14px 24px", borderRadius: 12, background: "#10B981", color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)" }}>
            Simpan Faktur
          </button>
        </div>
      </div>

      {/* Scan barcode */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, background: "#FDF2F8", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#E91E63" }}>
            <QrCodeScannerIcon />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#1E293B" }}>Scan Barcode Produk</div>
            <div style={{ color: "#64748B", fontSize: 14 }}>Setelah scan, konfirmasi kuantitas & satuan di popup.</div>
          </div>
        </div>
        <input
          ref={barcodeInputRef}
          type="text"
          placeholder="Arahkan scanner ke sini lalu Enter..."
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyDown={handleBarcodeScan}
          style={{ ...inputStyle, width: 280, border: "2px solid #FCE7F3", background: "#FFF1F2", color: "#E91E63", fontWeight: 700, textAlign: "center" }}
          autoFocus={true}
        />
      </div>

      {/* Informasi faktur */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 800, color: "#1E293B" }}>Informasi Utama Faktur</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          <Field label="Supplier" required>
            <select
              value={fakturInfo.supplier_id ? `${fakturInfo.supplier_id}|${fakturInfo.supplier_name}` : ""}
              onChange={(e) => {
                const [id, name] = e.target.value.split("|");
                setFakturInfo((p) => ({ ...p, supplier_id: id, supplier_name: name }));
              }}
              style={inputStyle}
            >
              <option value="">Pilih Supplier</option>
              {supplier.map((s) => (
                <option
                  key={s.id}
                  value={`${s.id}|${s.nama}`}
                >
                  {s.nama}
                </option>
              ))}
            </select>
          </Field>
          <Field label="No. Surat Pesanan" required>
            <input type="text" placeholder="No. PO / SP" value={fakturInfo.no_surat_pesanan} onChange={(e) => setInfo("no_surat_pesanan", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="No. Faktur" required>
            <input type="text" placeholder="INV/2026/001" value={fakturInfo.no_faktur} onChange={(e) => setInfo("no_faktur", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Tanggal Faktur" required>
            <input type="date" value={fakturInfo.tanggal} onChange={(e) => setInfo("tanggal", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Tanggal Penerimaan">
            <input type="datetime-local" value={fakturInfo.tanggal_penerimaan} onChange={(e) => setInfo("tanggal_penerimaan", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Jenis PPN">
            <select value={fakturInfo.jenis_ppn} onChange={(e) => setInfo("jenis_ppn", e.target.value)} style={inputStyle}>
              {JENIS_PPN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Nilai PPN">
            <select value={fakturInfo.nilai_ppn} onChange={(e) => setInfo("nilai_ppn", Number(e.target.value))} style={inputStyle}>
              {NILAI_PPN_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}%</option>
              ))}
            </select>
          </Field>
          <Field label="Gudang Penerima" required>
            <select value={fakturInfo.gudang} onChange={(e) => setInfo("gudang", e.target.value)} style={inputStyle}>
              {GUDANG_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Jenis Pembayaran" required>
            <select value={fakturInfo.jenis_pembayaran} onChange={(e) => setInfo("jenis_pembayaran", e.target.value)} style={inputStyle}>
              {JENIS_PEMBAYARAN_OPTIONS.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </Field>
          <Field label="Akun Kas Pembayaran" required>
            <select value={fakturInfo.akun_kas} onChange={(e) => setInfo("akun_kas", e.target.value)} style={inputStyle}>
              {AKUN_KAS_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
          {isKredit && (
            <Field label="Jatuh Tempo Pembayaran">
              <input type="date" value={fakturInfo.jatuh_tempo} onChange={(e) => setInfo("jatuh_tempo", e.target.value)} style={inputStyle} />
            </Field>
          )}
          <Field label="Cashback (Rp)">
            <input type="number" min={0} value={fakturInfo.cashback} onChange={(e) => setInfo("cashback", Number(e.target.value) || 0)} style={inputStyle} />
          </Field>
          <Field label="Catatan">
            <input type="text" placeholder="Opsional" value={fakturInfo.catatan} onChange={(e) => setInfo("catatan", e.target.value)} style={inputStyle} />
          </Field>
        </div>
      </div>

      {/* Tabel item */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1E293B" }}>Daftar Item Barang</h3>
          <button type="button" onClick={handleTambahBaris} style={{ padding: "8px 16px", borderRadius: 8, background: "#E91E63", color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            + TAMBAH BARIS
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #F1F5F9" }}>
                {["No", "Produk", "Exp. Date", "No. Batch", "Kuantitas", "Satuan", "Harga Beli", "Diskon", "Sub Total", "Aksi"].map((h) => (
                  <th key={h} style={{ padding: "12px 10px", fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", textAlign: h === "Sub Total" || h === "Harga Beli" ? "right" : "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: 10, color: "#94A3B8", fontWeight: 600 }}>{index + 1}</td>
                  <td style={{ padding: 10, minWidth: 200 }}>
                    <select value={item.produk_id} onChange={(e) => updateItem(item.id, "produk_id", e.target.value)} style={{ ...inputStyle, fontWeight: item.produk_id ? 600 : 400 }}>
                      <option value="" disabled>Pilih produk...</option>
                      {produk.map((p) => (
                        <option key={p.id_produk} value={p.id_produk}>{p.nama_produk}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: 10 }}>
                    <input type="date" value={item.exp_date} onChange={(e) => updateItem(item.id, "exp_date", e.target.value)} style={inputStyle} />
                  </td>
                  <td style={{ padding: 10 }}>
                    <input type="text" placeholder="BATCH-..." value={item.no_batch} onChange={(e) => updateItem(item.id, "no_batch", e.target.value)} style={inputStyle} />
                  </td>
                  <td style={{ padding: 10, width: 90 }}>
                    <input type="number" min={0} value={item.qty || ""} onChange={(e) => updateItem(item.id, "qty", parseInt(e.target.value, 10) || 0)} style={{ ...inputStyle, textAlign: "center" }} />
                  </td>
                  <td style={{ padding: 10, width: 110 }}>
                    <select value={item.satuan} onChange={(e) => updateItem(item.id, "satuan", e.target.value)} style={inputStyle}>
                      {SATUAN_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: 10, width: 120 }}>
                    <input type="number" min={0} value={item.harga_satuan || ""} onChange={(e) => updateItem(item.id, "harga_satuan", parseInt(e.target.value, 10) || 0)} style={{ ...inputStyle, textAlign: "right" }} />
                  </td>
                  <td style={{ padding: 10, width: 120 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <select value={item.diskon_tipe} onChange={(e) => updateItem(item.id, "diskon_tipe", e.target.value)} style={{ ...inputStyle, width: 52, padding: "8px 4px" }}>
                        <option value="%">%</option>
                        <option value="Rp">Rp</option>
                      </select>
                      <input type="number" min={0} value={item.diskon || ""} onChange={(e) => updateItem(item.id, "diskon", parseFloat(e.target.value) || 0)} style={{ ...inputStyle, flex: 1 }} />
                    </div>
                  </td>
                  <td style={{ padding: 10, textAlign: "right", fontWeight: 800, color: "#1E293B", whiteSpace: "nowrap" }}>
                    Rp {(item.total || 0).toLocaleString("id-ID")}
                  </td>
                  <td style={{ padding: 10, textAlign: "center" }}>
                    <button type="button" onClick={() => handleHapusBaris(item.id)} style={{ background: "#FFF1F2", border: "none", borderRadius: 8, color: "#E11D48", cursor: "pointer", padding: 8 }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, gap: 32, flexWrap: "wrap" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600 }}>Subtotal</div>
            <div style={{ fontWeight: 700 }}>Rp {subtotalBruto.toLocaleString("id-ID")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600 }}>PPN ({nilaiPpn}%)</div>
            <div style={{ fontWeight: 700 }}>Rp {ppn.toLocaleString("id-ID")}</div>
          </div>
          {fakturInfo.cashback > 0 && (
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600 }}>Cashback</div>
              <div style={{ fontWeight: 700, color: "#10B981" }}>- Rp {Number(fakturInfo.cashback).toLocaleString("id-ID")}</div>
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#64748B", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Grand Total</div>
            <div style={{ color: "#E11D48", fontWeight: 800, fontSize: 22 }}>Rp {grandTotalSetelahCashback.toLocaleString("id-ID")}</div>
          </div>
        </div>
      </div>

      <BarcodeTambahProdukModal
        open={scanModal.open}
        produk={scanModal.produk}
        onClose={() => setScanModal({ open: false, produk: null })}
        onConfirm={handleKonfirmasiScan}
      />
    </Box>
  );
};

export default TambahFakturPage;
