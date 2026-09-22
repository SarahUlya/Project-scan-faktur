import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  colors,
  radii,
  typography,
  shadows,
  transitions,
} from "@/theme/designTokens";

// ══════════════════════════════════════════════════════════════════
// HELPER — aman render apapun jadi string
// ══════════════════════════════════════════════════════════════════
const safeString = (val) => {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    return (
      val.nama || val.name || val.kode || val.label || val.teks || String(val.id || "")
    );
  }
  return String(val);
};

const getSatuanLabel = (p) => {
  if (!p) return "";
  const s = p.satuan ?? p.unit ?? p.satuan_nama;
  if (typeof s === "string") return s;
  if (typeof s === "object" && s !== null) {
    return s.nama || s.kode || s.label || "";
  }
  return "";
};

const formatRupiah = (val) => {
  const n = Number(val) || 0;
  return n.toLocaleString("id-ID");
};

const VarianPickerModal = ({
  open,
  onClose,
  produkList = [],
  produkName,
  onSelect,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: `${radii.lg}px`,
          boxShadow: shadows.floating,
          overflow: "hidden",
        },
      }}
    >
      {/* ═══ HEADER ═══ */}
      <DialogTitle
        sx={{
          p: 2.5,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `1px solid ${colors.borderLight}`,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: typography.bold,
              fontSize: typography.h5,
              color: colors.text,
              lineHeight: 1.2,
            }}
          >
            Pilih Varian
          </Typography>
          <Typography
            sx={{
              fontSize: typography.caption,
              color: colors.textMuted,
              mt: 0.5,
            }}
          >
            {produkList.length} pilihan untuk{" "}
            <Box
              component="span"
              sx={{
                color: colors.primary,
                fontWeight: typography.bold,
              }}
            >
              {safeString(produkName)}
            </Box>
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: colors.textMuted,
            borderRadius: `${radii.sm}px`,
            transition: transitions.fast,
            "&:hover": {
              bgcolor: colors.bgMuted,
              color: colors.text,
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ═══ CONTENT ═══ */}
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {produkList.map((p, idx) => {
            const stok = Number(p.stok) || 0;
            const harga = Number(p.harga || p.harga_jual || 0);
            const satuan = getSatuanLabel(p);
            const kodeStr = safeString(p.kode);
            const isOutOfStock = stok <= 0;

            const varianLabel =
              safeString(p.varian) ||
              safeString(p.kemasan) ||
              safeString(p.tipe) ||
              safeString(p.nama_varian) ||
              safeString(p.ukuran) ||
              `Varian ${idx + 1}`;

            return (
              <Box
                key={p.id_produk || p.id || idx}
                onClick={() => !isOutOfStock && onSelect(p)}
                sx={{
                  p: 2,
                  borderRadius: `${radii.md}px`,
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.bgCard,
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  opacity: isOutOfStock ? 0.55 : 1,
                  transition: transitions.fast,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  "&:hover": !isOutOfStock
                    ? {
                        borderColor: colors.primary,
                        bgcolor: colors.surfacePink,
                        boxShadow: shadows.hover,
                        transform: "translateY(-1px)",
                      }
                    : {},
                }}
              >
                {/* KIRI: Nama varian + kode */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: typography.bold,
                      fontSize: typography.body,
                      color: colors.text,
                      mb: 0.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {varianLabel}
                  </Typography>
                  {kodeStr && (
                    <Typography
                      sx={{
                        fontSize: typography.tiny,
                        color: colors.textMuted,
                        fontWeight: typography.medium,
                        letterSpacing: "0.3px",
                      }}
                    >
                      {kodeStr}
                    </Typography>
                  )}
                </Box>

                {/* KANAN: Harga + stok */}
                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: typography.bold,
                      fontSize: typography.body,
                      color: colors.primary,
                    }}
                  >
                    Rp {formatRupiah(harga)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: typography.tiny,
                      fontWeight: typography.semibold,
                      color: isOutOfStock ? colors.danger : colors.success,
                      mt: 0.3,
                    }}
                  >
                    {isOutOfStock
                      ? "Habis"
                      : `Stok ${stok}${satuan ? ` ${satuan}` : ""}`}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VarianPickerModal;