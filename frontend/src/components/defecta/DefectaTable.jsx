import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  Chip,
  Button
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { colors, radii, shadows } from "@/theme/designTokens";

const DefectaTable = ({ data, selectedItems, onSelectItem, onSelectAll, onSinglePo }) => {
  // Validasi ID item yang konsisten
  const getItemId = (row, idx) => row.id_produk || row.id || idx;

  const dataIds = data.map((row, idx) => getItemId(row, idx));
  
  // Cek apakah semua item di halaman ini terpilih
  const isAllSelected = dataIds.length > 0 && dataIds.every(id => selectedItems.includes(id));
  // Cek apakah sebagian item terpilih (untuk efek garis minus/indeterminate pada checkbox utama)
  const isSomeSelected = dataIds.some(id => selectedItems.includes(id)) && !isAllSelected;

  return (
    <TableContainer component={Paper} sx={{ borderRadius: radii.xs, border: `1px solid ${colors.borderLight}`, boxShadow: shadows.card }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: colors.bgMuted }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                onChange={onSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: colors.textMuted }}>PRODUK / OBAT</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: colors.textMuted }}>SUPPLIER DEFAULT (PBF)</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12, color: colors.textMuted }}>STOK SISA</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12, color: colors.textMuted }}>BATAS MIN</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12, color: colors.textMuted }}>SARAN ORDER (ROP)</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12, color: colors.textMuted }}>LEAD TIME</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: colors.textMuted }}>STATUS</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12, color: colors.textMuted }}>AKSI</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 4, color: colors.textMuted }}>
                Tidak ada produk defecta yang ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => {
              const rowId = getItemId(row, idx);
              const namaProduk = row.nama_produk || row.nama || "-";
              const skuProduk = row.sku || row.kode_sku || "-";
              const tipeObat = row.tipe_obat || row.kategori || "Obat";
              const supplierName = row.supplier || row.nama_supplier || "Supplier Umum";
              
              const stokSisa = row.current_stock ?? row.stok_sisa ?? 0;
              const batasMin = row.min_stock ?? row.batas_minimum ?? 10;
              const saranOrder = row.saran_order || (batasMin * 2 - stokSisa) || 15;
              const leadTime = row.lead_time ?? 1;
              const satuanObat = row.satuan || row.nama_satuan || "Pcs";
              
              const statusObat = row.status || (stokSisa === 0 ? "KRITIS" : "WASPADA");
              const isKritis = statusObat === "KRITIS";
              const isSelected = selectedItems.includes(rowId);

              return (
                <TableRow key={rowId} hover selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onSelectItem(rowId)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 13, color: colors.text }}>{namaProduk}</Typography>
                      <Chip 
                        label={tipeObat} 
                        size="small" 
                        sx={{ height: 18, fontSize: 10, fontWeight: 700, bgcolor: colors.bgMuted, color: colors.textSecondary }} 
                      />
                    </Box>
                    <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.2 }}>SKU: {skuProduk}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 500 }}>{supplierName}</TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 700, fontSize: 13, color: isKritis ? colors.danger : colors.warning }}>
                      {stokSisa} {satuanObat}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {batasMin} {satuanObat}
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 700, fontSize: 13, color: colors.text }}>
                      {saranOrder} {satuanObat}
                    </Typography>
                    {row.catatan_order && (
                      <Typography sx={{ fontSize: 10, color: colors.textMuted }}>{row.catatan_order}</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {leadTime} Hari
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusObat}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: 11,
                        bgcolor: isKritis ? colors.dangerLight : colors.warningLight,
                        color: isKritis ? colors.danger : colors.warning,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 14 }} />}
                      onClick={() => onSinglePo(row)}
                      sx={{
                        fontSize: 11,
                        textTransform: "none",
                        py: 0.5,
                        borderColor: colors.borderLight,
                        color: colors.text,
                        "&:hover": { borderColor: colors.primary, bgcolor: colors.primaryLight }
                      }}
                    >
                      Buat PO
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DefectaTable;