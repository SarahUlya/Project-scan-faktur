import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import { getUser } from "@/auth/auth";
import {
  tutupShiftApi,
  getKasKecilListApi,
  getTransaksi,
} from "@/api/transaksiApi";
import { colors, radii, typography, shadows, spacing } from "@/theme/designTokens";

/* ══════════════════════════════════════════════════════════════════
 * HELPER — Format Rupiah
 * ══════════════════════════════════════════════════════════════════ */
const formatRupiah = (val) => {
  const numberString = String(val).replace(/[^,\d]/g, "");
  const split = numberString.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }
  return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
};

/* ══════════════════════════════════════════════════════════════════
 * HELPER — Ambil nilai pertama yang tidak null
 * ══════════════════════════════════════════════════════════════════ */
const firstNumber = (...values) => {
  for (const v of values) {
    if (v === null || v === undefined) continue;
    const n = Number(v);
    if (!isNaN(n) && n !== 0) return n;
  }
  return 0;
};

/* ══════════════════════════════════════════════════════════════════
 * HELPER — Cek status LUNAS
 * ══════════════════════════════════════════════════════════════════ */
const isLunas = (status) => {
  const s = String(status || "").toUpperCase();
  return s.includes("LUNAS") || s.includes("SELESAI") || s.includes("PAID");
};

/* ══════════════════════════════════════════════════════════════════
 * HELPER — Hitung total kas kecil
 * ══════════════════════════════════════════════════════════════════ */
const hitungTotalKasKecil = (list) => {
  if (!Array.isArray(list)) return { totalMasuk: 0, totalKeluar: 0 };

  let totalMasuk = 0;
  let totalKeluar = 0;

  list.forEach((item) => {
    const tipe = String(item.tipe || item.jenis || "").toLowerCase();
    const nominal = Number(item.nominal ?? item.jumlah ?? 0);

    if (tipe.includes("masuk") || tipe.includes("in")) {
      totalMasuk += nominal;
    } else {
      totalKeluar += nominal;
    }
  });

  return { totalMasuk, totalKeluar };
};

