import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  IconButton,
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { colors, radii } from "@/theme/designTokens";

const KonfirmasiPoModal = ({ open, onClose, selectedItemsData, suppliersList = [], onConfirm }) => {
  const [selectedSupplierName, setSelectedSupplierName] = useState("");
  const [termin, setTermin] = useState("Kredit 30 Hari (Net 30)");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [waPbf, setWaPbf] = useState(true);
  const [cetakSp, setCetakSp] = useState(true);

  // Inisialisasi nama supplier saat modal dibuka
  useEffect(() => {
    if (suppliersList.length > 0) {
      const defaultSupName = selectedItemsData[0]?.supplier || suppliersList[0]?.nama_supplier || suppliersList[0]?.label || "";
      setSelectedSupplierName(defaultSupName);
    }
  }, [open, selectedItemsData, suppliersList]);

  // Kalkulasi subtotal
  const subtotal = selectedItemsData.reduce((sum, item) => sum + ((item.saran_order || item.min_stock || 10) * (item.hpp || 15000)), 0);
  const ppn = Math.round(subtotal * 0.11);
  const grandTotal = subtotal + ppn;

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ p: 1, bgcolor: colors.dangerLight, color: colors.danger, borderRadius: 2, display: "flex" }}>
            <DescriptionOutlinedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: colors.text }}>
              Konfirmasi Buat Purchase Order (PO)
            </Typography>
            <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
              Pembuatan Surat Pesanan resmi terintegrasi sistem defekta cerdas
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3, overflowY: "visible" }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, mb: 1 }}>
              DISTRIBUTOR / PBF TERPILIH
            </Typography>
            
            {/* Model Dropdown Standar dengan TextField Select & MenuItem */}
            <TextField
              select
              size="small"
              fullWidth
              value={selectedSupplierName}
              onChange={(e) => setSelectedSupplierName(e.target.value)}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: colors.bgCard || "#ffffff",
                      color: colors.text || "#111827",
                      borderRadius: 2,
                      boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                      mt: 1,
                      maxHeight: 220,
                      border: `1px solid ${colors.borderLight || "#e5e7eb"}`,
                    }
                  }
                }
              }}
            >
              {suppliersList.map((sup, idx) => {
                const supName = typeof sup === "string" ? sup : (sup.nama_supplier || sup.label || "");
                return (
                  <MenuItem key={idx} value={supName} sx={{ fontSize: 13, fontWeight: 500 }}>
                    {supName}
                  </MenuItem>
                );
              })}
            </TextField>

            <Typography sx={{ fontSize: 11, color: colors.success, mt: 0.5 }}>
              ✔ Sesuai master supplier default produk
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, mb: 1 }}>
              NOMOR PO (OTOMATIS)
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField size="small" fullWidth value="PO-2026-DEF-008" disabled />
              <Box sx={{ px: 1.5, py: 0.5, bgcolor: colors.successLight, color: colors.success, borderRadius: 1, fontSize: 11, fontWeight: 700, height: 32, display: "flex", alignItems: "center" }}>
                DRAFT BARU
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, mb: 1, mt: 1 }}>
              TANGGAL SURAT PESANAN
            </Typography>
            <TextField
              type="date"
              size="small"
              fullWidth
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textMuted, mb: 1, mt: 1 }}>
              TERMIN / SYARAT PEMBAYARAN (TOP)
            </Typography>
            <TextField
              select
              size="small"
              fullWidth
              value={termin}
              onChange={(e) => setTermin(e.target.value)}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: { maxHeight: 200, borderRadius: 2 }
                  }
                }
              }}
            >
              <MenuItem value="Kredit 30 Hari (Net 30)">Kredit 30 Hari (Net 30)</MenuItem>
              <MenuItem value="Cash / COD">Cash / COD</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Tabel Rincian Item Defecta */}
        <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1.5, textTransform: "uppercase", color: colors.textMuted }}>
          Rincian Item Defecta ({selectedItemsData.length} Jenis Obat Siap Diorder)
        </Typography>
        <Box sx={{ border: `1px solid ${colors.borderLight}`, borderRadius: 2, overflow: "hidden", mb: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", bgcolor: colors.bgMuted, p: 1.5, fontSize: 11, fontWeight: 700, color: colors.textMuted }}>
            <Box>NAMA OBAT & SKU</Box>
            <Box align="center">STOK SAAT INI</Box>
            <Box align="center">JUMLAH ORDER</Box>
            <Box align="right">HPP SATUAN</Box>
            <Box align="right">SUBTOTAL</Box>
          </Box>
          {selectedItemsData.map((item, idx) => {
            const qtyOrder = item.saran_order || item.min_stock || 10;
            const hppItem = item.hpp || 15000;
            const stokSisa = item.current_stock ?? item.stok_sisa ?? 0;
            return (
              <Box key={idx} sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", p: 1.5, alignItems: "center", borderTop: `1px solid ${colors.borderLight}`, fontSize: 13 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{item.nama_produk || item.nama}</Typography>
                  <Typography sx={{ fontSize: 11, color: colors.textMuted }}>SKU: {item.sku}</Typography>
                </Box>
                <Box align="center">
                  <Box sx={{ bgcolor: colors.dangerLight, color: colors.danger, px: 1, py: 0.5, borderRadius: 1, fontWeight: 700, display: "inline-block", fontSize: 12 }}>
                    {stokSisa} {item.satuan}
                  </Box>
                </Box>
                <Box align="center">
                  <Box sx={{ bgcolor: colors.primaryLight, color: colors.primary, px: 1, py: 0.5, borderRadius: 1, fontWeight: 700, display: "inline-block", fontSize: 12 }}>
                    {qtyOrder} {item.satuan}
                  </Box>
                </Box>
                <Box align="right" sx={{ fontWeight: 500 }}>Rp {hppItem.toLocaleString("id-ID")}</Box>
                <Box align="right" sx={{ fontWeight: 700 }}>Rp {(qtyOrder * hppItem).toLocaleString("id-ID")}</Box>
              </Box>
            );
          })}
        </Box>

        {/* Opsi Dokumen & Ringkasan Total */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, mb: 1, textTransform: "uppercase" }}>
              Opsi Pengiriman & Dokumen
            </Typography>
            <Box sx={{ bgcolor: colors.bgMuted, p: 2, borderRadius: 2, border: `1px solid ${colors.borderLight}` }}>
              <FormControlLabel
                control={<Checkbox checked={waPbf} onChange={(e) => setWaPbf(e.target.checked)} color="primary" />}
                label={<Typography sx={{ fontSize: 13, fontWeight: 500 }}>Kirim tembusan PDF via WhatsApp PBF</Typography>}
              />
              <Typography sx={{ fontSize: 11, color: colors.textMuted, ml: 4, mb: 1 }}>
                Kirim otomatis ke Sales Representative terkait.
              </Typography>

              <FormControlLabel
                control={<Checkbox checked={cetakSp} onChange={(e) => setCetakSp(e.target.checked)} color="primary" />}
                label={<Typography sx={{ fontSize: 13, fontWeight: 500 }}>Cetak Surat Pesanan (SP) Resmi Apotek</Typography>}
              />
              <Typography sx={{ fontSize: 11, color: colors.textMuted, ml: 4 }}>
                Sertakan tanda tangan penanggung jawab farmasi (Apoteker).
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: colors.bgMuted, p: 2, borderRadius: 2, border: `1px solid ${colors.borderLight}`, display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: colors.textSecondary }}>
                <Typography>Subtotal Produk:</Typography>
                <Typography sx={{ fontWeight: 600 }}>Rp {subtotal.toLocaleString("id-ID")}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: colors.textSecondary }}>
                <Typography>PPN Faktur (11%):</Typography>
                <Typography sx={{ fontWeight: 600 }}>Rp {ppn.toLocaleString("id-ID")}</Typography>
              </Box>
              <Divider sx={{ my: 0.5 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 15, alignItems: "center" }}>
                <Typography sx={{ fontWeight: 700, color: colors.text }}>Total Nilai PO:</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: colors.danger }}>
                  Rp {grandTotal.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
          * Item yang dipesan otomatis berpindah ke status 'Menunggu Pengiriman'.
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" onClick={onClose} sx={{ color: colors.text, borderColor: colors.borderLight }}>
            Batal (Esc)
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              const matchedSup = suppliersList.find(s => (s.nama_supplier || s.label || s) === selectedSupplierName);
              const supId = matchedSup?.id || matchedSup?.id_supplier || "custom-id";
              onConfirm(supId, selectedSupplierName);
              onClose();
            }}
            sx={{ fontWeight: 700, px: 3 }}
          >
            Konfirmasi & Terbitkan PO
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default KonfirmasiPoModal;