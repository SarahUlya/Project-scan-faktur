import React from "react";
import { Box, Typography, Chip, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { colors, radii, transitions } from "@/theme/designTokens";

const getEarliestExpired = (batches) => {
  const valid = (batches || []).filter((b) => Number(b.qty_sisa) > 0);
  if (!valid.length) return null;
  const sorted = [...valid].sort((a, b) => new Date(a.expired_date) - new Date(b.expired_date));
  return sorted[0];
};

const getStatusBadge = (expiredDate) => {
  if (!expiredDate) return { label: "Tidak Tersedia", color: colors.textMuted, bg: colors.bgMuted };
  const days = Math.ceil((new Date(expiredDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return { label: "Expired", color: colors.danger, bg: colors.dangerLight };
  if (days <= 30) return { label: "Hampir Expired", color: colors.warning, bg: colors.warningLight };
  return { label: "Aman", color: colors.success, bg: colors.successLight };
};

const ProductStokTable = ({ products, onDetailClick }) => {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
        <thead>
          <tr
            style={{
              borderBottom: `1px solid ${colors.border}`,
              background: colors.bgMuted,
            }}
          >
            <th
              style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 600,
                fontSize: 12,
                color: colors.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Produk
            </th>
            <th
              style={{
                padding: "14px 16px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 12,
                color: colors.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Total Batch
            </th>
            <th
              style={{
                padding: "14px 16px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 12,
                color: colors.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Total Stok
            </th>
            <th
              style={{
                padding: "14px 16px",
                textAlign: "left",
                fontWeight: 600,
                fontSize: 12,
                color: colors.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Expired Terdekat
            </th>
            <th
              style={{
                padding: "14px 16px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 12,
                color: colors.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "14px 16px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 12,
                color: colors.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Detail
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const activeBatches = (product.batch || []).filter((b) => Number(b.stok) > 0);
            const totalStok = activeBatches.reduce((sum, b) => sum + Number(b.stok), 0);
            const earliest = getEarliestExpired(product.batch);
            const status = getStatusBadge(earliest?.expired_date);

            return (
              <tr
                key={product.id_produk}
                style={{
                  borderBottom: `1px solid ${colors.borderLight}`,
                  transition: transitions.fast,
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colors.bgMuted)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "14px 16px" }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: colors.text }}>
                    {product.nama_produk || "-"}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                    {product.kategori?.nama_kategori || "Tanpa Kategori"} • Kode: {product.barcode || "-"}
                  </Typography>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "center", fontSize: 14, fontWeight: 600, color: colors.text }}>
                  {activeBatches.length}
                </td>
                <td style={{ padding: "14px 16px", textAlign: "center", fontSize: 14, fontWeight: 600, color: colors.text }}>
                  {totalStok}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {earliest ? (
                    <>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.text }}>
                        {new Date(earliest.expired_date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                        Batch: {earliest.no_batch || "-"}
                      </Typography>
                    </>
                  ) : (
                    <Typography sx={{ fontSize: 13, color: colors.textMuted }}>—</Typography>
                  )}
                </td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}>
                  <Chip
                    label={status.label}
                    size="small"
                    sx={{
                      bgcolor: status.bg,
                      color: status.color,
                      fontWeight: 600,
                      fontSize: 11,
                      borderRadius: radii.xs,
                      px: 1,
                    }}
                  />
                </td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}>
                  <IconButton
                    size="small"
                    onClick={() => onDetailClick(product)}
                    sx={{
                      color: colors.textSecondary,
                      border: `1px solid ${colors.borderLight}`,
                      borderRadius: radii.xs,
                      transition: transitions.fast,
                      "&:hover": {
                        borderColor: colors.primary,
                        color: colors.primary,
                        bgcolor: colors.primaryLight,
                      },
                    }}
                  >
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};

export default ProductStokTable;