/* ══════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ══════════════════════════════════════════════════════════════════ */
const TutupShiftModal = ({ open, onClose, onConfirm, shiftData }) => {
  const currentUser = getUser();

  const idShift =
    shiftData?.id_shift || shiftData?.id || shiftData?.shift_id || null;

  const modalAwal = firstNumber(
    shiftData?.modalAwal,
    shiftData?.modal_awal,
    shiftData?.modal,
    0
  );

  // ── State penjualan tunai (dari API) ────────────────────────────
  const [penjualanTunaiApi, setPenjualanTunaiApi] = useState(0);
  const [penjualanLoading, setPenjualanLoading] = useState(false);

  // ── State kas kecil ─────────────────────────────────────────────
  const [kasMasuk, setKasMasuk] = useState(0);
  const [kasKeluar, setKasKeluar] = useState(0);
  const [kasKecilLoading, setKasKecilLoading] = useState(false);
  const [kasKecilError, setKasKecilError] = useState("");

  // ── State form ──────────────────────────────────────────────────
  const [uangFisikInput, setUangFisikInput] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ⚡ FETCH PENJUALAN TUNAI dari API transaksi
  useEffect(() => {
    if (!open || !idShift) {
      setPenjualanTunaiApi(0);
      return;
    }

    let cancelled = false;
    (async () => {
      setPenjualanLoading(true);
      try {
        console.log("[TutupShift] fetch transaksi untuk shift:", idShift);
        const res = await getTransaksi();
        if (cancelled) return;

        const list = Array.isArray(res) ? res : res?.data || [];
        console.log("[TutupShift] total transaksi:", list.length);

        // Filter transaksi milik shift ini
        const transaksiShift = list.filter((t) => {
          const sid = t.id_shift || t.shift_id;
          return String(sid) === String(idShift);
        });
        console.log(
          "[TutupShift] transaksi shift ini:",
          transaksiShift.length,
          transaksiShift
        );

        // Filter yang TUNAI + LUNAS, lalu sum
        const totalTunai = transaksiShift
          .filter((t) => {
            const metode = String(
              t.metode_bayar || t.metode || ""
            ).toUpperCase();
            return metode === "TUNAI" && isLunas(t.status);
          })
          .reduce(
            (sum, t) => sum + Number(t.total || t.total_bayar || 0),
            0
          );

        console.log("[TutupShift] total tunai dari API:", totalTunai);
        setPenjualanTunaiApi(totalTunai);
      } catch (err) {
        console.error("[TutupShift] gagal fetch transaksi:", err);
        setPenjualanTunaiApi(0);
      } finally {
        if (!cancelled) setPenjualanLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, idShift]);

  // ⚡ FETCH KAS KECIL
  useEffect(() => {
    if (!open || !idShift) {
      setKasMasuk(0);
      setKasKeluar(0);
      return;
    }

    let cancelled = false;
    (async () => {
      setKasKecilLoading(true);
      setKasKecilError("");
      try {
        const res = await getKasKecilListApi({ id_shift: idShift });
        if (cancelled) return;

        const list = Array.isArray(res) ? res : res?.data || [];
        const { totalMasuk, totalKeluar } = hitungTotalKasKecil(list);

        setKasMasuk(totalMasuk);
        setKasKeluar(totalKeluar);
      } catch (err) {
        if (cancelled) return;
        setKasKecilError(
          err?.response?.data?.message || "Gagal memuat data kas kecil"
        );
        setKasMasuk(0);
        setKasKeluar(0);
      } finally {
        if (!cancelled) setKasKecilLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, idShift]);

  // ── Penjualan final (prioritas dari API) ────────────────────────
  const penjualanDariProps = firstNumber(
    shiftData?.totalPenjualanTunai,
    shiftData?.penjualan_tunai,
    shiftData?.total_penjualan_tunai,
    0
  );

  const penjualan =
    penjualanTunaiApi > 0 ? penjualanTunaiApi : penjualanDariProps;

  // ══════════════════════════════════════════════════════════════════
  // SALDO SISTEM
  // ══════════════════════════════════════════════════════════════════
  const saldoSistem = modalAwal + penjualan + kasMasuk - kasKeluar;

  const cleanUangFisik = useMemo(
    () => Number(String(uangFisikInput).replace(/\./g, "")) || 0,
    [uangFisikInput]
  );

  const selisih = cleanUangFisik - saldoSistem;

  // ── Reset form saat modal dibuka ────────────────────────────────
  useEffect(() => {
    if (open) {
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  // ── Auto-fill uang fisik = saldo sistem ─────────────────────────
  useEffect(() => {
    if (open && !kasKecilLoading && !penjualanLoading) {
      const saldoTerbaru = modalAwal + penjualan + kasMasuk - kasKeluar;
      setUangFisikInput(
        saldoTerbaru > 0 ? formatRupiah(String(saldoTerbaru)) : "0"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kasMasuk, kasKeluar, kasKecilLoading, penjualan, penjualanLoading]);

  const handleInputChange = (e) => {
    setUangFisikInput(formatRupiah(e.target.value));
    if (error) setError("");
  };

  /* ══════════════════════════════════════════════════════════════════
   * SUBMIT
   * ══════════════════════════════════════════════════════════════════ */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!idShift) {
      setError("ID shift tidak ditemukan. Hubungi admin.");
      return;
    }

    if (kasKecilLoading || penjualanLoading) {
      setError("Menunggu data selesai dimuat...");
      return;
    }

    setSubmitting(true);
    try {
      const res = await tutupShiftApi({
        id_shift: idShift,
        modal_akhir: cleanUangFisik,
      });

      const closedShift = res?.data;
      if (onConfirm) {
        onConfirm(closedShift || { id_shift: idShift, status: "CLOSED" });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal menutup shift";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = kasKecilLoading || penjualanLoading;

  /* ══════════════════════════════════════════════════════════════════
   * RENDER
   * ══════════════════════════════════════════════════════════════════ */
  return (
    <Modal open={open} onClose={submitting ? undefined : onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 520,
          bgcolor: colors.bgCard,
          borderRadius: radii.s,
          boxShadow: shadows.floating,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            p: spacing.xxl,
            pb: spacing.lg,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Box sx={{ display: "flex", gap: spacing.md, alignItems: "center" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: radii.s,
                bgcolor: colors.primaryLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ReceiptLongIcon sx={{ color: colors.primary, fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: typography.bold,
                  fontSize: typography.h5,
                  color: colors.text,
                }}
              >
                Tutup Shift (Laporan X)
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.caption,
                  color: colors.textSecondary,
                  mt: 0.5,
                }}
              >
                Kasir:{" "}
                <strong>
                  {currentUser?.name ||
                    currentUser?.username ||
                    "Administrator"}
                </strong>
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            disabled={submitting}
            size="small"
            sx={{ color: colors.textSecondary }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* BODY */}
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: spacing.xxl, overflowY: "auto", flex: 1 }}>
            {/* RINCIAN SISTEM */}
            <Box
              sx={{
                bgcolor: colors.bgMuted,
                p: spacing.lg,
                borderRadius: radii.s,
                border: `1px solid ${colors.border}`,
                mb: spacing.xl,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: spacing.md,
                }}
              >
                <ReceiptLongIcon
                  sx={{ color: colors.primary, fontSize: 18 }}
                />
                <Typography
                  sx={{
                    fontWeight: typography.bold,
                    fontSize: typography.body,
                    color: colors.text,
                  }}
                >
                  Rincian Sistem
                </Typography>
              </Box>

              {/* Modal Awal */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: typography.body,
                    color: colors.textSecondary,
                  }}
                >
                  Modal Awal (Kasir)
                </Typography>
                <Typography
                  sx={{
                    fontSize: typography.body,
                    fontWeight: typography.semibold,
                    color: colors.text,
                  }}
                >
                  Rp {modalAwal.toLocaleString("id-ID")}
                </Typography>
              </Box>

              {/* Penjualan Tunai */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Typography
                    sx={{
                      fontSize: typography.body,
                      color: colors.textSecondary,
                    }}
                  >
                    Penjualan Tunai Sistem
                  </Typography>
                  {penjualanLoading && (
                    <CircularProgress
                      size={12}
                      sx={{ color: colors.textMuted }}
                    />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: typography.body,
                    fontWeight: typography.semibold,
                    color: penjualan > 0 ? colors.success : colors.textMuted,
                  }}
                >
                  + Rp {penjualan.toLocaleString("id-ID")}
                </Typography>
              </Box>

              {/* Kas Masuk */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowUpwardIcon
                    sx={{ fontSize: 14, color: colors.success }}
                  />
                  <Typography
                    sx={{
                      fontSize: typography.body,
                      color: colors.textSecondary,
                    }}
                  >
                    Kas Masuk
                  </Typography>
                  {kasKecilLoading && (
                    <CircularProgress
                      size={12}
                      sx={{ color: colors.textMuted }}
                    />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: typography.body,
                    fontWeight: typography.semibold,
                    color: kasMasuk > 0 ? colors.success : colors.textMuted,
                  }}
                >
                  + Rp {kasMasuk.toLocaleString("id-ID")}
                </Typography>
              </Box>

              {/* Kas Keluar */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: spacing.md,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowDownwardIcon
                    sx={{ fontSize: 14, color: colors.danger }}
                  />
                  <Typography
                    sx={{
                      fontSize: typography.body,
                      color: colors.textSecondary,
                    }}
                  >
                    Kas Keluar
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: typography.body,
                    fontWeight: typography.semibold,
                    color: colors.danger,
                  }}
                >
                  - Rp {kasKeluar.toLocaleString("id-ID")}
                </Typography>
              </Box>

              {kasKecilError && (
                <Box
                  sx={{
                    mb: spacing.md,
                    p: 1,
                    bgcolor: colors.warningLight,
                    border: `1px solid ${colors.warning}`,
                    borderRadius: radii.xs,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: typography.small,
                      color: colors.warning,
                      fontWeight: typography.semibold,
                    }}
                  >
                    ⚠ {kasKecilError}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: spacing.md, borderColor: colors.border }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: typography.body,
                    fontWeight: typography.bold,
                    color: colors.text,
                  }}
                >
                  Saldo Sistem (Harapan)
                </Typography>
                <Typography
                  sx={{
                    fontSize: typography.h5,
                    fontWeight: typography.bold,
                    color: colors.text,
                  }}
                >
                  Rp {saldoSistem.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Box>

            {/* INPUT UANG FISIK */}
            <Box sx={{ mb: spacing.xl }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <WalletIcon sx={{ color: colors.warning, fontSize: 18 }} />
                <Typography
                  sx={{
                    fontWeight: typography.bold,
                    fontSize: typography.body,
                    color: colors.text,
                  }}
                >
                  Uang Fisik di Laci
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: typography.caption,
                  color: colors.textSecondary,
                  mb: spacing.md,
                }}
              >
                Hitung dan masukkan total uang tunai yang ada di laci kasir
                saat ini.
              </Typography>

              <TextField
                fullWidth
                value={uangFisikInput}
                onChange={handleInputChange}
                disabled={submitting || isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography
                        sx={{
                          fontWeight: typography.bold,
                          color: colors.primary,
                          fontSize: typography.bodyLg,
                        }}
                      >
                        Rp
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    textAlign: "right",
                    fontWeight: typography.bold,
                    fontSize: "22px",
                    color: colors.text,
                    padding: "8px 12px",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: radii.s,
                    bgcolor: colors.bgCard,
                    "& fieldset": { borderColor: colors.border },
                    "&:hover fieldset": { borderColor: colors.primary },
                    "&.Mui-focused fieldset": { borderColor: colors.primary },
                  },
                }}
              />
            </Box>

            {/* SELISIH */}
            <Box
              sx={{
                bgcolor:
                  selisih < 0 ? colors.dangerLight : colors.successLight,
                p: spacing.lg,
                borderRadius: radii.s,
                border: `1px solid ${
                  selisih < 0 ? colors.danger : colors.success
                }40`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: spacing.lg,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: typography.caption,
                    fontWeight: typography.semibold,
                    color: colors.textSecondary,
                    mb: 0.5,
                  }}
                >
                  Selisih (Fisik - Sistem)
                </Typography>
                <Box
                  component="span"
                  sx={{
                    bgcolor: selisih < 0 ? colors.danger : colors.success,
                    color: colors.textOnDark,
                    fontSize: typography.tiny,
                    fontWeight: typography.bold,
                    px: 1,
                    py: 0.3,
                    borderRadius: radii.xs,
                    display: "inline-block",
                  }}
                >
                  {selisih < 0
                    ? "KURANG (MINUS)"
                    : selisih > 0
                    ? "LEBIH (PLUS)"
                    : "SESUAI"}
                </Box>
              </Box>

              <Typography
                sx={{
                  fontWeight: typography.bold,
                  fontSize: typography.h4,
                  color: selisih < 0 ? colors.danger : colors.success,
                }}
              >
                {selisih < 0
                  ? `- Rp ${Math.abs(selisih).toLocaleString("id-ID")}`
                  : selisih > 0
                  ? `+ Rp ${selisih.toLocaleString("id-ID")}`
                  : `Rp 0`}
              </Typography>
            </Box>

            {error && (
              <Box
                sx={{
                  mb: spacing.lg,
                  p: 1.2,
                  bgcolor: colors.dangerLight,
                  border: `1px solid ${colors.danger}`,
                  borderRadius: radii.s,
                }}
              >
                <Typography
                  sx={{
                    fontSize: typography.caption,
                    color: colors.danger,
                    fontWeight: typography.semibold,
                  }}
                >
                  {error}
                </Typography>
              </Box>
            )}

            {!error && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  bgcolor: colors.bgMuted,
                  p: spacing.md,
                  borderRadius: radii.s,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <InfoOutlinedIcon
                  sx={{ fontSize: 16, color: colors.blue, mt: 0.2 }}
                />
                <Typography
                  sx={{
                    fontSize: typography.caption,
                    color: colors.textSecondary,
                    lineHeight: 1.4,
                  }}
                >
                  Jika terdapat selisih, rincian transaksi akan tersimpan
                  secara otomatis ke log audit kasir.
                </Typography>
              </Box>
            )}
          </Box>

          {/* FOOTER */}
          <Box
            sx={{
              p: spacing.xl,
              bgcolor: colors.primaryLight,
              borderTop: `1px solid ${colors.border}`,
              display: "flex",
              gap: spacing.md,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              disabled={submitting}
              sx={{
                borderColor: colors.border,
                color: colors.text,
                borderRadius: radii.s,
                textTransform: "none",
                fontWeight: typography.semibold,
                fontSize: typography.body,
                py: 1.2,
                bgcolor: colors.bgCard,
                "&:hover": {
                  bgcolor: colors.bgMuted,
                  borderColor: colors.borderHover,
                },
              }}
            >
              Kembali ke POS
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting || isLoading}
              endIcon={
                submitting ? (
                  <CircularProgress size={18} sx={{ color: "#FFF" }} />
                ) : (
                  <ArrowForwardIcon />
                )
              }
              sx={{
                bgcolor: colors.primary,
                borderRadius: radii.s,
                textTransform: "none",
                fontWeight: typography.bold,
                fontSize: typography.body,
                py: 1.2,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: colors.primaryHover,
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  bgcolor: colors.primary,
                  opacity: 0.7,
                  color: "#FFF",
                },
              }}
            >
              {submitting ? "Menutup Shift..." : "Konfirmasi & Tutup Shift"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TutupShiftModal;