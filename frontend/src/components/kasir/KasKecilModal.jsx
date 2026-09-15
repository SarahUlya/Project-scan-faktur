import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Radio,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

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

const KasKecilModal = ({ open, onClose, onSave }) => {
  const currentUser = getUser();

  const [type, setType] = useState("keluar");
  const [amountInput, setAmountInput] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  // Reset form tiap kali modal dibuka
  useEffect(() => {
    if (open) {
      setType("keluar");
      setAmountInput("");
      setNote("");
      setLocalError("");
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const numericAmount = Number(String(amountInput).replace(/\./g, "")) || 0;

    if (numericAmount <= 0) {
      setLocalError("Jumlah harus lebih dari 0");
      return;
    }
    if (!note.trim()) {
      setLocalError("Keterangan wajib diisi");
      return;
    }

    const payload = {
      id_user: currentUser?.id ?? null,
      nama_kasir:
        currentUser?.name || currentUser?.username || "Administrator",
      tipe: type, // "keluar" | "masuk"
      jenis: type === "keluar" ? "KELUAR" : "MASUK",
      nominal: numericAmount,
      jumlah: numericAmount,
      keterangan: note.trim(),
      waktu_transaksi: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const ok = await onSave(payload);
      // Parent akan return true kalau sukses, false kalau gagal.
      // Kalau parent gak return apa-apa (undefined), anggap sukses biar
      // gak blocking (backward compatible).
      if (ok !== false) {
        setAmountInput("");
        setNote("");
        onClose();
      }
    } catch (err) {
      console.error("[KasKecilModal] onSave throw:", err);
      setLocalError(err?.message || "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={submitting ? undefined : onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
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
              <WalletIcon sx={{ color: colors.primary, fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: typography.bold,
                  fontSize: typography.h5,
                  color: colors.text,
                }}
              >
                Catat Kas Kecil
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.caption,
                  color: colors.textSecondary,
                  mt: 0.5,
                }}
              >
                Petugas:{" "}
                <strong>
                  {currentUser?.name || currentUser?.username || "Administrator"}
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

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}
        >
          <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
            <Typography
              sx={{
                fontSize: typography.body,
                fontWeight: typography.bold,
                color: colors.text,
                mb: 1,
              }}
            >
              Tipe Transaksi
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
              {[
                {
                  value: "keluar",
                  label: "Kas Keluar",
                  desc: "Pengeluaran operasional",
                  icon: (
                    <ArrowDownwardIcon
                      sx={{ color: colors.danger, fontSize: 18 }}
                    />
                  ),
                },
                {
                  value: "masuk",
                  label: "Kas Masuk",
                  desc: "Tambahan dana laci",
                  icon: (
                    <ArrowUpwardIcon
                      sx={{ color: colors.success, fontSize: 18 }}
                    />
                  ),
                },
              ].map((opt) => {
                const isSelected = type === opt.value;
                return (
                  <Box
                    key={opt.value}
                    onClick={() => !submitting && setType(opt.value)}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      borderRadius: `${radii.sm}px`,
                      border: `1.5px solid ${
                        isSelected ? colors.primary : colors.border
                      }`,
                      bgcolor: isSelected ? colors.surfacePink : colors.bgCard,
                      cursor: submitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: colors.primary },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <Radio
                        checked={isSelected}
                        onChange={() => setType(opt.value)}
                        size="small"
                        sx={{
                          color: colors.primary,
                          p: 0,
                          "&.Mui-checked": { color: colors.primary },
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: typography.body,
                            fontWeight: typography.bold,
                            color: colors.text,
                          }}
                        >
                          {opt.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: typography.tiny,
                            color: colors.textSecondary,
                          }}
                        >
                          {opt.desc}
                        </Typography>
                      </Box>
                    </Box>
                    {opt.icon}
                  </Box>
                );
              })}
            </Box>

            <Typography
              sx={{
                fontSize: typography.body,
                fontWeight: typography.bold,
                color: colors.text,
                mb: 1,
              }}
            >
              Jumlah (Rp)
            </Typography>
            <TextField
              fullWidth
              value={amountInput}
              onChange={(e) => setAmountInput(formatRupiah(e.target.value))}
              placeholder="0"
              disabled={submitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      sx={{
                        fontWeight: typography.bold,
                        color: colors.textSecondary,
                        fontSize: typography.bodyLg,
                      }}
                    >
                      Rp
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${radii.sm}px`,
                  bgcolor: colors.bgCard,
                  fontSize: typography.bodyLg,
                  fontWeight: typography.semibold,
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: colors.primary },
                  "&.Mui-focused fieldset": { borderColor: colors.primary },
                },
              }}
            />

            <Typography
              sx={{
                fontSize: typography.body,
                fontWeight: typography.bold,
                color: colors.text,
                mb: 1,
              }}
            >
              Keterangan
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Misal: Beli galon air, parkir, dll..."
              disabled={submitting}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${radii.sm}px`,
                  bgcolor: colors.bgCard,
                  fontSize: typography.body,
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: colors.primary },
                  "&.Mui-focused fieldset": { borderColor: colors.primary },
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: colors.bgMuted,
                p: 1.5,
                borderRadius: `${radii.sm}px`,
                border: `1px solid ${colors.border}`,
                mb: 1,
              }}
            >
              <Typography
                sx={{ fontSize: typography.caption, color: colors.textSecondary }}
              >
                Waktu Transaksi
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 14, color: colors.textSecondary }}
                />
                <Typography
                  sx={{
                    fontSize: typography.caption,
                    fontWeight: typography.semibold,
                    color: colors.text,
                  }}
                >
                  Hari ini,{" "}
                  {new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WIB
                </Typography>
              </Box>
            </Box>

            {localError && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: typography.caption,
                  color: colors.danger,
                  fontWeight: typography.semibold,
                }}
              >
                {localError}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              p: 2.5,
              mt: "auto",
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
              Batal
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              startIcon={<WalletIcon />}
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
              {submitting ? "Menyimpan..." : "Simpan Catatan"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default KasKecilModal;