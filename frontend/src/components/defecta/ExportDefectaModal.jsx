import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Autocomplete
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { colors, radii } from "@/theme/designTokens";

const defaultDistributors = [
  { id: "semua", label: "Semua Distributor (6 PBF)" },
  { id: "kimia_farma", label: "PT. Kimia Farma Trading" },
  { id: "dexa", label: "PT. Dexa Medica" },
  { id: "sanbe", label: "PT. Sanbe Farma Distribusi" },
  { id: "enseval", label: "PT. Enseval Putera Megatrading" },
  { id: "mensa", label: "PT. Mensa Bina Sukses" }
];

const ExportDefectaModal = ({ open, onClose, onExportExecute, suppliersList = defaultDistributors }) => {
  const [format, setFormat] = useState("xlsx");
  const [cakupan, setCakupan] = useState("semua");
  const [selectedDistributor, setSelectedDistributor] = useState(defaultDistributors[0]);
  const [sertakanLeadTime, setSertakanLeadTime] = useState(true);
  const [sertakanHpp, setSertakanHpp] = useState(true);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ p: 1, bgcolor: colors.primaryLight, color: colors.primary, borderRadius: 2, display: "flex" }}>
            <FileDownloadOutlinedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: colors.text }}>
              Export Data Buku Defecta
            </Typography>
            <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
              Pilih format berkas dan cakupan data obat yang ingin diunduh.
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3, display: "flex", flexDirection: "column", gap: 3, overflowY: "visible" }}>
        {/* Format Berkas */}
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, mb: 1.5, textTransform: "uppercase" }}>
            Format Berkas *
          </Typography>
          <RadioGroup value={format} onChange={(e) => setFormat(e.target.value)} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ border: `1px solid ${format === 'xlsx' ? colors.primary : colors.borderLight}`, p: 1.5, borderRadius: 2, bgcolor: format === 'xlsx' ? colors.primaryLight + "22" : "transparent" }}>
              <FormControlLabel value="xlsx" control={<Radio />} label={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>Microsoft Excel (.xlsx) <span style={{ color: colors.success, fontSize: 11, fontWeight: 500, marginLeft: 8 }}>Direkomendasikan</span></Typography>} />
              <Typography sx={{ fontSize: 12, color: colors.textSecondary, ml: 4 }}>Lengkap formula kalkulasi ROP, buffer stock & kontak distributor PBF.</Typography>
            </Box>
            <Box sx={{ border: `1px solid ${format === 'pdf' ? colors.primary : colors.borderLight}`, p: 1.5, borderRadius: 2 }}>
              <FormControlLabel value="pdf" control={<Radio />} label={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>Dokumen Cetak (.pdf)</Typography>} />
              <Typography sx={{ fontSize: 12, color: colors.textSecondary, ml: 4 }}>Format formal siap cetak berkop apotek untuk SP fisik.</Typography>
            </Box>
          </RadioGroup>
        </Box>

        {/* Cakupan Data Defecta */}
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, mb: 1.5, textTransform: "uppercase" }}>
            Cakupan Data Defecta
          </Typography>
          <RadioGroup row value={cakupan} onChange={(e) => setCakupan(e.target.value)} sx={{ gap: 2 }}>
            <FormControlLabel value="semua" control={<Radio />} label={<Typography sx={{ fontSize: 13 }}>Semua Item (17)</Typography>} />
            <FormControlLabel value="kritis" control={<Radio />} label={<Typography sx={{ fontSize: 13 }}>Hanya Kritis (12)</Typography>} />
            <FormControlLabel value="terpilih" control={<Radio />} label={<Typography sx={{ fontSize: 13 }}>Item Terpilih</Typography>} />
          </RadioGroup>
        </Box>

        {/* Filter Distributor dengan Autocomplete (disablePortal agar dropdown pas di bawah TextField dalam Dialog) */}
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, mb: 1, textTransform: "uppercase" }}>
            Filter Distributor / PBF:
          </Typography>
          <Autocomplete
            freeSolo
            disablePortal
            options={suppliersList}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.label || option.nama_supplier || "";
            }}
            value={selectedDistributor}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setSelectedDistributor({ id: "custom", label: newValue });
              } else if (newValue) {
                setSelectedDistributor(newValue);
              } else {
                setSelectedDistributor(null);
              }
            }}
            slotProps={{
              paper: {
                sx: {
                  bgcolor: colors.bgCard || "#ffffff",
                  color: colors.text || "#111827",
                  borderRadius: 2,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                  mt: 1,
                  border: `1px solid ${colors.borderLight || "#e5e7eb"}`,
                  "& .MuiAutocomplete-option": {
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.text || "#111827",
                    "&:hover": {
                      bgcolor: colors.primaryLight || "#f0fdf4",
                      color: colors.primary || "#0f766e",
                    },
                    '&[aria-selected="true"]': {
                      bgcolor: (colors.primaryLight + "66") || "#ccfbf1",
                    },
                  },
                },
              },
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                size="small" 
                placeholder="Ketik atau pilih nama distributor..." 
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    bgcolor: colors.bgCard || "#ffffff",
                    color: colors.text || "#111827",
                    borderRadius: 2,
                    fontSize: 14,
                    "& input": {
                      color: colors.text || "#111827",
                      WebkitTextFillColor: colors.text || "#111827",
                    }
                  }
                }}
              />
            )}
          />
        </Box>

        {/* Opsi Kolom Tambahan */}
        <Box sx={{ bgcolor: colors.bgMuted, p: 2, borderRadius: 2, border: `1px solid ${colors.borderLight}` }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, mb: 1, textTransform: "uppercase" }}>
            Opsi Kolom Tambahan
          </Typography>
          <FormControlLabel
            control={<Checkbox checked={sertakanLeadTime} onChange={(e) => setSertakanLeadTime(e.target.checked)} color="primary" />}
            label={<Typography sx={{ fontSize: 13 }}>Sertakan riwayat konsumsi rata-rata bulanan (Lead Time & Buffer)</Typography>}
            sx={{ display: "block", mb: 0.5 }}
          />
          <FormControlLabel
            control={<Checkbox checked={sertakanHpp} onChange={(e) => setSertakanHpp(e.target.checked)} color="primary" />}
            label={<Typography sx={{ fontSize: 13 }}>Sertakan kalkulasi HPP dan estimasi subtotal belanja</Typography>}
            sx={{ display: "block" }}
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={onClose} sx={{ color: colors.text, borderColor: colors.borderLight }}>Batal</Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={() => {
            onExportExecute(format, selectedDistributor);
            onClose();
          }}
          sx={{ fontWeight: 700, px: 3 }}
        >
          Download Berkas
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDefectaModal;