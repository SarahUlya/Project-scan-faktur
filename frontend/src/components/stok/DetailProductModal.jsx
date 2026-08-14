import React from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Divider,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "../ui/Modal";
import { colors, radii, spacing, typography, shadows, transitions } from "@/theme/designTokens";

const getStatus = (expiredDate) => {
  if (!expiredDate) return { label: "Tidak Tersedia", color: colors.textMuted, bg: colors.bgMuted };
  const days = Math.ceil((new Date(expiredDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return { label: "Expired", color: colors.danger, bg: colors.dangerLight };
  if (days <= 30) return { label: "Hampir Expired", color: colors.warning, bg: colors.warningLight };
  return { label: "Aman", color: colors.success, bg: colors.successLight };
};

const DetailProductModal = ({ open, product, onClose }) => {
  if (!product) return null;

  const activeBatches = (product.batch || [])
    .filter((b) => Number(b.stok) > 0)
    .sort((a, b) => new Date(a.expired) - new Date(b.expired));

  const totalStok = activeBatches.reduce((sum, b) => sum + Number(b.stok), 0);
  const overallStatus = activeBatches.length > 0 ? "Tersedia" : "Kosong";

  return (
    <Modal open={open} onClose={onClose} width={720}>
      <Box sx={{ p: { xs: 2, sm: 3 }, position: "relative" }}>
        {/* Tombol Close */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 44,
            height: 44,
            borderRadius: "50%",
            color: colors.textMuted,
            transition: transitions.fast,
            "&:hover": {
              bgcolor: colors.dangerLight,
              color: colors.danger,
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 22 }} />
        </IconButton>

        {/* Header */}
        <Box sx={{ mb: 3, pr: 4 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: colors.text, mb: 0.5 }}>
            {product.nama_produk || "Produk"}
          </Typography>
          <Typography sx={{ fontSize: 14, color: colors.textSecondary }}>
            {product.nama_kategori || "Tanpa Kategori"} • Kode: {product.barcode || "-"}
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Paper
              sx={{
                p: 2,
                borderRadius: radii.xs,
                bgcolor: colors.textOnDark,
                textAlign: "center",
                border: `1px solid ${colors.borderLight}`,
              }}
            >
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase" }}>
                Total Batch
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: colors.text }}>
                {activeBatches.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              sx={{
                p: 2,
                borderRadius: radii.xs,
                bgcolor: colors.textOnDark,
                textAlign: "center",
                border: `1px solid ${colors.borderLight}`,
              }}
            >
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase" }}>
                Total Stok
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: colors.text }}>
                {totalStok} unit
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              sx={{
                p: 2,
                borderRadius: radii.xs,
                bgcolor: colors.textOnDark,
                textAlign: "center",
                border: `1px solid ${colors.borderLight}`,
              }}
            >
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase" }}>
                Status
              </Typography>
              <Chip
                label={overallStatus}
                size="medium"
                sx={{
                  mt: 0.5,
                  bgcolor: activeBatches.length > 0 ? colors.successLight : colors.dangerLight,
                  color: activeBatches.length > 0 ? colors.success : colors.danger,
                  fontWeight: 600,
                  fontSize: 13,
                  borderRadius: radii.xs,
                  px: 2,
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Daftar Batch */}
        <Typography sx={{ fontWeight: 600, fontSize: 16, color: colors.text, mb: 2 }}>
          Daftar Batch
        </Typography>

        {activeBatches.length === 0 ? (
          <Typography sx={{ color: colors.textMuted, textAlign: "center", py: 4 }}>
            Tidak ada batch dengan stok tersedia.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {activeBatches.map((batch, idx) => {
              const status = getStatus(batch.expired_date);
              return (
                <Paper
                  key={batch.id || idx}
                  sx={{
                    p: 2.5,
                    borderRadius: radii.xs,
                    border: `1px solid ${colors.borderLight}`,
                    boxShadow: shadows.card,
                    transition: transitions.fast,
                    "&:hover": {
                      borderColor: colors.primary,
                      boxShadow: shadows.hover,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: colors.text }}>
                        Batch: {batch.no_batch || "-"}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
                        Faktur: {batch.no_faktur || "-"}
                      </Typography>
                    </Box>
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        bgcolor: status.bg || colors.bgMuted,
                        color: status.color,
                        fontWeight: 600,
                        borderRadius: radii.xs,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 4,
                      mt: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: 11, color: colors.textMuted, textTransform: "uppercase" }}>
                        Expired
                      </Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                        {batch.expired
                          ? new Date(batch.expired).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, color: colors.textMuted, textTransform: "uppercase" }}>
                        Stok
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                        {batch.stok || 0} unit
                      </Typography>
                    </Box>
                  </Box>

                  {/* Riwayat Pergerakan */}
                  {batch.history && batch.history.length > 0 && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${colors.borderLight}` }}>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: colors.textMuted,
                          textTransform: "uppercase",
                          mb: 1,
                        }}
                      >
                        Riwayat Pergerakan
                      </Typography>
                      <Box sx={{ maxHeight: 120, overflowY: "auto" }}>
                        {batch.history.map((log, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 12,
                              py: 0.5,
                              borderBottom:
                                i < batch.history.length - 1 ? `1px solid ${colors.borderLight}` : "none",
                            }}
                          >
                            <span>
                              {new Date(log.tanggal).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                              })}
                              {" • "}
                              {log.aktivitas}
                              {log.referensi && ` (${log.referensi})`}
                            </span>
                            <span style={{ fontWeight: 600 }}>
                              {log.masuk ? `+${log.masuk}` : log.keluar ? `-${log.keluar}` : "0"} → {log.saldoAkhir}
                            </span>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>
        )}

        {/* Informasi tambahan */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: radii.xs,
            bgcolor: colors.bgMuted,
            border: `1px solid ${colors.borderLight}`,
          }}
        >
          <Typography sx={{ fontSize: 12, color: colors.textSecondary, textAlign: "center" }}>
            Stok di atas adalah total stok yang tersedia untuk semua batch produk ini.
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default DetailProductModal;