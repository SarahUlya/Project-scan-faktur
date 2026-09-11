import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupiahPos } from "../../utils/posCalculations";

const ShiftDetailModal = ({ open, shift, onClose }) => {
  if (!shift) return null;

  const handlePrintShift = () => {
    const printWin = window.open("", "_blank", "width=400,height=600");
    if (!printWin) {
      alert("Mohon izinkan pop-up untuk mencetak rekap shift.");
      return;
    }
    printWin.document.write(`
      <body style="font-family: monospace; padding: 10px; font-size: 12px;">
        <h3>REKAPITULASI SHIFT</h3>
        <p>ID Shift: ${shift.id}<br/>Kasir: ${shift.kasir}<br/>Waktu: ${new Date(shift.waktuBuka).toLocaleTimeString()} - ${new Date(shift.waktuTutup).toLocaleTimeString()}</p>
        <hr/>
        <p>Total Transaksi: ${shift.totalTransaksi}</p>
        <p><b>Total Omzet: Rp ${formatRupiahPos(shift.omzet)}</b></p>
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body>
    `);
    printWin.document.close();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: "16px", width: "700px" } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#1E293B" }}>
            Rekapitulasi Shift: {shift.id}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748B" }}>
            Kasir: <b>{shift.kasir}</b> • Total Transaksi: <b>{shift.totalTransaksi} Sesi</b>
          </Typography>
        </Box>
        <Button onClick={onClose} sx={{ color: "#64748B", minWidth: 32 }}><CloseIcon /></Button>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Paper elevation={0} sx={{ flex: 1, p: 2, bgcolor: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "10px" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#047857" }}>TOTAL OMZET SHIFT</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#065F46" }}>Rp {formatRupiahPos(shift.omzet || 0)}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ flex: 1, p: 2, bgcolor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "10px" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8" }}>WAKTU AKTIF</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#1E3A8A", mt: 0.5 }}>
              {`${new Date(shift.waktuBuka).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} - ${new Date(shift.waktuTutup).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB`}
            </Typography>
          </Paper>
        </Box>

        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#1E293B", mb: 1.5 }}>
          Daftar Transaksi Selama Shift Ini:
        </Typography>

        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: "10px", maxHeight: 280 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, bgcolor: "#F8FAFC" }}>ID Transaksi</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: "#F8FAFC" }}>Waktu</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: "#F8FAFC" }}>Metode</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, bgcolor: "#F8FAFC" }}>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shift.transactions.map((tx) => (
                <TableRow key={tx.id || tx.no_transaksi} hover>
                  <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>{tx.no_transaksi}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: "#64748B" }}>
                    {new Date(tx.tanggal_transaksi || tx.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{tx.metode_bayar || "TUNAI"}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, fontSize: 12, color: "#1E293B" }}>
                    Rp {formatRupiahPos(tx.total_bayar || tx.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Button 
          variant="outlined" 
          onClick={handlePrintShift}
          sx={{ color: "#3B82F6", borderColor: "#3B82F6", textTransform: "none", fontWeight: 700, borderRadius: "8px" }}
        >
          Cetak Rekap Shift
        </Button>
        <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#D81B60", textTransform: "none", fontWeight: 700, borderRadius: "8px", "&:hover": { bgcolor: "#C2185B" } }}>
          Tutup Rekap
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftDetailModal;