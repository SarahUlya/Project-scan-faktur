import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CloseIcon from "@mui/icons-material/Close";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { usePos } from "../../context/PosContext";
import useTransaksiDb from "../../hooks/useTransaksiDb";
import { getUser } from "../../auth/auth";
import { formatRupiahPos } from "../../utils/posCalculations";
import { printReceipt } from "@/utils/print/receiptPrinter";
import useSetting from "../../hooks/useSetting";

const METODE_LIST = [
  {
    id: "TUNAI",
    label: "Tunai",
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />,
  },
  { id: "QRIS", label: "QRIS", icon: <QrCode2Icon sx={{ fontSize: 24 }} /> },
  {
    id: "TRANSFER",
    label: "Transfer",
    icon: <AccountBalanceIcon sx={{ fontSize: 24 }} />,
  },
];

const PosPaymentModal = ({ open, onClose, onSuccess }) => {
  const {
    cart,
    subtotal,
    totalBayar,
    diskonNominal = 0,
    pajakNominal = 0,
    clearCart,
    shift,
  } = usePos();
  const { processTransaksi } = useTransaksiDb();
  const setting = useSetting();
  const currentUser = getUser();

  const namaKasirAktif =
    shift?.nama_kasir ||
    shift?.kasir ||
    currentUser?.nama ||
    currentUser?.name ||
    currentUser?.username ||
    "Kasir Utama";

  const [metode, setMetode] = useState("TUNAI");
  const [uangDiterimaStr, setUangDiterimaStr] = useState("0");
  const [cetakStruk, setCetakStruk] = useState(true);
  const [loading, setLoading] = useState(false);

  // Status khusus penanganan UX Numpad (Replace vs Append)
  const [isNewInput, setIsNewInput] = useState(true);

  // State Split Payment
  const [isSplit, setIsSplit] = useState(false);
  const [metode2, setMetode2] = useState("QRIS");
  const [qrisTimer, setQrisTimer] = useState(300);

  // Reset & Inisialisasi ulang ketika Modal dibuka
  useEffect(() => {
    if (open) {
      setMetode("TUNAI");
      setMetode2("QRIS");
      setIsSplit(false);
      setUangDiterimaStr(String(totalBayar));
      setIsNewInput(true);
      setCetakStruk(true);
      setQrisTimer(300);
    }
  }, [open, totalBayar]);

  // Timer Simulasi QRIS
  useEffect(() => {
    let interval;
    if (open && (!isSplit && metode === "QRIS") && qrisTimer > 0) {
      interval = setInterval(() => setQrisTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [open, isSplit, metode, qrisTimer]);

  const uangDiterimaNum = useMemo(
    () => Number(uangDiterimaStr) || 0,
    [uangDiterimaStr],
  );

  // Kalkulasi Split & Kembalian
  const nominalSplit1 = isSplit
    ? Math.min(uangDiterimaNum, totalBayar)
    : uangDiterimaNum;
  const nominalSplit2 = isSplit ? Math.max(0, totalBayar - nominalSplit1) : 0;

  const kembalian = useMemo(() => {
    if (isSplit) return 0;
    return metode === "TUNAI" ? Math.max(0, uangDiterimaNum - totalBayar) : 0;
  }, [isSplit, metode, uangDiterimaNum, totalBayar]);

  const canPay = isSplit
    ? nominalSplit1 + nominalSplit2 === totalBayar
    : metode === "TUNAI"
      ? uangDiterimaNum >= totalBayar
      : true;

  // Algoritma Uang Cepat (Quick Cash)
  const quickCashOptions = useMemo(() => {
    if (!totalBayar || totalBayar <= 0) return [20000, 50000, 100000];
    const options = new Set();
    const round10k = Math.ceil(totalBayar / 10000) * 10000;
    if (round10k > totalBayar) options.add(round10k);
    const round50k = Math.ceil(totalBayar / 50000) * 50000;
    if (round50k > totalBayar) options.add(round50k);
    const round100k = Math.ceil(totalBayar / 100000) * 100000;
    if (round100k > totalBayar) options.add(round100k);
    [50000, 100000, 200000, 500000].forEach((amt) => {
      if (amt > totalBayar) options.add(amt);
    });
    return Array.from(options)
      .sort((a, b) => a - b)
      .slice(0, 3);
  }, [totalBayar]);

  // Handler Numpad - Smart Replace/Append Logic
  const handleNumpadClick = (val) => {
    if (isNewInput) {
      setUangDiterimaStr(String(val));
      setIsNewInput(false);
    } else {
      setUangDiterimaStr((prev) =>
        prev === "0" ? String(val) : prev + String(val),
      );
    }
  };

  const handleBackspace = () => {
    setIsNewInput(false);
    setUangDiterimaStr((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

  const handleQuickCash = (amt) => {
    setUangDiterimaStr(String(amt));
    setIsNewInput(true); // Jika pencet numpad lagi, angka terganti baru
  };

  // Eksekusi API & Validasi
  const handleConfirm = async () => {
    if (!canPay || cart.length === 0) return;
    setLoading(true);
    const cartSnapshot = [...cart];
    const finalMetode = isSplit ? `SPLIT_${metode}_${metode2}` : metode;

    try {
      const transactionPayload = {
        metode_bayar: finalMetode,
        subtotal: subtotal,
        total_bayar: totalBayar,
        diskon_nota_nominal: diskonNominal,
        diskon_item_nominal: 0,
        ppn_persen: pajakNominal,
        shift_id: shift?.id_shift || shift?.id || null,

        items: cartSnapshot.map((item) => ({
          barcode: item.barcode || item.kode_produk || item.kode || "",
          id_produk: item.id_produk || item.id,
          qty: item.qty,
          harga: item.harga || item.harga_jual,
          subtotal: item.qty * (item.harga || item.harga_jual),
          id_batch:
            item.id_batch ||
            (typeof item.batch === "object" ? item.batch?.id_batch : null),
        })),

        uang_diterima: isSplit
          ? totalBayar
          : metode === "TUNAI"
            ? uangDiterimaNum
            : totalBayar,
        kembalian: kembalian,
        kasir: namaKasirAktif,
        detail_split: isSplit
          ? {
              metode1: metode,
              nominal1: nominalSplit1,
              metode2: metode2,
              nominal2: nominalSplit2,
            }
          : null,
      };

      const result = await processTransaksi(transactionPayload);

      if (cetakStruk) {
        try {
          printReceipt({
            apotek: setting,
            kode: result?.kode_transaksi || `TRX-${Date.now()}`,
            tanggal: new Date().toISOString(),
            kasir: namaKasirAktif,
            metode: finalMetode,
            subtotal,
            diskon: diskonNominal,
            ppn: pajakNominal,
            total: totalBayar,
            bayar: isSplit
              ? totalBayar
              : metode === "TUNAI"
                ? uangDiterimaNum
                : totalBayar,
            kembalian,
            items: cartSnapshot,
          });
        } catch (printErr) {}
      }

      clearCart();
      onSuccess?.({
        ...result,
        cetakStruk,
        metode: finalMetode,
        kembalian,
        subtotal,
        total: totalBayar,
        uangDiterima: isSplit
          ? totalBayar
          : metode === "TUNAI"
            ? uangDiterimaNum
            : totalBayar,
        cart: cartSnapshot,
        kasir: namaKasirAktif,
      });
    } catch (e) {
      const errMsg =
        e.response?.data?.message || e.message || "Gagal memproses transaksi.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderNumpadAndCash = () => {
    const isUangPas = uangDiterimaNum === totalBayar;
    
    return (
      <Box>
        <Box
          sx={{
            borderBottom: "2px solid #D81B60",
            pb: 1,
            mb: 2,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#64748B" }}>
            Rp
          </Typography>
          <Typography sx={{ fontSize: 26, fontWeight: 900, color: "#1E293B" }}>
            {formatRupiahPos(uangDiterimaNum)}
          </Typography>
        </Box>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Button
              fullWidth
              onClick={() => handleQuickCash(totalBayar)}
              sx={{
                bgcolor: isUangPas ? "#D81B60" : "#FFF0F5",
                color: isUangPas ? "#FFFFFF" : "#D81B60",
                border: "1px solid",
                borderColor: isUangPas ? "#D81B60" : "#FCE4EC",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: 13,
                py: 1,
                textTransform: "none",
                "&:hover": { bgcolor: isUangPas ? "#C2185B" : "#FCE4EC" },
              }}
            >
              Uang Pas
            </Button>
          </Grid>
          {quickCashOptions.map((amt, idx) => {
            const isActive = uangDiterimaNum === amt;
            return (
              <Grid item xs={6} key={idx}>
                <Button
                  fullWidth
                  onClick={() => handleQuickCash(amt)}
                  sx={{
                    bgcolor: isActive ? "#D81B60" : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : "#475569",
                    border: "1px solid",
                    borderColor: isActive ? "#D81B60" : "#E2E8F0",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: 13,
                    py: 1,
                    "&:hover": { bgcolor: isActive ? "#C2185B" : "#F8FAFC" },
                  }}
                >
                  {formatRupiahPos(amt)}
                </Button>
              </Grid>
            );
          })}
        </Grid>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "00", 0].map((num, i) => (
            <Grid item xs={4} key={i}>
              <Button
                fullWidth
                onClick={() => handleNumpadClick(num)}
                sx={{
                  bgcolor: "#FFFFFF",
                  color: "#1E293B",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: 18,
                  py: 1.5,
                  "&:hover": { bgcolor: "#F8FAFC", borderColor: "#CBD5E1" },
                }}
              >
                {num}
              </Button>
            </Grid>
          ))}
          <Grid item xs={4}>
            <Button
              fullWidth
              onClick={handleBackspace}
              sx={{
                bgcolor: "#FFFFFF",
                color: "#D81B60",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                py: 1.5,
                "&:hover": { bgcolor: "#FFF0F5", borderColor: "#FCE4EC" },
              }}
            >
              <BackspaceIcon sx={{ fontSize: 22 }} />
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: "16px", width: "720px", overflow: "hidden" },
      }}
    >
      <Box sx={{ display: "flex", minHeight: "480px" }}>
        {/* PANEL KIRI */}
        <Box
          sx={{
            width: "50%",
            bgcolor: "#FFF5F7",
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#D81B60", mb: 3 }}>
              <ShoppingCartIcon sx={{ fontSize: 22 }} />
              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                Detail Pembayaran
              </Typography>
            </Box>

            <Box sx={{ bgcolor: "#FFFFFF", p: 2.5, borderRadius: "12px", border: "1px solid #FCE4EC", mb: 2 }}>
              <Typography sx={{ fontSize: 13, color: "#64748B", fontWeight: 600, mb: 0.5 }}>
                Total Tagihan
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 900, color: "#D81B60" }}>
                Rp {formatRupiahPos(totalBayar)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>
                Metode {isSplit && "1 (Utama)"}
              </Typography>
              <FormControlLabel
                control={<Switch size="small" checked={isSplit} onChange={(e) => setIsSplit(e.target.checked)} color="secondary" />}
                label={<Typography sx={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>Split Pay</Typography>}
                sx={{ m: 0 }}
              />
            </Box>

            <Grid container spacing={1.5} sx={{ mb: isSplit ? 2 : 0 }}>
              {METODE_LIST.map((m) => {
                const isSelected = metode === m.id;
                return (
                  <Grid item xs={4} key={m.id}>
                    <Box
                      onClick={() => {
                        setMetode(m.id);
                        setIsNewInput(true);
                      }}
                      sx={{
                        bgcolor: "#FFFFFF",
                        border: `2px solid ${isSelected ? "#D81B60" : "#E2E8F0"}`,
                        borderRadius: "12px",
                        p: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                        cursor: "pointer",
                        color: isSelected ? "#D81B60" : "#64748B",
                        transition: "all 0.2s",
                        "&:hover": { borderColor: isSelected ? "#D81B60" : "#CBD5E1" }
                      }}
                    >
                      {m.icon}
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{m.label}</Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Split Metode 2 */}
            {isSplit && (
              <>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1E293B", mb: 1, mt: 1 }}>
                  Metode 2 (Sisa Tagihan)
                </Typography>
                <Grid container spacing={1.5}>
                  {METODE_LIST.filter((m) => m.id !== metode).map((m) => {
                    const isSelected = metode2 === m.id;
                    return (
                      <Grid item xs={6} key={m.id}>
                        <Box
                          onClick={() => setMetode2(m.id)}
                          sx={{
                            bgcolor: "#FFFFFF",
                            border: `2px solid ${isSelected ? "#D81B60" : "#E2E8F0"}`,
                            borderRadius: "12px",
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            cursor: "pointer",
                            color: isSelected ? "#D81B60" : "#64748B",
                            "&:hover": { borderColor: isSelected ? "#D81B60" : "#CBD5E1" }
                          }}
                        >
                          {m.icon}
                          <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{m.label}</Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            )}
          </Box>

          <Button
            variant="outlined"
            onClick={onClose}
            startIcon={<CloseIcon />}
            sx={{
              bgcolor: "#FFFFFF",
              borderColor: "#E2E8F0",
              color: "#64748B",
              borderRadius: "10px",
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              mt: 2,
              "&:hover": { bgcolor: "#F8FAFC", borderColor: "#CBD5E1" }
            }}
          >
            Batalkan Pembayaran (Esc)
          </Button>
        </Box>

        {/* PANEL KANAN */}
        <Box
          sx={{
            width: "50%",
            bgcolor: "#FFFFFF",
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {isSplit ? (
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1E293B", mb: 1.5 }}>
                  Nominal Metode 1 ({metode})
                </Typography>
                {renderNumpadAndCash()}
                <Box sx={{ bgcolor: "#F8FAFC", border: "1px dashed #CBD5E1", borderRadius: "10px", p: 1.5, mt: 1 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#64748B", mb: 0.5 }}>
                    Sisa Tagihan dialihkan ke {metode2}
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#D81B60" }}>
                    Rp {formatRupiahPos(nominalSplit2)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <>
                {metode === "QRIS" ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "350px",
                      textAlign: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#1E293B", mb: 2 }}>
                      Silakan Scan QRIS Apotek
                    </Typography>
                    
                    {/* Mockup QRIS Design */}
                    <Box
                      sx={{
                        p: 2,
                        border: "2px dashed #CBD5E1",
                        borderRadius: "16px",
                        bgcolor: "#FFFFFF",
                        mb: 3,
                        width: 200,
                        height: 200,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                      }}
                    >
                      <QrCode2Icon sx={{ fontSize: 130, color: "#0F172A" }} />
                      <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#0F172A", letterSpacing: 1 }}>
                        QRIS PAYMENT
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748B" }}>
                      <CircularProgress size={16} color="inherit" />
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        Menunggu Pembayaran... ({Math.floor(qrisTimer / 60)}:
                        {String(qrisTimer % 60).padStart(2, "0")})
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1E293B", mb: 1.5 }}>
                      Nominal Diterima
                    </Typography>
                    {renderNumpadAndCash()}
                    <Box sx={{ bgcolor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "10px", p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#2E7D32" }}>
                        Kembalian
                      </Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#2E7D32" }}>
                        Rp {formatRupiahPos(kembalian)}
                      </Typography>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>

          <Button
            fullWidth
            variant="contained"
            disabled={!canPay || loading}
            onClick={handleConfirm}
            startIcon={<CheckCircleOutlineIcon />}
            sx={{
              bgcolor: "#D81B60",
              color: "#FFFFFF",
              borderRadius: "10px",
              py: 1.5,
              fontWeight: 800,
              fontSize: 15,
              textTransform: "none",
              boxShadow: "none",
              mt: 2,
              "&:hover": { bgcolor: "#C2185B" },
              "&.Mui-disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" }
            }}
          >
            {loading
              ? "Memproses..."
              : metode === "QRIS" && !isSplit
                ? "Verifikasi Manual & Bayar"
                : "Konfirmasi Pembayaran (F8)"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PosPaymentModal;