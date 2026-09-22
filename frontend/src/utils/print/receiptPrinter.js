import { buildReceiptHtml } from "./receiptTemplate";

/* ══════════════════════════════════════════════════════════════════
 * PRINT RECEIPT — pakai hidden iframe
 * - Tidak buka tab/window baru
 * - Halaman utama tetap hidup
 * - Auto-print setelah konten siap
 * ══════════════════════════════════════════════════════════════════ */
export function printReceipt(transaksi) {
  try {
    // 1. Buat iframe hidden
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);

    // 2. Tulis HTML struk ke iframe
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(buildReceiptHtml(transaksi));
    doc.close();

    // 3. Trigger print setelah layout siap
    const triggerPrint = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        console.error("[printReceipt] Gagal print:", err);
      } finally {
        // 4. Cleanup iframe setelah dialog print ditutup
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1500);
      }
    };

    // Beberapa browser butuh delay kecil
    if (doc.readyState === "complete") {
      setTimeout(triggerPrint, 250);
    } else {
      iframe.onload = () => setTimeout(triggerPrint, 250);
    }
  } catch (err) {
    console.error("[printReceipt] Error:", err);
    alert("Gagal mencetak struk: " + (err?.message || "Unknown error"));
  }
}