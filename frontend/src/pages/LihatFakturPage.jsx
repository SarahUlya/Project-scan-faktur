import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FakturPrintView from "../components/pembelian/FakturPrintView";
import usePembelianDb from "../hooks/usePembelianDb";
import "../styles/faktur-print.css";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
} from "@/theme/designTokens";

const LihatFakturPage = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getPembelianDetail } = usePembelianDb();
  const [faktur, setFaktur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const safeDecode = (value) => {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      return value;
    }
  };

  const rawFakturId = params.fakturId || params["*"];
  const fakturId = rawFakturId
    ? safeDecode(rawFakturId)
    : safeDecode(location.pathname.replace(/^\/pembelian\/lihat\//, ""));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await getPembelianDetail(fakturId);
      if (cancelled) return;
      if (!data) {
        setNotFound(true);
        setFaktur(null);
      } else {
        setFaktur(data);
        setNotFound(false);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [fakturId, getPembelianDetail]);

  return (
    <Box
      className="faktur-preview-page"
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        px: spacing.xxl,
        pt: spacing.xxl,
        pb: spacing.xxl,
        display: "flex",
        flexDirection: "column",
        gap: spacing.xxl,
      }}
    >
      {/* ==================== HEADER ==================== */}
      <Box
        className="no-print"
        sx={{
          bgcolor: colors.bgCard,
          p: spacing.xxl,
          borderRadius: radii.s,
          border: `1px solid ${colors.borderLight}`,
          boxShadow: shadows.card,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: spacing.lg,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: colors.textMuted,
              fontSize: typography.caption,
              fontWeight: typography.bold,
              letterSpacing: 1,
              display: "block",
              mb: 0.5,
            }}
          >
            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/pembelian")}
            >
              PEMBELIAN
            </span>
            <span style={{ margin: "0 8px" }}>&gt;</span>
            <span>LIHAT FAKTUR</span>
          </Typography>
          <Typography
            sx={{
              fontWeight: typography.bold,
              fontSize: typography.title,
              color: colors.text,
            }}
          >
            Preview Faktur Pembelian
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate("/pembelian")}
          startIcon={<ArrowBackIcon />}
          sx={{
            bgcolor: colors.bgCard,
            color: colors.text,
            fontWeight: typography.bold,
            fontSize: typography.body,
            textTransform: "none",
            borderRadius: radii.s,
            px: spacing.xxl,
            py: 1,
            border: `1px solid ${colors.border}`,
            boxShadow: "none",
            "&:hover": {
              bgcolor: colors.bgMuted,
              borderColor: colors.borderHover,
            },
          }}
        >
          Kembali
        </Button>
      </Box>

      {/* STATE LOADING */}
      {loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            color: colors.textMuted,
            fontSize: typography.body,
          }}
        >
          Memuat data faktur...
        </Box>
      )}

      {/* STATE NOT FOUND */}
      {!loading && notFound && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            color: colors.textMuted,
          }}
        >
          <Typography
            sx={{ fontSize: typography.bodyLg, color: colors.textSecondary }}
          >
            Faktur tidak ditemukan.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/pembelian")}
            sx={{
              mt: 2,
              bgcolor: colors.primary,
              fontWeight: typography.bold,
              textTransform: "none",
              borderRadius: radii.s,
              boxShadow: "none",
              "&:hover": {
                bgcolor: colors.primaryHover,
                boxShadow: "none",
              },
            }}
          >
            Kembali ke Daftar
          </Button>
        </Box>
      )}

      {/* TAMPILAN FAKTUR */}
      {!loading && faktur && <FakturPrintView faktur={faktur} />}
    </Box>
  );
};

export default LihatFakturPage;