import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import usePembelianDb from "../hooks/usePembelianDb";
import useSupplierDb from "../hooks/useSupplierDb";
import useProdukDropdown from "../hooks/useProdukDropdown";
import FakturStepIndicator from "../components/pembelian/tambah/FakturStepIndicator";
import FakturSummaryPanel from "../components/pembelian/tambah/FakturSummaryPanel";
import FakturInfoForm from "../components/pembelian/tambah/FakturFormContent";
import FakturItemForm from "../components/pembelian/tambah/FakturItemForm";
import { generateBatchCode } from "../utils/batchCode";
import {
  defaultFakturInfo,
  emptyItem,
  hitungSubtotalItem,
} from "../config/apotek";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  pageHeaderSx,
} from "@/theme/designTokens";

const TambahFakturPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state;

  const { addPembelian } = usePembelianDb();
  const { produk } = useProdukDropdown();
  const { supplier } = useSupplierDb();

  const getOneYearLater = (baseDateStr) => {
    try {
      const d = baseDateStr ? new Date(baseDateStr) : new Date();
      if (isNaN(d.getTime())) return "";
      d.setFullYear(d.getFullYear() + 1);
      return d.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  const initialInfo = defaultFakturInfo();
  const [activeTab, setActiveTab] = useState("informasi");
  const [fakturInfo, setFakturInfo] = useState(initialInfo);
  const [kodeBatch, setKodeBatch] = useState(() =>
    generateBatchCode(initialInfo.no_faktur, initialInfo.tanggal)
  );
  const [batchManual, setBatchManual] = useState(false);
  const [items, setItems] = useState(() => {
    const initial = emptyItem();
    initial.exp_date = getOneYearLater(initialInfo.tanggal);
    return [initial];
  });
  const [barcodeInput, setBarcodeInput] = useState("");
  const barcodeInputRef = useRef(null);

  // ⚡ State error server — untuk tampil pesan yang jelas
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const inputRefs = useRef({
    exp_date: {},
    harga_beli: {},
    harga_jual: {},
    qty: {},
    diskon: {},
  });

  const recalcItem = (item) => ({
    ...item,
    total: hitungSubtotalItem(item),
  });

  // Auto-fill dari Buku Defecta
  useEffect(() => {
    if (stateData && stateData.items && supplier.length > 0) {
      if (stateData.supplier) {
        const matchedSupplier = supplier.find(
          (s) => (s.nama_supplier || s.nama) === stateData.supplier
        );
        if (matchedSupplier) {
          setFakturInfo((prev) => ({
            ...prev,
            supplier_id: matchedSupplier.id_supplier || matchedSupplier.id,
            supplier_name:
              matchedSupplier.nama_supplier || matchedSupplier.nama,
          }));
        }
      }

      const mappedItems = stateData.items.map((item) => {
        const newId = Date.now() + Math.random();
        const defaultHpp = 15000;
        const qtyOrder = item.saran_order || 1;

        return recalcItem({
          ...emptyItem(),
          id: newId,
          produk_id: item.id_produk,
          nama_produk: item.nama_produk,
          satuan: item.satuan || "Pcs",
          qty: qtyOrder,
          harga_beli: defaultHpp,
          harga_jual: defaultHpp * 1.3,
          exp_date: getOneYearLater(initialInfo.tanggal),
          diskon: 0,
          diskon_tipe: "%",
        });
      });

      setItems(mappedItems);
    }
  }, [stateData, supplier]);

  useEffect(() => {
    if (activeTab === "barang") {
      setTimeout(() => barcodeInputRef.current?.focus(), 100);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!batchManual) {
      setKodeBatch(generateBatchCode(fakturInfo.no_faktur, fakturInfo.tanggal));
    }
  }, [fakturInfo.no_faktur, fakturInfo.tanggal, batchManual]);

  const setInfo = (field, value) => {
    setFakturInfo((prev) => ({ ...prev, [field]: value }));

    // ⚡ Reset server error kalau user ubah no_faktur
    if (field === "no_faktur" && serverError) {
      setServerError("");
    }

    if (field === "tanggal") {
      const newExpDate = getOneYearLater(value);
      const oldExpDate = getOneYearLater(fakturInfo.tanggal);

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (!item.exp_date || item.exp_date === oldExpDate) {
            return { ...item, exp_date: newExpDate };
          }
          return item;
        })
      );
    }
  };

  const handleBatchChange = useCallback((value) => {
    setKodeBatch(value);
    setBatchManual(true);
  }, []);

  const handleBatchModeChange = useCallback(
    (manual) => {
      setBatchManual(manual);
      if (!manual) {
        setKodeBatch(
          generateBatchCode(fakturInfo.no_faktur, fakturInfo.tanggal)
        );
      }
    },
    [fakturInfo.no_faktur, fakturInfo.tanggal]
  );

  const focusRowInput = (itemId, field) => {
    const el = inputRefs.current[field]?.[itemId];
    if (el) {
      el.focus();
      if (el.select) el.select();
    }
  };

  const handleInputKeyDown = (e, itemId, field) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    if (field === "exp_date") focusRowInput(itemId, "harga_beli");
    else if (field === "harga_beli") focusRowInput(itemId, "harga_jual");
    else if (field === "harga_jual") focusRowInput(itemId, "qty");
    else if (field === "qty") focusRowInput(itemId, "diskon");
    else if (field === "diskon") {
      barcodeInputRef.current?.focus();
      barcodeInputRef.current?.select();
    }
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = recalcItem({ ...item, [field]: value });

        if (field === "produk_id") {
          const p = produk.find((x) => String(x.id_produk) === String(value));
          if (p) {
            updated.nama_produk = p.nama_produk;
            updated.harga_beli = p.harga_beli || 0;
            updated.harga_jual = p.harga_jual || 0;
            updated.id_satuan = p.satuan_id;
            updated.satuan = p.satuan?.nama || "";
            updated.barcode = p.barcode;
            updated.exp_date = getOneYearLater(fakturInfo.tanggal);
          }
        }

        return updated;
      })
    );
  };

  /* ══════════════════════════════════════════════════════════════════
   * ⚡ Tambah produk — increment qty kalau sudah ada
   * ══════════════════════════════════════════════════════════════════ */
  const tambahProdukKeItems = (foundProduct) => {
    if (!foundProduct) return;

    const targetId = String(
      foundProduct.id_produk ?? foundProduct.id ?? ""
    ).trim();
    const targetName = String(
      foundProduct.nama_produk || foundProduct.nama || ""
    )
      .trim()
      .toLowerCase();

    setItems((prev) => {
      const existingIdx = prev.findIndex((it) => {
        const itId = String(it.produk_id ?? "").trim();
        const itName = String(it.nama_produk ?? "").trim().toLowerCase();
        return (
          (targetId && itId === targetId) ||
          (targetName && itName === targetName)
        );
      });

      // Sudah ada → increment
      if (existingIdx !== -1) {
        const updated = [...prev];
        const currentItem = updated[existingIdx];
        const newQty = (Number(currentItem.qty) || 0) + 1;
        updated[existingIdx] = recalcItem({
          ...currentItem,
          qty: newQty,
        });
        return updated;
      }

      // Belum ada → tambah baris
      const newId = Date.now() + Math.floor(Math.random() * 1000);
      const newItem = recalcItem({
        id: newId,
        produk_id: foundProduct.id_produk ?? foundProduct.id,
        nama_produk: foundProduct.nama_produk || foundProduct.nama,
        exp_date: getOneYearLater(fakturInfo.tanggal),
        qty: 1,
        satuan:
          foundProduct.nama_satuan ||
          foundProduct.satuan?.nama ||
          "Pcs",
        harga_beli: foundProduct.harga_beli || 0,
        harga_jual: foundProduct.harga_jual || 0,
        diskon: 0,
        diskon_tipe: "%",
        total: 0,
      });

      const emptyIdx = prev.findIndex((it) => !it.produk_id);
      if (emptyIdx !== -1) {
        return prev.map((it, i) => (i === emptyIdx ? newItem : it));
      }
      return [...prev, newItem];
    });

    setBarcodeInput("");
    setTimeout(() => barcodeInputRef.current?.focus(), 50);
  };

  const handleBarcodeScan = (input) => {
    const query = String(input || "").trim();
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    const foundProduct = produk.find(
      (p) =>
        String(p.barcode || "").trim() === query ||
        String(p.nama_produk || "").trim().toLowerCase() === lowerQuery
    );

    if (!foundProduct) {
      setBarcodeInput("");
      barcodeInputRef.current?.focus();
      return;
    }

    tambahProdukKeItems(foundProduct);
  };

  const handleSelectProduk = (product) => {
    tambahProdukKeItems(product);
  };

  const handleBarcodeBlur = (e) => {
    const target = e.relatedTarget;
    const isInteractive =
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "BUTTON" ||
        target.getAttribute("role") === "button" ||
        target.closest("button") ||
        target.closest(".MuiSelect-root") ||
        target.closest(".MuiButtonBase-root") ||
        target.closest(".MuiAutocomplete-popper"));

    if (!isInteractive && activeTab === "barang") {
      setTimeout(() => barcodeInputRef.current?.focus(), 50);
    }
  };

  const handleTambahBaris = () => {
    const newId = Date.now() + Math.random();
    setItems((prev) => [
      ...prev,
      {
        ...emptyItem(),
        id: newId,
        exp_date: getOneYearLater(fakturInfo.tanggal),
      },
    ]);
  };

  const handleHapusBaris = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    } else {
      const initial = emptyItem();
      initial.exp_date = getOneYearLater(fakturInfo.tanggal);
      setItems([initial]);
    }
  };

  const validItemCount = items.filter(
    (it) => it.produk_id && it.qty > 0
  ).length;
  const subtotalBruto = items.reduce((acc, it) => acc + (it.total || 0), 0);
  const nilaiPpn = Number(fakturInfo.nilai_ppn) || 11;
  const ppn =
    fakturInfo.jenis_ppn === "non_ppn"
      ? 0
      : fakturInfo.jenis_ppn === "sudah_termasuk"
      ? Math.round(subtotalBruto - subtotalBruto / (1 + nilaiPpn / 100))
      : Math.round(subtotalBruto * (nilaiPpn / 100));
  const grandTotal =
    fakturInfo.jenis_ppn === "sudah_termasuk"
      ? subtotalBruto
      : subtotalBruto + ppn;
  const grandTotalSetelahCashback = Math.max(
    0,
    grandTotal - (Number(fakturInfo.cashback) || 0)
  );
  const isKredit = fakturInfo.jenis_pembayaran === "Kredit";

  /* ══════════════════════════════════════════════════════════════════
   * ⚡ Auto-generate nomor faktur unik (tambah suffix timestamp)
   * ══════════════════════════════════════════════════════════════════ */
  const generateUniqueNoFaktur = () => {
    const base = (fakturInfo.no_faktur || "INV").trim();
    const now = new Date();
    const suffix =
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");
    // Kalau sudah ada "-01", "-02", naikkan
    const match = base.match(/-(\d+)$/);
    if (match) {
      const next = String(Number(match[1]) + 1).padStart(2, "0");
      return base.replace(/-\d+$/, `-${next}`);
    }
    return `${base}-${suffix}`;
  };

  /* ══════════════════════════════════════════════════════════════════
   * ⚡ HANDLE SIMPAN — dengan handling error yang jelas
   * ══════════════════════════════════════════════════════════════════ */
  const handleSimpan = async () => {
    setServerError("");

    if (
      !fakturInfo.supplier_id ||
      !fakturInfo.tanggal ||
      !fakturInfo.no_faktur
    ) {
      alert("Harap isi Supplier, No. Faktur, dan Tanggal Faktur!");
      setActiveTab("informasi");
      return;
    }

    const validItems = items.filter((it) => it.produk_id && it.qty > 0);
    if (validItems.length === 0) {
      alert("Harap isi minimal 1 item produk dengan kuantitas > 0");
      setActiveTab("barang");
      return;
    }

    const finalBatch = (
      kodeBatch || generateBatchCode(fakturInfo.no_faktur, fakturInfo.tanggal)
    ).trim();
    if (!finalBatch) {
      alert("Kode batch wajib diisi.");
      return;
    }

    const incompleteExp = validItems.some((it) => !it.exp_date);
    if (
      incompleteExp &&
      !window.confirm("Ada item tanpa tanggal expired. Tetap simpan?")
    ) {
      return;
    }

    const itemsWithBatch = validItems.map((it) => ({
      ...it,
      no_batch: finalBatch,
    }));

    setIsSaving(true);

    try {
      await addPembelian(
        {
          ...fakturInfo,
          total: grandTotalSetelahCashback,
          kode_batch: finalBatch,
        },
        itemsWithBatch
      );

      alert("Faktur berhasil disimpan! Stok dan batch otomatis terupdate.");
      navigate("/pembelian");
    } catch (e) {
      console.error("[Simpan Faktur] error:", e);
      const msg = String(
        e?.response?.data?.message || e?.message || ""
      );

      // ⚡ Deteksi error "unique constraint" (no_faktur duplikat)
      if (
        msg.includes("Pembelian_no_faktur_key") ||
        msg.toLowerCase().includes("unique constraint") ||
        msg.toLowerCase().includes("no_faktur")
      ) {
        const suggested = generateUniqueNoFaktur();
        const userConfirm = window.confirm(
          `⚠️ Nomor Faktur "${fakturInfo.no_faktur}" sudah pernah dipakai.\n\n` +
            `Ganti nomor faktur menjadi "${suggested}" dan simpan ulang?\n\n` +
            `Klik OK untuk ganti otomatis, Cancel untuk ganti manual.`
        );

        if (userConfirm) {
          setFakturInfo((prev) => ({ ...prev, no_faktur: suggested }));
          setServerError(
            `Nomor faktur diganti otomatis ke "${suggested}". Klik Simpan lagi.`
          );
          setActiveTab("informasi");
        } else {
          setServerError(
            `Nomor Faktur "${fakturInfo.no_faktur}" sudah pernah dipakai. ` +
              `Ganti nomor faktur di Langkah 1, lalu klik Simpan lagi.`
          );
          setActiveTab("informasi");
        }
      } else {
        setServerError(
          msg || "Terjadi kesalahan saat menyimpan faktur."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        px: spacing.xxl,
        pt: spacing.xxl,
        pb: spacing.xxl,
        display: "flex",
        flexDirection: "column",
        gap: spacing.xxl,
      }}
    >
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: spacing.xxl,
          borderRadius: radii.s,
          border: `1px solid ${colors.borderLight}`,
          bgcolor: colors.bgCard,
          boxShadow: shadows.card,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <IconButton
            size="small"
            onClick={() => navigate("/pembelian")}
            sx={{
              bgcolor: colors.bgMuted,
              color: colors.textSecondary,
              borderRadius: radii.xs,
              "&:hover": { bgcolor: colors.border },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography
            sx={{
              fontSize: typography.caption,
              fontWeight: typography.semibold,
              color: colors.textMuted,
              letterSpacing: 0.5,
            }}
          >
            Pembelian / Tambah Faktur
          </Typography>
        </Box>
        <Typography sx={pageHeaderSx.title}>
          Tambah Penerimaan Barang
        </Typography>
        <Typography
          sx={{
            color: colors.textSecondary,
            fontSize: typography.body,
            mt: 0.5,
          }}
        >
          Isi faktur, tentukan kode batch, lalu tambahkan produk.
        </Typography>
      </Paper>

      {/* ⚡ SERVER ERROR BANNER */}
      {serverError && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            px: 2.5,
            borderRadius: radii.sm,
            border: `1px solid ${colors.danger}`,
            bgcolor: colors.dangerLight,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: typography.body,
                fontWeight: typography.bold,
                color: colors.danger,
                mb: 0.5,
              }}
            >
              ⚠️ Gagal Menyimpan Faktur
            </Typography>
            <Typography sx={{ fontSize: typography.caption, color: colors.text }}>
              {serverError}
            </Typography>
          </Box>
          <Box
            component="button"
            onClick={() => setServerError("")}
            sx={{
              bgcolor: "transparent",
              border: "none",
              color: colors.danger,
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "inherit",
              padding: 0.5,
            }}
          >
            ✕
          </Box>
        </Paper>
      )}

      {/* STEP INDICATOR */}
      <FakturStepIndicator
        activeStep={activeTab}
        onChange={setActiveTab}
        itemCount={validItemCount}
      />

      {/* CONTENT GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 300px" },
          gap: spacing.xxl,
          alignItems: "start",
        }}
      >
        <Box>
          {activeTab === "informasi" && (
            <FakturInfoForm
              fakturInfo={fakturInfo}
              setInfo={setInfo}
              setFakturInfo={setFakturInfo}
              supplier={supplier}
              isKredit={isKredit}
              kodeBatch={kodeBatch}
              batchManual={batchManual}
              onBatchChange={handleBatchChange}
              onBatchModeChange={handleBatchModeChange}
              onNext={() => setActiveTab("barang")}
            />
          )}

          {activeTab === "barang" && (
            <FakturItemForm
              items={items}
              produk={produk}
              kodeBatch={kodeBatch}
              barcodeInput={barcodeInput}
              setBarcodeInput={setBarcodeInput}
              barcodeInputRef={barcodeInputRef}
              inputRefs={inputRefs}
              handleSelectProduk={handleSelectProduk}
              onBarcodeScan={handleBarcodeScan}
              onBarcodeBlur={handleBarcodeBlur}
              handleInputKeyDown={handleInputKeyDown}
              updateItem={updateItem}
              handleTambahBaris={handleTambahBaris}
              handleHapusBaris={handleHapusBaris}
            />
          )}
        </Box>

        <FakturSummaryPanel
          supplierName={fakturInfo.supplier_name}
          kodeBatch={kodeBatch}
          itemCount={validItemCount}
          subtotal={subtotalBruto}
          ppn={ppn}
          nilaiPpn={nilaiPpn}
          cashback={fakturInfo.cashback}
          grandTotal={grandTotalSetelahCashback}
          onSimpan={handleSimpan}
          onBatal={() => navigate("/pembelian")}
          isSaving={isSaving}
        />
      </Box>
    </Box>
  );
};

export default TambahFakturPage;