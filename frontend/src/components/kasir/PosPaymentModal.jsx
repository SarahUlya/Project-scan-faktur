import React, { useState, useEffect, useMemo, useRef } from "react";
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
  const [isNewInput, setIsNewInput] = useState(true);
  const [isSplit, setIsSplit] = useState(false);
  const [metode2, setMetode2] = useState("QRIS");
  const [qrisTimer, setQrisTimer] = useState(300);

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

  useEffect(() => {
    let interval;
    if (open && !isSplit && metode === "QRIS" && qrisTimer > 0) {
      interval = setInterval(() => setQrisTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [open, isSplit, metode, qrisTimer]);

  const uangDiterimaNum = useMemo(
    () => Number(uangDiterimaStr) || 0,
    [uangDiterimaStr],
  );

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
    setIsNewInput(true);
  };

  const buildMetodeBayar = () => {
    if (isSplit) {
      return [
        { jenis: metode, nominal: nominalSplit1 },
        { jenis: metode2, nominal: nominalSplit2 },
      ].filter((m) => m.nominal > 0);
    }
    return [{ jenis: metode, nominal: totalBayar }];
  };

  const handleConfirm = async () => {
    if (!canPay || cart.length === 0) return;
    setLoading(true);

    const cartSnapshot = [...cart];
    const metodeBayarArray = buildMetodeBayar();
    const finalMetodeStr = isSplit ? `SPLIT_${metode}_${metode2}` : metode;

    const totalDiskonItem = cartSnapshot.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;
      const diskonPerUnit = Number(item.diskon_item) || 0;
      return sum + diskonPerUnit * qty;
    }, 0);

    const subtotalMentah = cartSnapshot.reduce((sum, item) => {
      const harga = Number(item.harga || item.harga_jual || 0);
      const qty = Number(item.qty) || 0;
      return sum + harga * qty;
    }, 0);

    try {
      const transactionPayload = {
        metode_bayar: metodeBayarArray,
        subtotal: subtotalMentah,
        total_bayar: totalBayar,
        diskon_nota_nominal: diskonNominal,
        diskon_item_nominal: totalDiskonItem,
        ppn_persen: pajakNominal,
        shift_id: shift?.id_shift || shift?.id || null,

        items: cartSnapshot.map((item) => {
          const harga = Number(item.harga || item.harga_jual || 0);
          const qty = Number(item.qty) || 0;
          const diskonPerUnit = Number(item.diskon_item) || 0;
          const subtotalPerItem = Math.max(0, harga - diskonPerUnit) * qty;

          return {
            barcode: item.barcode || item.kode_produk || item.kode || "",
            id_produk: item.id_produk || item.id,
            qty: qty,
            harga: harga,
            diskon_item: diskonPerUnit,
            diskon_tipe: item.diskon_tipe || "Rp",
            subtotal: subtotalPerItem,
            id_batch:
              item.id_batch ||
              (typeof item.batch === "object" ? item.batch?.id_batch : null),
          };
        }),

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

      console.log(
        "[Payment] PAYLOAD DIKIRIM:",
        JSON.stringify(transactionPayload, null, 2),
      );

      const result = await processTransaksi(transactionPayload);

      // ⚡ Susun data receipt untuk auto-print di PosSuccessModal
      const receiptItems = cartSnapshot.map((item) => {
        const harga = Number(item.harga || item.harga_jual || 0);
        const qty = Number(item.qty) || 0;
        const diskonPerUnit = Number(item.diskon_item) || 0;
        const subtotalPerItem = Math.max(0, harga - diskonPerUnit) * qty;

        // ⚡ Ambil batch + expired dari transaksibatch
        let batchText = "-";
        let expText = "-";
        const batches = item.transaksibatch || item.transaksiBatch || [];

        if (Array.isArray(batches) && batches.length > 0) {
          const batchList = batches
            .map((b) => {
              const bp = b.batchproduk || b.batch || {};
              return {
                no_batch: bp.no_batch || b.no_batch || null,
                expired: bp.expired_date || b.expired_date || null,
              };
            })
            .filter((b) => b.no_batch);

          if (batchList.length > 0) {
            batchText = batchList.map((b) => b.no_batch).join(", ");
            const exps = batchList
              .map((b) => b.expired)
              .filter((e) => e)
              .map((e) => {
                try {
                  const d = new Date(e);
                  return d.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                } catch {
                  return null;
                }
              })
              .filter((e) => e);
            if (exps.length > 0) expText = exps.join(", ");
          }
        } else if (item.batch?.no_batch) {
          batchText = item.batch.no_batch;
          if (item.batch.expired_date) {
            try {
              expText = new Date(item.batch.expired_date).toLocaleDateString(
                "id-ID",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                },
              );
            } catch {}
          }
        } else if (item.no_batch) {
          batchText = item.no_batch;
        }

        return {
          nama: item.nama_produk || item.nama || "-",
          nama_produk: item.nama_produk || item.nama || "-",
          harga,
          harga_jual: harga,
          qty,
          diskon_item: diskonPerUnit,
          diskon_tipe: item.diskon_tipe || "Rp",
          subtotal: subtotalPerItem,
          batch: batchText,
          no_batch: batchText,
          exp: expText, // ⚡ kirim expired
          expired: expText, // alias
        };
      });

      clearCart();
      onSuccess?.({
        ...result,
        cetakStruk,
        metode: finalMetodeStr,
        metode_bayar: metodeBayarArray,
        kembalian,
        subtotal: subtotalMentah,
        total: totalBayar,
        uangDiterima: isSplit
          ? totalBayar
          : metode === "TUNAI"
            ? uangDiterimaNum
            : totalBayar,
        cart: cartSnapshot,
        kasir: namaKasirAktif,
        // ⚡ Data lengkap untuk auto-print di PosSuccessModal
        receiptData: {
          apotek: setting,
          kode: result?.kode_transaksi || `TRX-${Date.now()}`,
          tanggal: new Date().toISOString(),
          kasir: namaKasirAktif,
          metode: finalMetodeStr,
          subtotal: subtotalMentah,
          diskon: diskonNominal + totalDiskonItem,
          ppn: pajakNominal,
          total: totalBayar,
          bayar: isSplit
            ? totalBayar
            : metode === "TUNAI"
              ? uangDiterimaNum
              : totalBayar,
          kembalian,
          items: receiptItems,
        },
      });
    } catch (e) {
      const errMsg =
        e.response?.data?.message || e.message || "Gagal memproses transaksi.";
      alert(errMsg);
      console.error("[Payment] ERROR:", e.response?.data || e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRef = useRef(handleConfirm);
  useEffect(() => {
    handleConfirmRef.current = handleConfirm;
  });

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "F8") {
        e.preventDefault();
        e.stopPropagation();
        if (!loading && canPay && cart.length > 0) {
          handleConfirmRef.current();
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (!loading) onClose?.();
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, loading, canPay, cart.length, onClose]);

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
                bgcolor: isUangPas ? "#D81B60" : "#FFFFFF",
                color: isUangPas ? "#FFFFFF" : "#475569",
                border: "1px solid",
                borderColor: isUangPas ? "#D81B60" : "#E2E8F0",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: 13,
                py: 1,
                textTransform: "none",
                "&:hover": { bgcolor: isUangPas ? "#C2185B" : "#FFFFFF" },
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#D81B60",
                mb: 3,
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 22 }} />
              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                Detail Pembayaran
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "#FFFFFF",
                p: 2.5,
                borderRadius: "12px",
                border: "1px solid #FCE4EC",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#64748B",
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                Total Tagihan
              </Typography>
              <Typography
                sx={{ fontSize: 28, fontWeight: 900, color: "#D81B60" }}
              >
                Rp {formatRupiahPos(totalBayar)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}
              >
                Metode {isSplit && "1 (Utama)"}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={isSplit}
                    onChange={(e) => setIsSplit(e.target.checked)}
                    color="secondary"
                  />
                }
                label={
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}
                  >
                    Split Pay
                  </Typography>
                }
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
                        border: `2px solid ${
                          isSelected ? "#D81B60" : "#E2E8F0"
                        }`,
                        borderRadius: "12px",
                        p: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                        cursor: "pointer",
                        color: isSelected ? "#D81B60" : "#64748B",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: isSelected ? "#D81B60" : "#CBD5E1",
                        },
                      }}
                    >
                      {m.icon}
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                        {m.label}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {isSplit && (
              <>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1E293B",
                    mb: 1,
                    mt: 1,
                  }}
                >
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
                            border: `2px solid ${
                              isSelected ? "#D81B60" : "#E2E8F0"
                            }`,
                            borderRadius: "12px",
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            cursor: "pointer",
                            color: isSelected ? "#D81B60" : "#64748B",
                            "&:hover": {
                              borderColor: isSelected ? "#D81B60" : "#CBD5E1",
                            },
                          }}
                        >
                          {m.icon}
                          <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                            {m.label}
                          </Typography>
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
              "&:hover": { bgcolor: "#F8FAFC", borderColor: "#CBD5E1" },
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
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1E293B",
                    mb: 1.5,
                  }}
                >
                  Nominal Metode 1 ({metode})
                </Typography>
                {renderNumpadAndCash()}
                <Box
                  sx={{
                    bgcolor: "#F8FAFC",
                    border: "1px dashed #CBD5E1",
                    borderRadius: "10px",
                    p: 1.5,
                    mt: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#64748B",
                      mb: 0.5,
                    }}
                  >
                    Sisa Tagihan dialihkan ke {metode2}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 18, fontWeight: 800, color: "#D81B60" }}
                  >
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
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "#1E293B",
                        mb: 2,
                      }}
                    >
                      Silakan Scan QRIS Apotek
                    </Typography>

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
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      <QrCode2Icon sx={{ fontSize: 130, color: "#0F172A" }} />
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: 13,
                          color: "#0F172A",
                          letterSpacing: 1,
                        }}
                      >
                        QRIS PAYMENT
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#64748B",
                      }}
                    >
                      <CircularProgress size={16} color="inherit" />
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        Menunggu Pembayaran... ({Math.floor(qrisTimer / 60)}:
                        {String(qrisTimer % 60).padStart(2, "0")})
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1E293B",
                        mb: 1.5,
                      }}
                    >
                      Nominal Diterima
                    </Typography>
                    {renderNumpadAndCash()}
                    <Box
                      sx={{
                        bgcolor: "#E8F5E9",
                        border: "1px solid #A5D6A7",
                        borderRadius: "10px",
                        p: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 13, fontWeight: 700, color: "#2E7D32" }}
                      >
                        Kembalian
                      </Typography>
                      <Typography
                        sx={{ fontSize: 20, fontWeight: 900, color: "#2E7D32" }}
                      >
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
              "&.Mui-disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" },
            }}
          >
            {loading
              ? "Memproses..."
              : metode === "QRIS" && !isSplit
                ? "Verifikasi Manual & Bayar (F8)"
                : "Konfirmasi Pembayaran (F8)"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PosPaymentModal;
