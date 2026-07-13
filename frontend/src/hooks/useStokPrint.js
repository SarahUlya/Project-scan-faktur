import { useState, useCallback, createElement } from "react";
import { createPortal } from "react-dom";
import { downloadKartuBatchPdf, downloadLaporanStokPdf } from "../utils/stokPrintPdf";
import StokPrintPortal from "../components/stok/print/StokPrintPortal";

const PORTAL_ID = "stok-print-portal-root";

function getPortalRoot() {
  let el = document.getElementById(PORTAL_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = PORTAL_ID;
    el.className = "stok-print-portal-root";
    document.body.appendChild(el);
  }
  return el;
}

function runStokPrint(setPrintJob, job, onDone) {
  setPrintJob(job);
  document.body.classList.add("printing-stok");

  const cleanup = () => {
    document.body.classList.remove("printing-stok");
    setPrintJob(null);
    onDone?.();
  };

  window.addEventListener("afterprint", cleanup, { once: true });

  setTimeout(() => window.print(), 400);
}

export default function useStokPrint() {
  const [printJob, setPrintJob] = useState(null);

  const printLaporan = useCallback((rows, judul = "LAPORAN STOK & BATCH") => {
    if (!rows?.length) {
      alert("Tidak ada data stok untuk dicetak.");
      return;
    }
    runStokPrint(setPrintJob, { type: "laporan", rows, judul });
  }, []);

  const printKartuBatch = useCallback((batch) => {
    if (!batch) return;
    runStokPrint(setPrintJob, { type: "kartu", batch });
  }, []);

  const exportLaporanPdf = useCallback((rows, judul = "LAPORAN STOK & BATCH") => {
    if (!rows?.length) {
      alert("Tidak ada data stok untuk diexport.");
      return;
    }
    downloadLaporanStokPdf(rows, judul);
  }, []);

  const exportKartuPdf = useCallback((batch) => {
    if (!batch) return;
    downloadKartuBatchPdf(batch);
  }, []);

  const PrintPortal = printJob
    ? createPortal(createElement(StokPrintPortal, { job: printJob }), getPortalRoot())
    : null;

  return {
    printLaporan,
    printKartuBatch,
    exportLaporanPdf,
    exportKartuPdf,
    PrintPortal,
  };
}
