import React from "react";
import { Box, Typography, Chip, Divider, Grid } from "@mui/material";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
} from "@/theme/designTokens";


const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
};

const ProdukDetailModal = ({ product, getNamaKategori, onClose }) => {
  if (!product) return null;

  const batchCount = product.batch?.length || 0;
  const stockAvailable = (product.batch || []).reduce((sum, batch) => sum + (batch.stok || 0), 0);
  const lastExpired = product.batch?.slice().sort((a, b) => new Date(a.expired) - new Date(b.expired))[0];

  return (
    <Box sx={{ width: { xs: "100%", md: 760 }, p: 0 }}>
      <Box sx={{ p: 3, pb: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text }}>
            Detail Produk
          </Typography>
          <Typography sx={{ color: colors.textSecondary, mt: 1 }}>
            Menampilkan ringkasan produk, informasi batch, dan status stok.
          </Typography>
        </Box>
        <button
          type="button"
          onClick={onClose}
          style={{ background: "none", border: "none", color: colors.textSecondary, cursor: "pointer", fontSize: 24 }}
          aria-label="Tutup detail produk"
        >
          ×
        </button>
      </Box>

      <Divider />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.8, mb: 1 }}>
              Informasi Produk
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 20, color: colors.text }}>{product.nama || product.nama_produk}</Typography>
            <Typography sx={{ color: colors.textSecondary, mt: 0.5 }}>{product.id || product.kodeItem}</Typography>
            <Chip
              label={product.is_active === true ? "Aktif" : "Non-Aktif"}
              color={product.is_active === true ? "success" : "default"}
              sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.8, mb: 1 }}>
              Statistika Stok
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ p: 2, bgcolor: colors.bgMuted, borderRadius: 3, minWidth: 150 }}>
                <Typography variant="caption" sx={{ color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Total Batch
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 22 }}>{batchCount}</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: colors.bgMuted, borderRadius: 3, minWidth: 150 }}>
                <Typography variant="caption" sx={{ color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Stok Tersedia
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 22 }}>{stockAvailable} Unit</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.8, mb: 1 }}>
              Data Tambahan
            </Typography>
            <Typography sx={{ fontWeight: 700, color: colors.text }}>{getNamaKategori(product.id_kategori || product.kategoriId)}</Typography>
            <Typography sx={{ fontWeight: 700, color: colors.text }}>Satuan Dasar</Typography>
            <Typography sx={{ color: colors.textSecondary, mb: 2 }}>{product.satuan_id || "-"}</Typography>
            <Typography sx={{ fontWeight: 700, color: colors.text }}>Harga Jual</Typography>
            <Typography sx={{ color: colors.textSecondary, mb: 2 }}>{formatCurrency(product.harga_jual || product.hargaJual || 0)}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.8, mb: 1 }}>
              Info Batch Terdekat
            </Typography>
            {lastExpired ? (
              <Box sx={{ p: 2, bgcolor: colors.bgMuted, borderRadius: 3 }}>
                <Typography sx={{ fontWeight: 600, color: colors.text }}>{lastExpired.kodeBatch}</Typography>
                <Typography sx={{ color: colors.textSecondary, mt: 0.5 }}>{new Date(lastExpired.expired).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</Typography>
                <Typography sx={{ color: colors.text, mt: 1, fontWeight: 600 }}>{lastExpired.stok} Unit</Typography>
              </Box>
            ) : (
              <Typography sx={{ color: colors.textSecondary }}>Tidak ada batch tersedia.</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProdukDetailModal;
