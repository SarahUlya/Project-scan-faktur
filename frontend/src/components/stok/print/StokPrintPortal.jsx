import React from "react";
import { Box } from "@mui/material";
import LaporanStokPrint from "./LaporanStokPrint";
import KartuBatchPrint from "./KartuBatchPrint";

/**
 * Portal cetak — dirender off-screen, muncul saat @media print
 * type: 'laporan' | 'kartu'
 */
const StokPrintPortal = ({ job }) => {
  if (!job) return null;

  return (
    <Box
      className="stok-print-portal"
      sx={{
        position: "fixed",
        left: -9999,
        top: 0,
        zIndex: -1,
        "@media print": {
          position: "static",
          left: 0,
          zIndex: 9999,
        },
      }}
    >
      {job.type === "laporan" && (
        <LaporanStokPrint rows={job.rows} judul={job.judul} />
      )}
      {job.type === "kartu" && <KartuBatchPrint batch={job.batch} />}
    </Box>
  );
};

export default StokPrintPortal;
