import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import usePembelianDb from "../hooks/usePembelianDb";
import useSupplierDb from "../hooks/useSupplierDb";
import useProdukDropdown from "../hooks/useProdukDropdown";
import FakturStepIndicator from "../components/pembelian/tambah/FakturStepIndicator";
import FakturSummaryPanel from "../components/pembelian/tambah/FakturSummaryPanel";
import { FakturInfoForm, FakturItemForm } from "../components/pembelian/tambah/FakturFormContent";
import { generateBatchCode } from "../utils/batchCode";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  zIndex,
  fieldInputSx,
  pageHeaderSx,
  statCardSx,
} from "@/theme/designTokens"; import {
  defaultFakturInfo,
  emptyItem,
  hitungSubtotalItem,
} from "../config/apotek";

const TambahFakturPage = () => {
  const navigate = useNavigate();
  const { addPembelian } = usePembelianDb();
  const { produk } = useProdukDropdown();
  const { supplier } = useSupplierDb();

  const getOneYearLater = (baseDateStr) => {
    if (!baseDateStr) {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      return d.toISOString().split("T")[0];
    }
    const d = new Date(baseDateStr);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
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

  const inputRefs = useRef({
    exp_date: {},
    harga_beli: {},
    harga_jual: {},
    qty: {},
    diskon: {},
  });

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
    setFakturInfo((prev) => {
      const updatedInfo = { ...prev, [field]: value };
      if (field === "tanggal") {
        const newExpDate = getOneYearLater(value);
        setItems((prevItems) =>
          prevItems.map((item) => {
            const oldExpDate = getOneYearLater(prev.tanggal);
            if (!item.exp_date || item.exp_date === oldExpDate) {
              return { ...item, exp_date: newExpDate };
            }
            return item;
          })
        );
      }
      return updatedInfo;
    });
  };

  const handleBatchChange = useCallback((value) => {
    setKodeBatch(value);
    setBatchManual(true);
  }, []);

  const handleBatchModeChange = useCallback((manual) => {
    setBatchManual(manual);
    if (!manual) {
      setKodeBatch(generateBatchCode(fakturInfo.no_faktur, fakturInfo.tanggal));
    }
  }, [fakturInfo.no_faktur, fakturInfo.tanggal]);

  const recalcItem = (item) => ({
    ...item,
    total: hitungSubtotalItem(item),
  });

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

    const newId = Date.now() + Math.random();
    const newItem = recalcItem({
      id: newId,
      produk_id: foundProduct.id_produk,
      nama_produk: foundProduct.nama_produk,
      exp_date: getOneYearLater(fakturInfo.tanggal),
      qty: 1,
      satuan: foundProduct.nama_satuan || foundProduct.satuan || "Pcs",
      harga_beli: foundProduct.harga_beli || 0,
      harga_jual: foundProduct.harga_jual || 0,
      diskon: 0,
      diskon_tipe: "%",
      total: 0,
    });

    setItems((prev) => {
      const emptyIdx = prev.findIndex((it) => !it.produk_id);
      if (emptyIdx !== -1) {
        return prev.map((it, i) => (i === emptyIdx ? newItem : it));
      }
      return [...prev, newItem];
    });

    setBarcodeInput("");

    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 50);
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
        target.closest(".MuiButtonBase-root"));

    if (!isInteractive && activeTab === "barang") {
      setTimeout(() => {
        barcodeInputRef.current?.focus();
      }, 50);
    }
  };

  const handleTambahBaris = () => {
    const newId = Date.now() + Math.random();
    setItems((prev) => [
      ...prev,
      { ...emptyItem(), id: newId, exp_date: getOneYearLater(fakturInfo.tanggal) },
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

  const validItemCount = items.filter((it) => it.produk_id && it.qty > 0).length;
  const subtotalBruto = items.reduce((acc, it) => acc + (it.total || 0), 0);
  const nilaiPpn = Number(fakturInfo.nilai_ppn) || 11;
  const ppn =
    fakturInfo.jenis_ppn === "sudah_termasuk"
      ? Math.round(subtotalBruto - subtotalBruto / (1 + nilaiPpn / 100))
      : Math.round(subtotalBruto * (nilaiPpn / 100));
  const grandTotal =
    fakturInfo.jenis_ppn === "sudah_termasuk" ? subtotalBruto : subtotalBruto + ppn;
  const grandTotalSetelahCashback = Math.max(0, grandTotal - (Number(fakturInfo.cashback) || 0));
  const isKredit = fakturInfo.jenis_pembayaran === "Kredit";

  const handleSimpan = async () => {
    if (!fakturInfo.supplier_id || !fakturInfo.tanggal || !fakturInfo.no_faktur) {
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

    const finalBatch = (kodeBatch || generateBatchCode(fakturInfo.no_faktur, fakturInfo.tanggal)).trim();
    if (!finalBatch) {
      alert("Kode batch wajib diisi.");
      return;
    }

    const incompleteExp = validItems.some((it) => !it.exp_date);
    if (incompleteExp && !window.confirm("Ada item tanpa tanggal expired. Tetap simpan?")) {
      return;
    }

    const itemsWithBatch = validItems.map((it) => ({ ...it, no_batch: finalBatch }));

    try {
      await addPembelian(
        { ...fakturInfo, total: grandTotalSetelahCashback, kode_batch: finalBatch },
        itemsWithBatch
      );
      alert("Faktur berhasil disimpan! Stok dan batch otomatis terupdate.");
      navigate("/pembelian");
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat menyimpan faktur.");
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Box
        sx={{
          background: colors.bgCard,
          borderRadius: 3,
          p: 3,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <IconButton
            size="small"
            onClick={() => navigate("/pembelian")}
            sx={{
              bgcolor: colors.borderLight,
              color: colors.textSecondary,
              "&:hover": { bgcolor: colors.border },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: colors.textMuted,
              letterSpacing: 0.5,
            }}
          >
            Pembelian / Tambah Faktur
          </Typography>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: typography.title,
            color: colors.text,
          }}
        >
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
      </Box>

      <FakturStepIndicator activeStep={activeTab} onChange={setActiveTab} itemCount={validItemCount} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 280px",
          },
          gap: 2.5,
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
              handleBarcodeScan={handleBarcodeScan}
              handleBarcodeBlur={handleBarcodeBlur}
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
        />
      </Box>
    </Box>
  );
};

export default TambahFakturPage;
