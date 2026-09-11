import React, { useState, useMemo } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { getUser } from "@/auth/auth";
import { colors, radii, typography, shadows } from "@/theme/designTokens";

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

const TutupShiftModal = ({ open, onClose, onConfirm, shiftData }) => {
  const currentUser = getUser();
  
  const modalAwal = shiftData?.modalAwal || 500000;
  const penjualan = shiftData?.totalPenjualanTunai || 0;
  const pengeluaran = shiftData?.totalKasKecil || 0;
  const saldoSistem = modalAwal + penjualan - pengeluaran;

  const [uangFisikInput, setUangFisikInput] = useState("0");

  const cleanUangFisik = useMemo(() => {
    return Number(String(uangFisikInput).replace(/\./g, "")) || 0;
  }, [uangFisikInput]);

  const selisih = cleanUangFisik - saldoSistem;

  const handleInputChange = (e) => {
    setUangFisikInput(formatRupiah(e.target.value));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id_user: currentUser?.id,
      nama_kasir: currentUser?.name || currentUser?.username || "Administrator",
      modal_awal: modalAwal,
      penjualan_tunai: penjualan,
      pengeluaran_kas_kecil: pengeluaran,
      saldo_sistem: saldoSistem,
      uang_fisik: cleanUangFisik,
      selisih: selisih,
      waktu_tutup: new Date().toISOString(),
    };

    if (onConfirm) onConfirm(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
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
              <Typography sx={{ fontWeight: typography.bold, fontSize: typography.h5, color: colors.text }}>
                Tutup Shift (Laporan X)
              </Typography>
              <Typography sx={{ fontSize: typography.caption, color: colors.textSecondary, mt: 0.5 }}>
                Kasir: <strong>{currentUser?.name || currentUser?.username || "Administrator"}</strong>
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={onClose} size="small" sx={{ color: colors.textSecondary }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleFormSubmit} sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
            
            <Box
              sx={{
                bgcolor: colors.bgMuted,
                p: 2,
                borderRadius: `${radii.sm}px`,
                border: `1px solid ${colors.border}`,
                mb: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <ReceiptLongIcon sx={{ color: colors.primary, fontSize: 18 }} />
                <Typography sx={{ fontWeight: typography.bold, fontSize: typography.body, color: colors.text }}>
                  Rincian Sistem
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontSize: typography.body, color: colors.textSecondary }}>Modal Awal (Kasir)</Typography>
                <Typography sx={{ fontSize: typography.body, fontWeight: typography.semibold, color: colors.text }}>
                  Rp {modalAwal.toLocaleString("id-ID")}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontSize: typography.body, color: colors.textSecondary }}>Penjualan Tunai Sistem</Typography>
                <Typography sx={{ fontSize: typography.body, fontWeight: typography.semibold, color: colors.success }}>
                  + Rp {penjualan.toLocaleString("id-ID")}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: typography.body, color: colors.textSecondary }}>Pengeluaran Kas Kecil</Typography>
                <Typography sx={{ fontSize: typography.body, fontWeight: typography.semibold, color: colors.danger }}>
                  - Rp {pengeluaran.toLocaleString("id-ID")}
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5, borderColor: colors.border }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: typography.body, fontWeight: typography.bold, color: colors.text }}>Saldo Sistem (Harapan)</Typography>
                <Typography sx={{ fontSize: typography.h5, fontWeight: typography.bold, color: colors.text }}>
                  Rp {saldoSistem.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <WalletIcon sx={{ color: colors.warning, fontSize: 18 }} />
                <Typography sx={{ fontWeight: typography.bold, fontSize: typography.body, color: colors.text }}>
                  Uang Fisik di Laci
                </Typography>
              </Box>
              <Typography sx={{ fontSize: typography.caption, color: colors.textSecondary, mb: 1.5 }}>
                Hitung dan masukkan total uang tunai yang ada di laci kasir saat ini.
              </Typography>

              <TextField
                fullWidth
                value={uangFisikInput}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontWeight: typography.bold, color: colors.primary, fontSize: typography.bodyLg }}>
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

            <Box
              sx={{
                bgcolor: selisih < 0 ? colors.dangerLight : colors.successLight,
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
                <Typography sx={{ fontSize: typography.caption, fontWeight: typography.semibold, color: colors.textSecondary, mb: 0.5 }}>
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
                  {selisih < 0 ? "KURANG (MINUS)" : selisih > 0 ? "LEBIH (PLUS)" : "SESUAI"}
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
              <InfoOutlinedIcon sx={{ fontSize: 16, color: colors.blue, mt: 0.2 }} />
              <Typography sx={{ fontSize: typography.caption, color: colors.textSecondary, lineHeight: 1.4 }}>
                Jika terdapat selisih, rincian transaksi akan tersimpan secara otomatis ke log audit kasir.
              </Typography>
            </Box>
          </Box>

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
              sx={{
                borderColor: colors.border,
                color: colors.text,
                borderRadius: `${radii.sm}px`,
                textTransform: "none",
                fontWeight: typography.semibold,
                fontSize: typography.body,
                py: 1.2,
                bgcolor: colors.bgCard,
                "&:hover": { bgcolor: colors.bgMuted, borderColor: colors.borderHover },
              }}
            >
              Kembali ke POS
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: colors.primary,
                borderRadius: `${radii.sm}px`,
                textTransform: "none",
                fontWeight: typography.bold,
                fontSize: typography.body,
                py: 1.2,
                boxShadow: "none",
                "&:hover": { bgcolor: colors.primaryHover, boxShadow: "none" },
              }}
            >
              Konfirmasi & Tutup Shift
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TutupShiftModal;