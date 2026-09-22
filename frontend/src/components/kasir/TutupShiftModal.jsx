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
import { tutupShiftApi, getKasKecilListApi } from "@/api/transaksiApi";
import { colors, radii, typography, shadows } from "@/theme/designTokens";

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
 * ⚡ HELPER — Hitung total kas kecil (masuk & keluar terpisah)
 * Return: { totalMasuk, totalKeluar }
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
    } else if (tipe.includes("keluar") || tipe.includes("out")) {
      totalKeluar += nominal;
    } else {
      // Kalau tipe tidak jelas, anggap keluar (safety)
      console.warn("[TutupShift] tipe kas kecil tidak dikenal:", tipe, item);
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

  // ── Base data dari shiftData ────────────────────────────────────
  const idShift = shiftData?.id_shift || shiftData?.id || null;
  const modalAwal = Number(shiftData?.modalAwal ?? shiftData?.modal_awal ?? 0);
  const penjualan = Number(
    shiftData?.totalPenjualanTunai ?? shiftData?.penjualan_tunai ?? 0
  );

  // ⚡ State kas kecil — TERPISAH masuk & keluar
  const [kasMasuk, setKasMasuk] = useState(0);
  const [kasKeluar, setKasKeluar] = useState(0);
  const [kasKecilLoading, setKasKecilLoading] = useState(false);
  const [kasKecilError, setKasKecilError] = useState("");

  // ── State form ──────────────────────────────────────────────────
  const [uangFisikInput, setUangFisikInput] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ══════════════════════════════════════════════════════════════════
  // ⚡ SALDO SISTEM = Modal Awal + Penjualan + Kas Masuk − Kas Keluar
  // ══════════════════════════════════════════════════════════════════
  const saldoSistem = modalAwal + penjualan + kasMasuk - kasKeluar;

  const cleanUangFisik = useMemo(() => {
    return Number(String(uangFisikInput).replace(/\./g, "")) || 0;
  }, [uangFisikInput]);

  const selisih = cleanUangFisik - saldoSistem;

  /* ══════════════════════════════════════════════════════════════════
   * FETCH KAS KECIL saat modal dibuka
   * ══════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!open) return;
    if (!idShift) {
      setKasMasuk(0);
      setKasKeluar(0);
      return;
    }

    let cancelled = false;
    (async () => {
      setKasKecilLoading(true);
      setKasKecilError("");
      try {
        console.log("[TutupShift] fetch kas kecil id_shift:", idShift);

        const res = await getKasKecilListApi({ id_shift: idShift });
        if (cancelled) return;

        const list = Array.isArray(res) ? res : res?.data || [];
        console.log("[TutupShift] kas kecil list:", list);

        const { totalMasuk, totalKeluar } = hitungTotalKasKecil(list);
        console.log(
          "[TutupShift] kas masuk:",
          totalMasuk,
          "| kas keluar:",
          totalKeluar
        );

        setKasMasuk(totalMasuk);
        setKasKeluar(totalKeluar);
      } catch (err) {
        if (cancelled) return;
        console.error("[TutupShift] gagal fetch kas kecil:", err);
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

  /* ══════════════════════════════════════════════════════════════════
   * RESET FORM saat modal dibuka
   * ══════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (open) {
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  // ⚡ Auto-fill uang fisik = saldo sistem setelah kas kecil selesai fetch
  useEffect(() => {
    if (open && !kasKecilLoading) {
      const saldoTerbaru = modalAwal + penjualan + kasMasuk - kasKeluar;
      setUangFisikInput(
        saldoTerbaru > 0 ? formatRupiah(String(saldoTerbaru)) : "0"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kasMasuk, kasKeluar, kasKecilLoading]);

  const handleInputChange = (e) => {
    setUangFisikInput(formatRupiah(e.target.value));
    if (error) setError("");
  };

  /* ══════════════════════════════════════════════════════════════════
   * SUBMIT — tutup shift
   * ══════════════════════════════════════════════════════════════════ */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!idShift) {
      setError("ID shift tidak ditemukan. Hubungi admin.");
      return;
    }

    if (kasKecilLoading) {
      setError("Menunggu data kas kecil selesai dimuat...");
      return;
    }

    setSubmitting(true);
    try {
      console.log("[TutupShift] PUT /shift/tutup", {
        id_shift: idShift,
        modal_akhir: cleanUangFisik,
      });

      const res = await tutupShiftApi({
        id_shift: idShift,
        modal_akhir: cleanUangFisik,
      });

      console.log("[TutupShift] response:", res);

      const closedShift = res?.data;
      if (onConfirm) {
        onConfirm(closedShift || { id_shift: idShift, status: "CLOSED" });
      }
    } catch (err) {
      console.error("[TutupShift] error:", err);
      console.error("[TutupShift] response:", err?.response?.data);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal menutup shift";

      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

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
          borderRadius: `${radii.sm}px`,
          boxShadow: shadows.floating,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* ═══ HEADER ═══ */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: `${radii.sm}px`,
                bgcolor: colors.surfacePink,
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

        {/* ═══ BODY (scrollable) ═══ */}
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
          <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
            {/* ═══ RINCIAN SISTEM ═══ */}
            <Box
              sx={{
                bgcolor: colors.bgMuted,
                p: 2,
                borderRadius: `${radii.sm}px`,
                border: `1px solid ${colors.border}`,
                mb: 2.5,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <ReceiptLongIcon sx={{ color: colors.primary, fontSize: 18 }} />
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
                <Typography
                  sx={{
                    fontSize: typography.body,
                    color: colors.textSecondary,
                  }}
                >
                  Penjualan Tunai Sistem
                </Typography>
                <Typography
                  sx={{
                    fontSize: typography.body,
                    fontWeight: typography.semibold,
                    color: colors.success,
                  }}
                >
                  + Rp {penjualan.toLocaleString("id-ID")}
                </Typography>
              </Box>

              {/* ⚡ KAS MASUK */}
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

              {/* ⚡ KAS KELUAR */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
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

              {/* Error kas kecil */}
              {kasKecilError && (
                <Box
                  sx={{
                    mb: 1.5,
                    p: 1,
                    bgcolor: "#FEF3C7",
                    border: `1px solid ${colors.warning || "#F59E0B"}`,
                    borderRadius: `${radii.xs || 2}px`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#92400E",
                      fontWeight: typography.semibold,
                    }}
                  >
                    ⚠ {kasKecilError}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 1.5, borderColor: colors.border }} />

              {/* Saldo Sistem */}
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

            {/* ═══ INPUT UANG FISIK ═══ */}
            <Box sx={{ mb: 2.5 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
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
                  mb: 1.5,
                }}
              >
                Hitung dan masukkan total uang tunai yang ada di laci kasir saat
                ini.
              </Typography>

              <TextField
                fullWidth
                value={uangFisikInput}
                onChange={handleInputChange}
                disabled={submitting || kasKecilLoading}
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
                    borderRadius: `${radii.sm}px`,
                    bgcolor: colors.bgCard,
                    "& fieldset": { borderColor: colors.border },
                    "&:hover fieldset": { borderColor: colors.primary },
                    "&.Mui-focused fieldset": { borderColor: colors.primary },
                  },
                }}
              />
            </Box>

            {/* ═══ SELISIH ═══ */}
            <Box
              sx={{
                bgcolor:
                  selisih < 0 ? colors.dangerLight : colors.successLight,
                p: 2,
                borderRadius: `${radii.sm}px`,
                border: `1px solid ${selisih < 0 ? "#FCA5A5" : "#86EFAC"}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
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
                    borderRadius: `${radii.s}px`,
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

            {/* ERROR MESSAGE */}
            {error && (
              <Box
                sx={{
                  mb: 2,
                  p: 1.2,
                  bgcolor: colors.dangerLight || "#FEE2E2",
                  border: `1px solid ${colors.danger || "#DC2626"}`,
                  borderRadius: `${radii.sm}px`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: colors.danger || "#DC2626",
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
                  bgcolor: colors.surfaceHover,
                  p: 1.5,
                  borderRadius: `${radii.sm}px`,
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

          {/* ═══ FOOTER ═══ */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: colors.surfacePink,
              borderTop: `1px solid ${colors.border}`,
              display: "flex",
              gap: 1.5,
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
                borderRadius: `${radii.sm}px`,
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
              disabled={submitting || kasKecilLoading}
              endIcon={
                submitting ? (
                  <CircularProgress size={18} sx={{ color: "#FFF" }} />
                ) : (
                  <ArrowForwardIcon />
                )
              }
              sx={{
                bgcolor: colors.primary,
                borderRadius: `${radii.sm}px`,
                textTransform: "none",
                fontWeight: typography.bold,
                fontSize: typography.body,
                py: 1.2,
                boxShadow: "none",
                "&:hover": { bgcolor: colors.primaryHover, boxShadow: "none" },
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