import React, {
  useMemo,
  forwardRef,
  useEffect,
} from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Table from "../ui/Table";
import useLaporanProdukTerlaris from "../../hooks/useLaporanProdukTerlaris";
import { colors, radii, typography, spacing } from "@/theme/designTokens";

/* ══════════════════════════════════════════════════════════════════
 * HELPER — Format Rupiah
 * ══════════════════════════════════════════════════════════════════ */
const formatRupiah = (val) => {
  const n = Number(val) || 0;
  return `Rp ${n.toLocaleString("id-ID")}`;
};

/* ══════════════════════════════════════════════════════════════════
 * HELPER — Style per peringkat
 * ══════════════════════════════════════════════════════════════════ */
const getRankStyle = (index) => {
  if (index === 0) return { bg: "#FEF3C7", color: "#92400E", label: "🥇" };
  if (index === 1) return { bg: "#E5E7EB", color: "#475569", label: "🥈" };
  if (index === 2) return { bg: "#FED7AA", color: "#9A3412", label: "🥉" };
  return { bg: colors.bgMuted, color: colors.textSecondary, label: null };
};

/* ══════════════════════════════════════════════════════════════════
 * HELPER — Normalize produk
 * ══════════════════════════════════════════════════════════════════ */
const normalizeProduk = (raw, idx) => {
  const nama =
    raw.nama_produk ||
    raw.nama ||
    raw.nama_barang ||
    raw.produk?.nama_produk ||
    raw.produk?.nama ||
    `Produk ${idx + 1}`;

  const satuan =
    raw.satuan?.kode ||
    raw.satuan?.nama ||
    raw.satuan ||
    raw.unit ||
    raw.produk?.satuan?.kode ||
    "";

  const totalTerjual = Number(
    raw.total_terjual ??
      raw.qty_terjual ??
      raw.jumlah_terjual ??
      raw.total_qty ??
      raw.qty ??
      0
  );

  const totalOmzet = Number(
    raw.total_omzet ??
      raw.omzet ??
      raw.total_penjualan ??
      raw.revenue ??
      0
  );

  return {
    id: raw.id_produk || raw.id || raw.produk_id || idx,
    id_produk: raw.id_produk || raw.id || raw.produk_id || idx,
    nama_produk: nama,
    satuan,
    kode: raw.kode || raw.produk?.kode || "",
    total_terjual: totalTerjual,
    total_omzet: totalOmzet,
  };
};

