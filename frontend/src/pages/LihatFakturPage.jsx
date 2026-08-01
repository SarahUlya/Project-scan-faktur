import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FakturPrintView from "../components/pembelian/FakturPrintView";
import usePembelianDb from "../hooks/usePembelianDb";
import "../styles/faktur-print.css";
import { colors } from "@/theme/designTokens";

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
    <Box className="faktur-preview-page" sx={{ p: 3 }}>
      {/* HEADER PAGE: BREADCRUMB & JUDUL + TOMBOL KEMBALI */}
      <Box className="no-print" sx={{ mb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          {/* SISI KIRI: Breadcrumb & Title */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: colors.textMuted || "#64748b",
                fontSize: 12,
                fontWeight: 700,
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
              variant="h5"
              sx={{ fontWeight: 800, color: colors.text || "#0f172a" }}
            >
              Preview Faktur Pembelian
            </Typography>
          </Box>

          {/* SISI KANAN: Tombol Kembali (Diisikan di sebelah Dropdown Ekspor) */}
          <Button
            variant="contained"
            onClick={() => navigate("/pembelian")}
            startIcon={<ArrowBackIcon />}
            sx={{
              bgcolor: "#ffffff",
              color: colors.text || "#0f172a",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "8px",
              px: 2.5,
              py: 1,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              "&:hover": { bgcolor: "#f8fafc" },
            }}
          >
            Kembali
          </Button>
        </Stack>
      </Box>

      {/* STATE LOADING */}
      {loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            color: colors.textMuted || "#64748b",
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
            color: colors.textMuted || "#64748b",
          }}
        >
          <Typography variant="body1">Faktur tidak ditemukan.</Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/pembelian")}
            sx={{
              mt: 2,
              bgcolor: colors.primary,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "8px",
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