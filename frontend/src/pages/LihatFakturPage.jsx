import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import FakturPrintView from "../components/pembelian/FakturPrintView";
import usePembelianDb from "../hooks/usePembelianDb";
import "../styles/faktur-print.css";

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

  const rawFakturId = params.fakturId || params['*'];
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

  const handlePrint = () => window.print();

  return (
    <Box className="faktur-preview-page">
      <div className="faktur-preview-actions no-print">
        <button
          type="button"
          onClick={() => navigate("/pembelian")}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            background: "#fff",
            color: "#64748B",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ArrowBackIcon fontSize="small" />
          Kembali
        </button>
        <button
          type="button"
          onClick={handlePrint}
          disabled={!faktur}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            background: faktur ? "#0F766E" : "#F1F5F9",
            color: faktur ? "#fff" : "#94A3B8",
            fontWeight: 700,
            cursor: faktur ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: faktur ? "0 4px 12px rgba(15, 118, 110, 0.2)" : "none",
          }}
        >
          <PrintOutlinedIcon fontSize="small" />
          Cetak Printer
        </button>
      </div>

      <div className="no-print" style={{ marginBottom: 16 }}>
        <div
          style={{
            color: "#0D9488",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/pembelian")}>
            PEMBELIAN
          </span>
          <span style={{ color: "#94A3B8", margin: "0 8px" }}>&gt;</span>
          <span>LIHAT FAKTUR</span>
        </div>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: 28, color: "#1E293B" }}>
          Preview Faktur Pembelian
        </h2>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 48, color: "#94A3B8" }}>
          Memuat data faktur...
        </div>
      )}

      {!loading && notFound && (
        <div style={{ textAlign: "center", padding: 48, color: "#94A3B8" }}>
          Faktur tidak ditemukan.
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() => navigate("/pembelian")}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                background: "#0F766E",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Kembali ke Daftar
            </button>
          </div>
        </div>
      )}

      {!loading && faktur && <FakturPrintView faktur={faktur} />}
    </Box>
  );
};

export default LihatFakturPage;