/* ══════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ══════════════════════════════════════════════════════════════════ */
const LaporanProdukTerlaris = forwardRef(
  ({ startDate = "", endDate = "", onSummaryChange }, ref) => {
    const { data: rawData, loading, error } = useLaporanProdukTerlaris({
      startDate,
      endDate,
      limit: 100,
    });

    // Normalize data
    const data = useMemo(() => {
      return (rawData || []).map((item, idx) => normalizeProduk(item, idx));
    }, [rawData]);

    // Summary untuk parent
    const totalTerjual = useMemo(
      () => data.reduce((acc, item) => acc + item.total_terjual, 0),
      [data]
    );

    const totalOmzet = useMemo(
      () => data.reduce((acc, item) => acc + item.total_omzet, 0),
      [data]
    );

    useEffect(() => {
      onSummaryChange?.({
        totalProduk: data.length,
        totalTerjual,
        totalOmzet,
      });
    }, [data.length, totalTerjual, totalOmzet, onSummaryChange]);

    /* ── Columns ─────────────────────────────────────────────────── */
    const columns = [
      {
        header: "PERINGKAT",
        accessor: "rank",
        align: "center",
        width: 90,
        render: (row) => {
          const globalIndex = data.findIndex(
            (d) => String(d.id) === String(row.id)
          );
          const style = getRankStyle(globalIndex);

          return (
            <span
              style={{
                background: style.bg,
                color: style.color,
                padding: "4px 10px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 36,
                height: 28,
              }}
            >
              {style.label || `#${globalIndex + 1}`}
            </span>
          );
        },
      },
      {
        header: "NAMA PRODUK",
        accessor: "nama_produk",
        render: (row) => (
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              {row.nama_produk}
            </Typography>
            {(row.satuan || row.kode) && (
              <Typography sx={{ color: colors.textSecondary, fontSize: 12 }}>
                {row.satuan || row.kode}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        header: "TERJUAL",
        accessor: "total_terjual",
        align: "center",
        render: (row) => (
          <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
            {row.total_terjual.toLocaleString("id-ID")}{" "}
            <span style={{ color: colors.textSecondary, fontSize: 11 }}>pcs</span>
          </Typography>
        ),
      },
      {
        header: "OMZET PRODUK",
        accessor: "total_omzet",
        align: "right",
        render: (row) => (
          <Typography
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 13,
              color: colors.success,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatRupiah(row.total_omzet)}
          </Typography>
        ),
      },
      {
        header: "KONTRIBUSI",
        accessor: "kontribusi",
        align: "center",
        render: (row) => {
          const persen =
            totalOmzet > 0 ? (row.total_omzet / totalOmzet) * 100 : 0;

          return (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                minWidth: 100,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: 6,
                  bgcolor: colors.bgMuted,
                  borderRadius: 3,
                  overflow: "hidden",
                  minWidth: 60,
                }}
              >
                <Box
                  sx={{
                    width: `${Math.min(persen, 100)}%`,
                    height: "100%",
                    bgcolor: colors.primary,
                    borderRadius: 3,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: colors.textSecondary,
                  minWidth: 36,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {persen.toFixed(1)}%
              </Typography>
            </Box>
          );
        },
      },
    ];

    /* ── Render ──────────────────────────────────────────────────── */
    return (
      <Box>
        {/* ═══ HEADER INFO ═══ */}
        <Box
          sx={{
            px: "20px",
            py: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottom: `1px solid ${colors.borderLight}`,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: `${radii.sm}px`,
                bgcolor: colors.primaryLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.primary,
                flexShrink: 0,
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                Top Produk Terlaris
              </Typography>
              <Typography sx={{ fontSize: 12, color: colors.textSecondary, mt: 0.25 }}>
                {startDate && endDate
                  ? `Periode ${startDate} — ${endDate}`
                  : "Semua periode"}
              </Typography>
            </Box>
          </Box>

          {!loading && data.length > 0 && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "stretch", flexWrap: "wrap" }}>
              {/* Pill 1: Total Terjual */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  bgcolor: colors.bgMuted,
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: `${radii.md}px`,
                  px: 2,
                  py: 1,
                  minWidth: 110,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    lineHeight: 1.2,
                    mb: 0.25,
                  }}
                >
                  Total Terjual
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: colors.primary,
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {totalTerjual.toLocaleString("id-ID")}
                  </Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 600, color: colors.textSecondary, lineHeight: 1 }}>
                    pcs
                  </Typography>
                </Box>
              </Box>

              {/* Pill 2: Total Omzet */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  bgcolor: colors.successLight,
                  border: `1px solid ${colors.success}20`,
                  borderRadius: `${radii.md}px`,
                  px: 2,
                  py: 1,
                  minWidth: 150,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: colors.success,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    lineHeight: 1.2,
                    mb: 0.25,
                    opacity: 0.85,
                  }}
                >
                  Total Omzet
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: colors.success,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatRupiah(totalOmzet)}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* ═══ LOADING ═══ */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 1.5,
            }}
          >
            <CircularProgress size={28} sx={{ color: colors.primary }} />
            <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
              Memuat laporan produk terlaris...
            </Typography>
          </Box>
        )}

        {/* ═══ ERROR ═══ */}
        {!loading && error && (
          <Box
            sx={{
              m: 2.5,
              p: 2,
              bgcolor: colors.dangerLight,
              border: `1px solid ${colors.danger}`,
              borderRadius: `${radii.md}px`,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: 14, color: colors.danger, fontWeight: 600 }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* ═══ EMPTY ═══ */}
        {!loading && !error && data.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 1,
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 48, color: colors.textMuted, mb: 1 }} />
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: colors.text }}>
              Belum ada data produk terlaris
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: colors.textSecondary,
                maxWidth: 320,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Data akan muncul setelah ada transaksi penjualan pada periode
              yang dipilih.
            </Typography>
          </Box>
        )}

        {/* ═══ TABEL + FOOTER (tanpa pagination) ═══ */}
        {!loading && !error && data.length > 0 && (
          <>
            <Table columns={columns} data={data} />

            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid " + colors.border,
                color: colors.textSecondary,
                fontSize: 14,
              }}
            >
              Menampilkan {data.length} produk
            </div>
          </>
        )}
      </Box>
    );
  }
);

LaporanProdukTerlaris.displayName = "LaporanProdukTerlaris";

export default LaporanProdukTerlaris;