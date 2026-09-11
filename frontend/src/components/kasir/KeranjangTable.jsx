import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const KeranjangTable = ({ cart, updateQuantity, removeFromCart }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ flex: 1, borderRadius: "10px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF" }}>
      <Table>
        <TableHead sx={{ bgcolor: "#FCE4EC" }}>
          <TableRow>
            <TableCell width="6%" sx={{ fontWeight: 700, color: "#D81B60" }}>#</TableCell>
            <TableCell width="40%" sx={{ fontWeight: 700, color: "#D81B60" }}>PRODUK</TableCell>
            <TableCell width="18%" sx={{ fontWeight: 700, color: "#D81B60" }}>HARGA</TableCell>
            <TableCell width="18%" align="center" sx={{ fontWeight: 700, color: "#D81B60" }}>QTY</TableCell>
            <TableCell width="18%" align="right" sx={{ fontWeight: 700, color: "#D81B60" }}>SUBTOTAL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.length === 0 ? (
            <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8, color: "#94A3B8" }}>Keranjang belanja masih kosong.</TableCell></TableRow>
          ) : (
            cart.map((item, index) => {
              const itemHarga = item.harga || item.harga_jual || 0;
              let batchNo = "-"; 
              if (typeof item.batch === "string" || typeof item.batch === "number") batchNo = item.batch; 
              else if (item.batch?.no_batch) batchNo = item.batch.no_batch; 
              else if (item.no_batch) batchNo = typeof item.no_batch === "object" ? item.no_batch?.no_batch || "-" : item.no_batch;
              
              let expDate = "-"; 
              if (typeof item.exp === "string" || typeof item.exp === "number") expDate = item.exp; 
              else if (typeof item.expired === "string" || typeof item.expired === "number") expDate = item.expired; 
              else if (item.expired_date) expDate = typeof item.expired_date === "object" ? item.expired_date?.expired_date || "-" : item.expired_date; 
              else if (item.batch?.expired_date) expDate = item.batch.expired_date;

              return (
                <TableRow key={item.id_produk || index} hover>
                  <TableCell sx={{ color: "#64748B", fontWeight: 600 }}>{index + 1}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>{item.nama_produk || item.nama}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#94A3B8" }}>Batch: {String(batchNo)} • Exp: {String(expDate)} • Sisa Stok: {item.stok}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontWeight: 600 }}>Rp{itemHarga.toLocaleString("id-ID")}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <IconButton size="small" onClick={() => item.qty > 1 ? updateQuantity(item.id_produk, item.qty - 1) : removeFromCart(item.id_produk)} sx={{ bgcolor: "#FCE4EC", color: "#D81B60", borderRadius: "4px", p: "2px" }}><RemoveIcon fontSize="small" /></IconButton>
                      <Typography sx={{ fontWeight: 700, minWidth: 24, textAlign: "center", px: 1, border: "1px solid #E2E8F0", borderRadius: "4px" }}>{item.qty}</Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item.id_produk, item.qty + 1)} sx={{ bgcolor: "#FCE4EC", color: "#D81B60", borderRadius: "4px", p: "2px" }}><AddIcon fontSize="small" /></IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "#1E293B" }}>Rp{(itemHarga * item.qty).toLocaleString("id-ID")}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KeranjangTable;