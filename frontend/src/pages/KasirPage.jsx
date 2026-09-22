import React, { useState, useRef, useEffect, useMemo } from "react";
import { Box, Typography, Snackbar, Alert, Chip, Paper } from "@mui/material";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { PosProvider, usePos } from "../context/PosContext";
import usePosProducts from "../hooks/usePosProducts";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import SearchBar from "../components/kasir/SearchBar";
import KasirLoadingSkeleton from "../components/kasir/KasirLoadingSkeleton";

import KasirHeader from "../components/kasir/KasirHeader";
import KeranjangTable from "../components/kasir/KeranjangTable";
import RingkasanBelanja from "../components/kasir/RingkasanBelanja";
import DiskonModal from "../components/kasir/DiskonModal";
import LogoutConfirmModal from "../components/kasir/LogoutConfirmModal";
import HoldTransaksiModal from "../components/kasir/HoldTransaksiModal";

import PosPaymentModal from "../components/kasir/PosPaymentModal";
import PosSuccessModal from "../components/kasir/PosSuccessModal";
import BukaShiftModal from "../components/kasir/BukaShiftModal";
import TutupShiftModal from "../components/kasir/TutupShiftModal";
import KasKecilModal from "../components/kasir/KasKecilModal";
import ShiftTerkunciModal from "../components/kasir/ShiftTerkunciModal";
import VarianPickerModal from "../components/kasir/VarianPickerModal";

import {
  isBarcodeLike,
  safeString,
  getNamaProduk,
  getSatuanLabel,
  formatRupiah,
} from "../utils/barcodeHelpers";

import { createKasKecil, getShiftAktifApi } from "@/api/transaksiApi";

/* ══════════════════════════════════════════════════════════════════
 * MAIN CONTENT
 * ══════════════════════════════════════════════════════════════════ */
const KasirContent = () => {
  const {
    cart,
    search,
    setSearch,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    shift,
    setShift,
    shiftLoading,
    diskonNominal = 0,
    setDiskonNominal,
    pajakNominal = 0,
    holdList = [],
    holdCurrentCart,
    recallCart,
    removeHoldCart,
    subtotal,
    totalBayar,
    currentUser,
    applyItemDiscount,
    removeItemDiscount,
  } = usePos();

  const { produk, loading } = usePosProducts();

  const namaKasirAktif =
    shift?.nama_kasir ||
    shift?.kasir ||
    currentUser?.nama ||
    currentUser?.name ||
    currentUser?.username ||
    "Kasir Utama";

  const hasActiveShift = shift?.status === "OPEN";
  const needsBukaShift = !shiftLoading && !hasActiveShift;

  const [isPrinterReady, setIsPrinterReady] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const [bukaShiftOpen, setBukaShiftOpen] = useState(false);
  const [tutupShiftOpen, setTutupShiftOpen] = useState(false);
  const [kasKecilOpen, setKasKecilOpen] = useState(false);
  const [shiftTerkunciOpen, setShiftTerkunciOpen] = useState(false);

  const [pendingLogout, setPendingLogout] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [diskonModalOpen, setDiskonModalOpen] = useState(false);
  const [tipeDiskon, setTipeDiskon] = useState("Rp");
  const [inputDiskon, setInputDiskon] = useState("");
  const [kategoriDiskon, setKategoriDiskon] = useState("nota");

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantProducts, setVariantProducts] = useState([]);
  const [variantProductName, setVariantProductName] = useState("");

  const scanRef = useRef(null);
  const searchContainerRef = useRef(null);

  const anyModalOpen =
    paymentModalOpen ||
    successModalOpen ||
    tutupShiftOpen ||
    kasKecilOpen ||
    bukaShiftOpen ||
    shiftTerkunciOpen ||
    logoutConfirmOpen ||
    holdModalOpen ||
    diskonModalOpen ||
    variantModalOpen;

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.print) setIsPrinterReady(true);
    else setIsPrinterReady(false);
  }, []);

  /* AUTO BUKA MODAL BUKA SHIFT */
  useEffect(() => {
    if (!needsBukaShift || shiftTerkunciOpen) {
      setBukaShiftOpen(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await getShiftAktifApi();
        if (cancelled) return;

        if (res?.active && res?.data) {
          setShift({
            ...res.data,
            kasir: res.data.nama_kasir || namaKasirAktif,
            status: "OPEN",
          });
          setBukaShiftOpen(false);
        } else {
          setBukaShiftOpen(true);
        }
      } catch (err) {
        if (!cancelled) setBukaShiftOpen(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [needsBukaShift, shiftTerkunciOpen, namaKasirAktif, setShift]);

  const focusBarcode = () => {
    if (!hasActiveShift) return;
    setTimeout(() => {
      if (scanRef.current) {
        scanRef.current.focus();
        if (typeof scanRef.current.select === "function") {
          try {
            scanRef.current.select();
          } catch (err) {}
        }
      }
    }, 50);
  };

  useEffect(() => {
    if (!loading && hasActiveShift && !anyModalOpen) {
      focusBarcode();
    }
  }, [loading, hasActiveShift, anyModalOpen]);

  /* SEARCH SUGGESTION */
  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    if (isBarcodeLike(q)) return [];

    return produk
      .filter((p) => {
        const nama = getNamaProduk(p).toLowerCase();
        const barcode = safeString(p.barcode).toLowerCase();
        const kode = safeString(p.kode).toLowerCase();
        return nama.includes(q) || barcode.includes(q) || kode.includes(q);
      })
      .slice(0, 8);
  }, [search, produk]);

  useEffect(() => {
    if (search.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
      setHighlightedIndex(0);
    } else {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  }, [search, suggestions]);

  const isBarcodeInput = isBarcodeLike(search);

  const handleSelectProduct = (product) => {
    const nama = getNamaProduk(product);
    const sameName = produk.filter((p) => getNamaProduk(p) === nama);

    if (sameName.length > 1) {
      setVariantProducts(sameName);
      setVariantProductName(nama);
      setVariantModalOpen(true);
      setShowSuggestions(false);
      return;
    }

    addToCart(product, 1);
    setSearch("");
    setShowSuggestions(false);
    showSnackbar(`"${nama}" ditambahkan`, "success");
    focusBarcode();
  };

  const handleSelectVariant = (product) => {
    addToCart(product, 1);
    setVariantModalOpen(false);
    setVariantProducts([]);
    setVariantProductName("");
    setSearch("");
    showSnackbar(`"${getNamaProduk(product)}" ditambahkan`, "success");
    focusBarcode();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const q = search.trim();
      if (!q) {
        focusBarcode();
        return;
      }

      if (isBarcodeLike(q)) {
        const byBarcode = produk.find(
          (p) => safeString(p.barcode) === q || safeString(p.kode) === q,
        );
        if (byBarcode) {
          handleSelectProduct(byBarcode);
        } else {
          showSnackbar(
            `Produk tidak ditemukan untuk barcode "${q}"`,
            "warning",
          );
          setSearch("");
          focusBarcode();
        }
        return;
      }

      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelectProduct(suggestions[highlightedIndex]);
        return;
      }

      const byBarcode = produk.find(
        (p) => safeString(p.barcode) === q || safeString(p.kode) === q,
      );
      if (byBarcode) {
        handleSelectProduct(byBarcode);
        return;
      }

      if (suggestions.length === 1) {
        handleSelectProduct(suggestions[0]);
        return;
      }

      if (suggestions.length > 1) {
        setShowSuggestions(true);
        return;
      }

      showSnackbar("Produk tidak ditemukan!", "error");
      focusBarcode();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* SHORTCUTS */
  useKeyboardShortcuts(
    {
      F2: () => focusBarcode(),
      F4: () => {
        if (cart.length > 0) setDiskonModalOpen(true);
        else showSnackbar("Keranjang kosong!", "warning");
      },
      F6: (e) => {
        if (e.shiftKey) setHoldModalOpen(true);
        else {
          if (cart.length > 0) {
            if (holdCurrentCart) {
              holdCurrentCart();
              showSnackbar("Transaksi ditahan (Hold)", "success");
            }
          } else {
            showSnackbar("Keranjang kosong!", "warning");
          }
        }
      },
      F8: () => {
        if (cart.length > 0) setPaymentModalOpen(true);
        else showSnackbar("Keranjang belanja kosong!", "warning");
      },
      Escape: () => {
        setPaymentModalOpen(false);
        setKasKecilOpen(false);
        setTutupShiftOpen(false);
        setLogoutConfirmOpen(false);
        setHoldModalOpen(false);
        setDiskonModalOpen(false);
      },
    },
    {
      disabled: !hasActiveShift || anyModalOpen,
    },
  );

  /* DISKON */
  const handleApplyDiskon = () => {
    let val = Number(inputDiskon) || 0;
    if (tipeDiskon === "%") val = (subtotal * val) / 100;
    if (val > subtotal) {
      showSnackbar("Diskon tidak boleh melebihi subtotal!", "error");
      return;
    }
    setDiskonNominal(val);
    setDiskonModalOpen(false);
    setInputDiskon("");
    showSnackbar("Diskon berhasil diterapkan", "success");
  };

  /* KAS KECIL */
  const handleSaveKasKecil = async (payload) => {
    const idShift = shift?.id_shift || shift?.id || null;
    if (!idShift) {
      showSnackbar(
        "Shift belum aktif — tidak bisa mencatat kas kecil.",
        "error",
      );
      return false;
    }
    try {
      const body = {
        ...payload,
        id_shift: idShift,
        nama_kasir: namaKasirAktif,
      };
      const res = await createKasKecil(body);
      showSnackbar("Kas Kecil berhasil dicatat", "success");
      return true;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Gagal mencatat kas kecil";
      showSnackbar(`Gagal: ${msg}`, "error");
      return false;
    }
  };

  /* TUTUP SHIFT */
  const handleConfirmTutupShift = (closedShiftData) => {
    setTutupShiftOpen(false);
    setBukaShiftOpen(false);
    setShift({
      ...shift,
      status: "CLOSED",
      modal_akhir: closedShiftData?.modal_akhir,
      waktu_tutup: closedShiftData?.waktu_tutup,
    });

    if (pendingLogout) {
      setPendingLogout(false);
      setTimeout(() => setLogoutConfirmOpen(true), 200);
      showSnackbar(
        "Shift berhasil ditutup. Silakan konfirmasi logout.",
        "success",
      );
    } else {
      setShiftTerkunciOpen(true);
      showSnackbar("Shift berhasil ditutup", "success");
    }
  };

  /* LOGOUT */
  const handleOpenLogout = () => {
    if (hasActiveShift) {
      setPendingLogout(true);
      showSnackbar(
        "Tutup shift terlebih dahulu (dengan pengecekan kas) sebelum logout.",
        "warning",
      );
      setTutupShiftOpen(true);
      return;
    }
    setLogoutConfirmOpen(true);
  };

  const handleExecLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <KasirLoadingSkeleton />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 3,
        pt: 2,
        pb: 4,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        sx={{
          filter: hasActiveShift ? "none" : "blur(8px)",
          pointerEvents: hasActiveShift ? "auto" : "none",
          transition: "filter 0.3s ease",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <KasirHeader
          isPrinterReady={isPrinterReady}
          namaKasirAktif={namaKasirAktif}
          holdListLength={holdList.length}
          onOpenHold={() => setHoldModalOpen(true)}
          onOpenKasKecil={() => setKasKecilOpen(true)}
          onOpenTutupShift={() => setTutupShiftOpen(true)}
          onOpenLogout={handleOpenLogout}
        />

        {/* SEARCH BAR */}
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: "10px",
            p: 2,
            mb: 2.5,
            border: "1px solid #E2E8F0",
          }}
        >
          <Box ref={searchContainerRef} sx={{ position: "relative", mb: 1.5 }}>
            <SearchBar
              placeholder="Ketik nama obat / scan barcode di sini..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onClear={() => {
                setSearch("");
                setShowSuggestions(false);
                focusBarcode();
              }}
              ref={scanRef}
              autoFocus={hasActiveShift}
            />

            {showSuggestions && suggestions.length > 0 && !isBarcodeInput && (
              <Paper
                elevation={8}
                onMouseDown={(e) => e.preventDefault()}
                sx={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  zIndex: 1300,
                  maxHeight: 360,
                  overflowY: "auto",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  bgcolor: "#FFFFFF",
                }}
              >
                {suggestions.map((p, idx) => {
                  const stok = Number(p.stok) || 0;
                  const hargaJual = Number(p.harga_jual || p.harga || 0);
                  const nama = getNamaProduk(p);
                  const barcodeStr = safeString(p.barcode);
                  const kodeStr = safeString(p.kode);
                  const satuanStr = getSatuanLabel(p);
                  const isHighlighted = highlightedIndex === idx;
                  const isOutOfStock = stok <= 0;

                  const variantCount = produk.filter(
                    (x) => getNamaProduk(x) === nama,
                  ).length;

                  return (
                    <Box
                      key={p.id_produk || p.id || idx}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      onClick={() => !isOutOfStock && handleSelectProduct(p)}
                      sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        cursor: isOutOfStock ? "not-allowed" : "pointer",
                        bgcolor: isHighlighted ? "#FFF0F5" : "transparent",
                        borderBottom:
                          idx < suggestions.length - 1
                            ? "1px solid #F1F5F9"
                            : "none",
                        transition: "background 0.1s",
                        opacity: isOutOfStock ? 0.6 : 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "6px",
                            bgcolor: "#FCE4EC",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <LocalPharmacyIcon
                            sx={{ fontSize: 18, color: "#D81B60" }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 13,
                                color: "#1E293B",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 300,
                              }}
                            >
                              {nama}
                            </Typography>
                            {variantCount > 1 && (
                              <Chip
                                icon={<Inventory2Icon sx={{ fontSize: 12 }} />}
                                label={`${variantCount} varian`}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  bgcolor: "#FEF3C7",
                                  color: "#92400E",
                                  "& .MuiChip-icon": { color: "#92400E" },
                                }}
                              />
                            )}
                          </Box>
                          <Typography
                            sx={{ fontSize: 11, color: "#64748B", mt: 0.3 }}
                          >
                            {barcodeStr
                              ? `Barcode: ${barcodeStr}`
                              : kodeStr
                                ? `Kode: ${kodeStr}`
                                : "—"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: 13,
                            color: "#D81B60",
                          }}
                        >
                          Rp {formatRupiah(hargaJual)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: isOutOfStock ? "#EF4444" : "#10B981",
                            mt: 0.2,
                          }}
                        >
                          Stok: {stok}
                          {satuanStr ? ` ${satuanStr}` : ""}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}

                <Box
                  sx={{
                    p: 1,
                    bgcolor: "#F8FAFC",
                    borderTop: "1px solid #E2E8F0",
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#94A3B8",
                    fontWeight: 600,
                  }}
                >
                  <span>↑↓ Navigasi</span>
                  <span>•</span>
                  <span>Enter Pilih</span>
                  <span>•</span>
                  <span>Esc Tutup</span>
                </Box>
              </Paper>
            )}
          </Box>

          {/* SHORTCUTS */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", mr: 0.5 }}
            >
              SHORTCUTS:
            </Typography>
            {[
              { key: "[F2] Cari", bg: "#FCE4EC", color: "#D81B60" },
              { key: "[F4] Diskon", bg: "#FCE4EC", color: "#D81B60" },
              { key: "[F6] Hold", bg: "#FCE4EC", color: "#D81B60" },
              { key: "[Shift+F6] Recall", bg: "#E8F5E9", color: "#2E7D32" },
              { key: "[F8] Bayar", bg: "#E8F5E9", color: "#2E7D32" },
              { key: "[Esc] Batal", bg: "#FCE4EC", color: "#D81B60" },
            ].map((sc, i) => (
              <Chip
                key={i}
                label={sc.key}
                size="small"
                sx={{
                  bgcolor: sc.bg,
                  color: sc.color,
                  fontWeight: 700,
                  fontSize: 11,
                  height: 22,
                  borderRadius: "4px",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* TABLE & SUMMARY */}
        <Box
          sx={{ display: "flex", gap: 2.5, flexGrow: 1, alignItems: "stretch" }}
        >
          <KeranjangTable
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            onExceedStock={(maxStok) =>
              showSnackbar(
                `Stok hanya tersedia ${maxStok}. QTY dibatasi ke ${maxStok}.`,
                "warning",
              )
            }
          />
          <RingkasanBelanja
            subtotal={subtotal}
            diskonNominal={diskonNominal}
            pajakNominal={pajakNominal}
            totalBayar={totalBayar}
            cartLength={cart.length}
            onOpenDiskon={() => setDiskonModalOpen(true)}
            onProsesTransaksi={() => setPaymentModalOpen(true)}
          />
        </Box>
      </Box>

      <DiskonModal
        open={diskonModalOpen}
        onClose={() => setDiskonModalOpen(false)}
        kategoriDiskon={kategoriDiskon}
        setKategoriDiskon={setKategoriDiskon}
        tipeDiskon={tipeDiskon}
        setTipeDiskon={setTipeDiskon}
        inputDiskon={inputDiskon}
        setInputDiskon={setInputDiskon}
        subtotal={subtotal}
        setDiskonNominal={setDiskonNominal}
        handleApplyDiskon={handleApplyDiskon}
        cart={cart}
        onApplyItemDiscount={applyItemDiscount}
        onRemoveItemDiscount={removeItemDiscount}
      />

      <HoldTransaksiModal
        open={holdModalOpen}
        onClose={() => setHoldModalOpen(false)}
        holdList={holdList}
        onRecall={(index) => {
          recallCart(index);
          setHoldModalOpen(false);
        }}
        onDelete={(index) => removeHoldCart(index)}
      />

      <LogoutConfirmModal
        open={logoutConfirmOpen}
        onClose={() => {
          setLogoutConfirmOpen(false);
          setPendingLogout(false);
        }}
        onConfirm={() => {
          if (hasActiveShift) {
            setLogoutConfirmOpen(false);
            setPendingLogout(true);
            showSnackbar(
              "Shift masih aktif. Tutup shift terlebih dahulu.",
              "error",
            );
            setTutupShiftOpen(true);
            return;
          }
          handleExecLogout();
        }}
      />

      {/* SNACKBAR — warna warning KUNING */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={snackbarSeverity === "success" ? 1800 : 3500}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            bgcolor:
              snackbarSeverity === "error"
                ? "#D32F2F"
                : snackbarSeverity === "warning"
                  ? "#ED6C02"
                  : "#D81B60",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <PosPaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={(data) => {
          setPaymentModalOpen(false);
          setSuccessData(data);
          setSuccessModalOpen(true);
        }}
      />

      <PosSuccessModal
        open={successModalOpen}
        data={successData}
        onClose={() => {
          setSuccessModalOpen(false);
          focusBarcode();
        }}
        onNewTransaction={() => {
          setSuccessModalOpen(false);
          clearCart();
          focusBarcode();
        }}
      />

      <KasKecilModal
        open={kasKecilOpen}
        onClose={() => setKasKecilOpen(false)}
        onSave={handleSaveKasKecil}
      />

      <TutupShiftModal
        open={tutupShiftOpen}
        onClose={() => {
          setTutupShiftOpen(false);
          setPendingLogout(false);
        }}
        onConfirm={handleConfirmTutupShift}
        shiftData={{
          id_shift: shift?.id_shift ?? null,
          modalAwal: shift?.modal_awal ?? 0,
          totalPenjualanTunai: shift?.total_tunai ?? 0,
          totalKasKecil: shift?.total_kas_kecil ?? 0,
          namaKasir: namaKasirAktif,
        }}
      />

      <BukaShiftModal
        open={bukaShiftOpen}
        onClose={() => {}}
        onSuccess={(shiftData) => {
          setBukaShiftOpen(false);
          setShiftTerkunciOpen(false);
          setShift({ ...shiftData, kasir: namaKasirAktif, status: "OPEN" });
          showSnackbar("Shift berhasil dibuka", "success");
        }}
        onShiftExists={async (msg) => {
          showSnackbar(msg || "Masih ada shift yang berjalan.", "warning");
          setBukaShiftOpen(false);
          try {
            const res = await getShiftAktifApi();
            if (res?.active && res?.data) {
              setShift({
                ...res.data,
                kasir: res.data.nama_kasir || namaKasirAktif,
                status: "OPEN",
              });
            }
          } catch (err) {}
        }}
      />

      <ShiftTerkunciModal
        open={shiftTerkunciOpen}
        onClose={() => setShiftTerkunciOpen(false)}
        onBukaShiftBaru={() => {
          setShiftTerkunciOpen(false);
          setTimeout(() => setBukaShiftOpen(true), 100);
        }}
      />

      <VarianPickerModal
        open={variantModalOpen}
        onClose={() => {
          setVariantModalOpen(false);
          setVariantProducts([]);
          setVariantProductName("");
          focusBarcode();
        }}
        produkList={variantProducts}
        produkName={variantProductName}
        onSelect={handleSelectVariant}
      />
    </Box>
  );
};

const KasirPage = () => (
  <PosProvider>
    <KasirContent />
  </PosProvider>
);

export default KasirPage;
