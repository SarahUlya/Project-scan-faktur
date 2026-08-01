import { buildReceiptHtml } from "./receiptTemplate";

export function printReceipt(transaksi) {
  const printWindow = window.open(
    "",
    "_blank",
    "width=420,height=800"
  );

  if (!printWindow) {
    alert("Popup diblokir browser.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildReceiptHtml(transaksi));
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();

      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 300);
  };
}