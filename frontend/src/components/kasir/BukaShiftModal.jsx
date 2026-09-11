import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import { getUser } from "@/auth/auth";
import { colors, radii, typography, shadows } from "@/theme/designTokens";

const BukaShiftModal = ({ open, onClose, onSuccess }) => {
  const [modalAwal, setModalAwal] = useState("500.000");
  const [waktuBuka, setWaktuBuka] = useState("");

  const currentUser = getUser();
  // Mengambil nama user yang sedang login secara dinamis
  const namaKasir = currentUser?.nama || currentUser?.name || currentUser?.username || "Apoteker Profile";

  // Memperbarui waktu setiap kali modal dibuka
  useEffect(() => {
    if (open) {
      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setWaktuBuka(`${dateStr} - ${timeStr}`);
    }
  }, [open]);

  // Fungsi auto format titik rupiah
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

  const handleInputChange = (e) => {
    setModalAwal(formatRupiah(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSuccess) {
      // Hilangkan titik untuk disimpan ke database sebagai integer
      const cleanModalAwal = Number(modalAwal.replace(/\./g, "")) || 0;
      
      onSuccess({
        modal_awal: cleanModalAwal,
        nama_kasir: namaKasir,
        waktu_buka: new Date().toISOString(),
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          bgcolor: colors.bgCard,
          borderRadius: `${radii.md}px`,
          p: 3.5,
          boxShadow: shadows.floating,
          outline: "none",
        }}
      >
        {/* HEADER MODAL */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: colors.surfacePink || "#FCE4EC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PlayArrowIcon sx={{ color: colors.primary, fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: typography.bold, color: colors.text, lineHeight: 1.2 }}
            >
              Buka Shift Baru
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: 13 }}>
              Mulai sesi kasir harian Anda.
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* INFORMASI KASIR & WAKTU BUKA */}
          <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: typography.bold,
                  color: colors.textSecondary,
                  letterSpacing: "0.5px",
                  mb: 0.8,
                }}
              >
                NAMA KASIR
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={namaKasir}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ fontSize: 18, color: colors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: colors.bgMuted,
                    borderRadius: `${radii.sm}px`,
                    fontSize: 13,
                    fontWeight: typography.semibold,
                    color: colors.text,
                    "& fieldset": { borderColor: "transparent" },
                  },
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: typography.bold,
                  color: colors.textSecondary,
                  letterSpacing: "0.5px",
                  mb: 0.8,
                }}
              >
                WAKTU BUKA
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={waktuBuka}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon sx={{ fontSize: 18, color: colors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: colors.bgMuted,
                    borderRadius: `${radii.sm}px`,
                    fontSize: 13,
                    fontWeight: typography.semibold,
                    color: colors.text,
                    "& fieldset": { borderColor: "transparent" },
                  },
                }}
              />
            </Box>
          </Box>

          {/* INPUT MODAL AWAL (CASH) */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{ fontWeight: typography.bold, color: colors.text, fontSize: 15, mb: 0.3 }}
            >
              Modal Awal (Cash)
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: colors.textSecondary, display: "block", mb: 1.5, lineHeight: 1.3 }}
            >
              Masukkan jumlah uang tunai fisik yang ada di laci kasir (Drawer) saat ini sebelum memulai transaksi.
            </Typography>

            <TextField
              fullWidth
              value={modalAwal}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      sx={{ fontWeight: typography.bold, color: colors.primary, fontSize: 18 }}
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
                  padding: "10px 14px",
                },
              }}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${radii.sm}px`,
                  borderColor: colors.primary,
                  bgcolor: colors.bgCard,
                  "& fieldset": { borderColor: colors.primary, borderWidth: "1.5px" },
                  "& .Mui-disabled": { WebkitTextFillColor: colors.text },
                  "&:hover fieldset": { borderColor: colors.primaryHover || colors.primary },
                  "&.Mui-focused fieldset": { borderColor: colors.primaryHover || colors.primary },
                },
              }}
            />

            {/* INFO SHIFT TERAKHIR */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <InfoOutlinedIcon sx={{ fontSize: 14, color: colors.blue || "#0284C7" }} />
              <Typography sx={{ fontSize: 11, color: colors.blue || "#0284C7", fontWeight: typography.semibold }}>
                Pastikan nominal modal laci fisik ini sesuai.
              </Typography>
            </Box>
          </Box>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<PowerSettingsNewIcon />}
            sx={{
              bgcolor: colors.primary,
              color: colors.textOnDark || "#FFFFFF",
              py: 1.5,
              borderRadius: `${radii.sm}px`,
              textTransform: "none",
              fontWeight: typography.bold,
              fontSize: 15,
              boxShadow: "none",
              "&:hover": {
                bgcolor: colors.primaryHover,
                boxShadow: "none",
              },
            }}
          >
            Mulai Shift Sekarang
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default BukaShiftModal;