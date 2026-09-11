import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Snackbar, Alert, Chip } from "@mui/material";

import { PosProvider, usePos } from "../context/PosContext";
import usePosProducts from "../hooks/usePosProducts";
import SearchBar from "../components/kasir/SearchBar";
import KasirLoadingSkeleton from "../components/kasir/KasirLoadingSkeleton";

// Modular Components
import KasirHeader from "../components/kasir/KasirHeader";
import KeranjangTable from "../components/kasir/KeranjangTable";
import RingkasanBelanja from "../components/kasir/RingkasanBelanja";
import DiskonModal from "../components/kasir/DiskonModal";
import LogoutConfirmModal from "../components/kasir/LogoutConfirmModal";
import HoldTransaksiModal from "../components/kasir/HoldTransaksiModal";

// Modals
import PosPaymentModal from "../components/kasir/PosPaymentModal";
import PosSuccessModal from "../components/kasir/PosSuccessModal";
import BukaShiftModal from "../components/kasir/BukaShiftModal";
import TutupShiftModal from "../components/kasir/TutupShiftModal";
import KasKecilModal from "../components/kasir/KasKecilModal";
import ShiftTerkunciModal from "../components/kasir/ShiftTerkunciModal";

import { createKasKecil, tutupShiftApi } from "@/api/transaksiApi";

