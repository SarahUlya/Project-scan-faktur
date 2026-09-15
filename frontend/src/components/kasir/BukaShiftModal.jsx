import React, { useState, useEffect } from "react";
import {
  Modal, Box, Typography, TextField, Button,
  InputAdornment, CircularProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import { getUser } from "@/auth/auth";
import { bukaShiftApi } from "@/api/transaksiApi";
import { colors, radii, typography, shadows } from "@/theme/designTokens";

const BukaShiftModal = ({ open, onClose, onSuccess }) => {
  const [modalAwal, setModalAwal] = useState("500.000");
  const [waktuBuka, setWaktuBuka] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentUser = getUser();
  const namaKasir =
    currentUser?.nama || currentUser?.name || currentUser?.username || "Kasir";

  useEffect(() => {
    if (open) {
      setError("");
      setSubmitting(false);
      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("id-ID", {
        hour: "2-digit", minute: "2-digit",
      });
      setWaktuBuka(`${dateStr} - ${timeStr}`);
    }
  }, [open]);

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
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanModalAwal = Number(modalAwal.replace(/\./g, "")) || 0;
    if (cleanModalAwal <= 0) {
      setError("Modal awal harus lebih dari 0");
      return;
    }

    setSubmitting(true);
    try {
      console.log("[BukaShift] POST /shift/buka", { modal_awal: cleanModalAwal });

      const res = await bukaShiftApi({ modal_awal: cleanModalAwal });
      console.log("[BukaShift] response:", res);

      const shiftData = res?.data;
      if (!shiftData || !shiftData.id_shift) {
        throw new Error("Response backend tidak berisi id_shift");
      }

      if (onSuccess) onSuccess(shiftData);
    } catch (err) {
      console.error("[BukaShift] error:", err);
      console.error("[BukaShift] response:", err?.response?.data);
      setError(
        err?.response?.data?.message || err?.message || "Gagal membuka shift"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={submitting ? undefined : onClose}>
      <Box
        sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480, bgcolor: colors.bgCard,
          borderRadius: `${radii.md}px`, p: 3.5,
          boxShadow: shadows.floating, outline: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 44, height: 44, borderRadius: "50%",
              bgcolor: colors.surfacePink || "#FCE4EC",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <PlayArrowIcon sx={{ color: colors.primary, fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: typography.bold, color: colors.text }}>
              Buka Shift Baru
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              Mulai sesi kasir harian Anda.
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: typography.bold, color: colors.textSecondary, mb: 0.8 }}>
                NAMA KASIR
              </Typography>
              <TextField
                fullWidth size="small" value={namaKasir} disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ fontSize: 18, color: colors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { bgcolor: colors.bgMuted, borderRadius: `${radii.sm}px`, "& fieldset": { borderColor: "transparent" } } }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: typography.bold, color: colors.textSecondary, mb: 0.8 }}>
                WAKTU BUKA
              </Typography>
              <TextField
                fullWidth size="small" value={waktuBuka} disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon sx={{ fontSize: 18, color: colors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { bgcolor: colors.bgMuted, borderRadius: `${radii.sm}px`, "& fieldset": { borderColor: "transparent" } } }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: typography.bold, color: colors.text, fontSize: 15, mb: 0.3 }}>
              Modal Awal (Cash)
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary, display: "block", mb: 1.5 }}>
              Masukkan jumlah uang tunai fisik di laci kasir saat ini.
            </Typography>
            <TextField
              fullWidth value={modalAwal} onChange={handleInputChange} disabled={submitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontWeight: typography.bold, color: colors.primary, fontSize: 18 }}>Rp</Typography>
                  </InputAdornment>
                ),
              }}
              inputProps={{ style: { textAlign: "right", fontWeight: typography.bold, fontSize: "22px", padding: "10px 14px" } }}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${radii.sm}px`,
                  "& fieldset": { borderColor: colors.primary, borderWidth: "1.5px" },
                },
              }}
            />
            {error && (
              <Box sx={{ mt: 1, p: 1.2, bgcolor: "#FEE2E2", border: "1px solid #DC2626", borderRadius: `${radii.sm}px` }}>
                <Typography sx={{ fontSize: 12, color: "#DC2626", fontWeight: typography.semibold }}>{error}</Typography>
              </Box>
            )}
            {!error && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <InfoOutlinedIcon sx={{ fontSize: 14, color: colors.blue || "#0284C7" }} />
                <Typography sx={{ fontSize: 11, color: colors.blue || "#0284C7", fontWeight: typography.semibold }}>
                  Pastikan nominal modal laci fisik ini sesuai.
                </Typography>
              </Box>
            )}
          </Box>

          <Button
            type="submit" fullWidth variant="contained" disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} sx={{ color: "#FFF" }} /> : <PowerSettingsNewIcon />}
            sx={{
              bgcolor: colors.primary, color: "#FFF", py: 1.5,
              borderRadius: `${radii.sm}px`, textTransform: "none",
              fontWeight: typography.bold, fontSize: 15, boxShadow: "none",
              "&:hover": { bgcolor: colors.primaryHover, boxShadow: "none" },
              "&.Mui-disabled": { bgcolor: colors.primary, opacity: 0.7, color: "#FFF" },
            }}
          >
            {submitting ? "Membuka Shift..." : "Mulai Shift Sekarang"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default BukaShiftModal;