import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { colors, radii, typography, shadows } from "@/theme/designTokens";

const ShiftTerkunciModal = ({ open, onBukaShiftBaru }) => {
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 440,
          bgcolor: colors.bgCard,
          borderRadius: `${radii.sm}px`,
          boxShadow: shadows.floating,
          outline: "none",
          p: 3.5,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ICON LOCK UTAMA */}
        <Box
          sx={{
            bgcolor: colors.surfacePink,
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            border: `2px solid ${colors.primaryLight}`,
          }}
        >
          <LockIcon sx={{ color: colors.primary, fontSize: 32 }} />
        </Box>

        <Typography
          sx={{
            fontWeight: typography.bold,
            fontSize: typography.h3,
            color: colors.text,
            mb: 0.5,
          }}
        >
          Sistem Terkunci
        </Typography>
        
        <Typography
          sx={{
            fontWeight: typography.semibold,
            fontSize: typography.body,
            color: colors.danger,
            mb: 2.5,
          }}
        >
          Shift Selesai
        </Typography>

        {/* INFO KASIR & STATS CARD */}
        <Box
          sx={{
            width: "100%",
            border: `1px solid ${colors.border}`,
            borderRadius: `${radii.sm}px`,
            bgcolor: colors.bgMuted,
            p: 1.5,
            mb: 2.5,
            textAlign: "left",
          }}
        >
          {/* Kasir Bertugas */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: colors.bgCard,
              p: 1.5,
              borderRadius: `${radii.s}px`,
              border: `1px solid ${colors.border}`,
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=faces"
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography sx={{ fontSize: typography.tiny, color: colors.textSecondary }}>
                  Kasir Bertugas
                </Typography>
                <Typography sx={{ fontSize: typography.body, fontWeight: typography.bold, color: colors.text }}>
                  Apoteker Profile
                </Typography>
              </Box>
            </Box>
            <CheckCircleIcon sx={{ color: colors.success, fontSize: 20 }} />
          </Box>

          {/* Row Dua Kotak Kecil (Waktu & Omzet) */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Box
              sx={{
                flex: 1,
                bgcolor: colors.bgCard,
                p: 1.5,
                borderRadius: `${radii.s}px`,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 14, color: colors.textSecondary }} />
                <Typography sx={{ fontSize: typography.tiny, color: colors.textSecondary }}>
                  Waktu Tutup
                </Typography>
              </Box>
              <Typography sx={{ fontSize: typography.body, fontWeight: typography.bold, color: colors.text }}>
                14:30 WIB
              </Typography>
              <Typography sx={{ fontSize: typography.tiny, color: colors.textMuted }}>
                24 Okt 2023
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                bgcolor: colors.surfacePink,
                p: 1.5,
                borderRadius: `${radii.s}px`,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <ReceiptLongIcon sx={{ fontSize: 14, color: colors.primary }} />
                <Typography sx={{ fontSize: typography.tiny, color: colors.primary, fontWeight: typography.semibold }}>
                  Total Omzet
                </Typography>
              </Box>
              <Typography sx={{ fontSize: typography.body, fontWeight: typography.bold, color: colors.primary }}>
                Rp 4.520.000
              </Typography>
              <Typography sx={{ fontSize: typography.tiny, color: colors.textSecondary }}>
                + 24 Transaksi
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* BUTTONS */}
        <Button
          fullWidth
          variant="contained"
          onClick={onBukaShiftBaru}
          startIcon={<PlayArrowIcon />}
          sx={{
            bgcolor: colors.primary,
            color: colors.textOnDark,
            py: 1.2,
            borderRadius: `${radii.sm}px`,
            textTransform: "none",
            fontWeight: typography.bold,
            fontSize: typography.body,
            boxShadow: "none",
            mb: 1.5,
            "&:hover": { bgcolor: colors.primaryHover, boxShadow: "none" },
          }}
        >
          Buka Shift Baru
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<SwapHorizIcon />}
          sx={{
            borderColor: colors.border,
            color: colors.text,
            py: 1.2,
            borderRadius: `${radii.sm}px`,
            textTransform: "none",
            fontWeight: typography.semibold,
            fontSize: typography.body,
            bgcolor: colors.bgCard,
            "&:hover": { bgcolor: colors.bgMuted, borderColor: colors.borderHover },
          }}
        >
          Ganti Akun / Logout
        </Button>
      </Box>
    </Modal>
  );
};

export default ShiftTerkunciModal;