const KasirContent = () => {
  const {
    cart, search, setSearch, addToCart, updateQuantity, removeFromCart, clearCart,
    shift, setShift, diskonNominal = 0, setDiskonNominal, pajakNominal = 0,
    holdList = [], holdCurrentCart, recallCart, removeHoldCart, subtotal, totalBayar,
    currentUser
  } = usePos();

  const { produk, loading } = usePosProducts();

  const namaKasirAktif = shift?.nama_kasir || shift?.kasir || currentUser?.nama || currentUser?.name || currentUser?.username || "Kasir Utama";
  const isShiftClosed = shift?.status === "CLOSED";

  const [isPrinterReady, setIsPrinterReady] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  
  const [bukaShiftOpen, setBukaShiftOpen] = useState(isShiftClosed);
  const [tutupShiftOpen, setTutupShiftOpen] = useState(false);
  const [kasKecilOpen, setKasKecilOpen] = useState(false);
  const [shiftTerkunciOpen, setShiftTerkunciOpen] = useState(false);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [diskonModalOpen, setDiskonModalOpen] = useState(false);
  const [tipeDiskon, setTipeDiskon] = useState("Rp");
  const [inputDiskon, setInputDiskon] = useState("");
  const [kategoriDiskon, setKategoriDiskon] = useState("nota");

  const scanRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.print) setIsPrinterReady(true);
    else setIsPrinterReady(false);
  }, []);

  useEffect(() => {
    if (isShiftClosed) setBukaShiftOpen(true);
    else setBukaShiftOpen(false);
  }, [isShiftClosed]);

  const focusBarcode = () => {
    if (isShiftClosed) return;
    setTimeout(() => {
      if (scanRef.current) {
        scanRef.current.focus();
        if (typeof scanRef.current.select === "function") {
          try { scanRef.current.select(); } catch (err) {}
        }
      }
    }, 50);
  };

  useEffect(() => {
    if (!loading && !paymentModalOpen && !successModalOpen && !tutupShiftOpen && !kasKecilOpen && !bukaShiftOpen && !shiftTerkunciOpen && !logoutConfirmOpen && !holdModalOpen && !diskonModalOpen) {
      focusBarcode();
    }
  }, [loading, paymentModalOpen, successModalOpen, tutupShiftOpen, kasKecilOpen, bukaShiftOpen, shiftTerkunciOpen, logoutConfirmOpen, holdModalOpen, diskonModalOpen]);

  // Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isShiftClosed) return;
      if (e.key === "F2") { e.preventDefault(); focusBarcode(); }
      if (e.key === "F4") { 
        e.preventDefault(); 
        if(cart.length > 0) setDiskonModalOpen(true);
        else { setSnackbarMessage("Keranjang kosong!"); setSnackbarOpen(true); }
      }
      if (e.key === "F6") {
        e.preventDefault();
        if (e.shiftKey) setHoldModalOpen(true);
        else {
          if (cart.length > 0) { if (holdCurrentCart) { holdCurrentCart(); setSnackbarMessage("Transaksi ditahan (Hold)"); } setSnackbarOpen(true); } 
          else { setSnackbarMessage("Keranjang kosong!"); setSnackbarOpen(true); }
        }
      }
      if (e.key === "F8") {
        e.preventDefault();
        if (cart.length > 0) setPaymentModalOpen(true);
        else { setSnackbarMessage("Keranjang belanja kosong!"); setSnackbarOpen(true); }
      }
      if (e.key === "Escape") {
        setPaymentModalOpen(false); setKasKecilOpen(false); setTutupShiftOpen(false); setLogoutConfirmOpen(false); setHoldModalOpen(false); setDiskonModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, holdCurrentCart, isShiftClosed]);

  const handleBarcodeEnter = (e) => {
    if (e.key !== "Enter") return;
    const inputQuery = search.trim();
    if (!inputQuery) { focusBarcode(); return; }

    const foundProduct = produk.find(p => p.barcode === inputQuery || p.kode === inputQuery || p.nama_produk?.toLowerCase().includes(inputQuery.toLowerCase()) || p.nama?.toLowerCase().includes(inputQuery.toLowerCase()));

    if (foundProduct) {
      addToCart(foundProduct, 1);
      setSearch("");
      setSnackbarMessage(`"${foundProduct.nama_produk || foundProduct.nama}" ditambahkan`);
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Produk tidak ditemukan!"); setSnackbarOpen(true);
    }
    focusBarcode();
  };

  const handleApplyDiskon = () => {
    let val = Number(inputDiskon) || 0;
    if (tipeDiskon === "%") val = (subtotal * val) / 100;
    if (val > subtotal) {
      setSnackbarMessage("Diskon tidak boleh melebihi subtotal!");
      setSnackbarOpen(true);
      return;
    }
    setDiskonNominal(val);
    setDiskonModalOpen(false);
    setInputDiskon("");
    setSnackbarMessage("Diskon berhasil diterapkan");
    setSnackbarOpen(true);
  };

  const handleSaveKasKecil = async (payload) => {
    try { 
      await createKasKecil({ ...payload, id_shift: shift?.id_shift || shift?.id, nama_kasir: namaKasirAktif }); 
      setSnackbarMessage("Kas Kecil Berhasil Dicatat"); 
      setSnackbarOpen(true); 
    } catch (err) {
      setSnackbarMessage("Gagal mencatat kas kecil");
      setSnackbarOpen(true);
    }
  };

  const handleConfirmTutupShift = async (payload) => {
    try { 
      await tutupShiftApi({ ...payload, id_shift: shift?.id_shift || shift?.id, nama_kasir: namaKasirAktif }); 
      setTutupShiftOpen(false); 
      setShift({ ...shift, status: "CLOSED" }); 
      setShiftTerkunciOpen(true); 
    } catch (err) { 
      setTutupShiftOpen(false); 
      setShiftTerkunciOpen(true); 
    }
  };

  const handleExecLogout = () => { 
    localStorage.removeItem("user"); 
    localStorage.removeItem("token"); 
    window.location.href = "/login"; 
  };

  if (loading) return <KasirLoadingSkeleton />;

  return (
    <Box sx={{ minHeight: "100vh", px: 3, pt: 2, pb: 4, display: "flex", flexDirection: "column", position: "relative" }}>
      
      <Box sx={{ 
          filter: isShiftClosed ? "blur(8px)" : "none", 
          pointerEvents: isShiftClosed ? "none" : "auto", 
          transition: "filter 0.3s ease",
          display: "flex", 
          flexDirection: "column", 
          flexGrow: 1 
      }}>
        
        {/* HEADER MODULAR */}
        <KasirHeader 
          isPrinterReady={isPrinterReady}
          namaKasirAktif={namaKasirAktif}
          holdListLength={holdList.length}
          onOpenHold={() => setHoldModalOpen(true)}
          onOpenKasKecil={() => setKasKecilOpen(true)}
          onOpenTutupShift={() => setTutupShiftOpen(true)}
          onOpenLogout={() => setLogoutConfirmOpen(true)}
        />

        {/* SEARCH BAR */}
        <Box sx={{ bgcolor: "#FFFFFF", borderRadius: "10px", p: 2, mb: 2.5, border: "1px solid #E2E8F0" }}>
          <Box sx={{ mb: 1.5 }}>
            <SearchBar placeholder="Ketik nama obat / scan barcode di sini..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleBarcodeEnter} onClear={() => setSearch("")} ref={scanRef} autoFocus={!isShiftClosed} />
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", mr: 0.5 }}>SHORTCUTS:</Typography>
            {[
              { key: "[F2] Cari", bg: "#FCE4EC", color: "#D81B60" }, { key: "[F4] Diskon", bg: "#FCE4EC", color: "#D81B60" }, { key: "[F6] Hold", bg: "#FCE4EC", color: "#D81B60" },
              { key: "[Shift+F6] Recall", bg: "#E8F5E9", color: "#2E7D32" }, { key: "[F8] Bayar", bg: "#E8F5E9", color: "#2E7D32" }, { key: "[Esc] Batal", bg: "#FCE4EC", color: "#D81B60" },
            ].map((sc, i) => (<Chip key={i} label={sc.key} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: 11, height: 22, borderRadius: "4px" }} />))}
          </Box>
        </Box>

        {/* TABLE & SUMMARY CONTAINER */}
        <Box sx={{ display: "flex", gap: 2.5, flexGrow: 1, alignItems: "stretch" }}>
          <KeranjangTable cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
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

      {/* MODAL DISKON */}
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
      />

      {/* MODAL HOLD TRANSAKSI */}
      <HoldTransaksiModal 
        open={holdModalOpen} 
        onClose={() => setHoldModalOpen(false)} 
        holdList={holdList} 
        onRecall={(index) => { recallCart(index); setHoldModalOpen(false); }} 
        onDelete={(index) => removeHoldCart(index)} 
      />

      {/* MODAL LOGOUT */}
      <LogoutConfirmModal 
        open={logoutConfirmOpen} 
        onClose={() => setLogoutConfirmOpen(false)} 
        onConfirm={handleExecLogout} 
      />

      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={1800} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" variant="filled" sx={{ bgcolor: "#D81B60" }}>{snackbarMessage}</Alert>
      </Snackbar>

      <PosPaymentModal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSuccess={(data) => { setPaymentModalOpen(false); setSuccessData(data); setSuccessModalOpen(true); }} />
      <PosSuccessModal open={successModalOpen} data={successData} onClose={() => { setSuccessModalOpen(false); focusBarcode(); }} onNewTransaction={() => { setSuccessModalOpen(false); clearCart(); focusBarcode(); }} />
      <KasKecilModal open={kasKecilOpen} onClose={() => setKasKecilOpen(false)} onSave={handleSaveKasKecil} />
      <TutupShiftModal open={tutupShiftOpen} onClose={() => setTutupShiftOpen(false)} onConfirm={handleConfirmTutupShift} shiftData={{ id_shift: shift?.id_shift || shift?.id || null, modalAwal: shift?.modal_awal || shift?.modalAwal || 0, totalPenjualanTunai: shift?.total_tunai || subtotal, totalKasKecil: shift?.total_kas_kecil || 0, namaKasir: namaKasirAktif }} />
      
      <BukaShiftModal 
        open={bukaShiftOpen} 
        onClose={() => {}} 
        onSuccess={(data) => { 
          setBukaShiftOpen(false); 
          setShift({ ...shift, ...data, status: "OPEN" }); 
        }} 
      />
      <ShiftTerkunciModal open={shiftTerkunciOpen} onBukaShiftBaru={() => { setShiftTerkunciOpen(false); setBukaShiftOpen(true); }} />
    </Box>
  );
};

const KasirPage = () => ( <PosProvider><KasirContent /></PosProvider> );
export default KasirPage;