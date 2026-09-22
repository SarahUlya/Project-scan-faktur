import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

import DefectaTable from "../components/defecta/DefectaTable";
import PaginationControls from "../components/ui/PaginationControls";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  statCardSx,
  pageHeaderSx,
} from "@/theme/designTokens";

import { getStokMenipis } from "../api/produkApi";
import { getSupplier } from "../api/supplierApi";
import { createPembelian } from "../api/pembelianApi";

const PAGE_SIZE = 10;

// --- MODAL KONFIRMASI PO ---
const KonfirmasiPoModal = ({
  open,
  onClose,
  selectedItemsData,
  suppliersList,
  onConfirm,
}) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState("");

  useEffect(() => {
    if (selectedItemsData.length > 0 && suppliersList.length > 0) {
      const firstItemSupplier = selectedItemsData[0]?.supplier;
      const matchedSupplier = suppliersList.find(
        (s) => s.nama_supplier === firstItemSupplier
      );
      setSelectedSupplierId(
        matchedSupplier ? matchedSupplier.id : suppliersList[0]?.id || ""
      );
    }
  }, [selectedItemsData, suppliersList]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: radii.s, p: 1 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: colors.dangerLight,
              color: colors.danger,
              borderRadius: radii.xs,
              display: "flex",
            }}
          >
            <DescriptionOutlinedIcon />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: typography.bold,
                fontSize: typography.h5,
                color: colors.text,
              }}
            >
              Konfirmasi Buat Purchase Order (PO)
            </Typography>
            <Typography
              sx={{ fontSize: typography.caption, color: colors.textSecondary }}
            >
              Pembuatan Surat Pesanan resmi terintegrasi sistem defekta cerdas
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: typography.caption,
                fontWeight: typography.semibold,
                color: colors.textMuted,
                mb: 1,
              }}
            >
              DISTRIBUTOR / PBF TERPILIH
            </Typography>
            <TextField
              select
              size="small"
              fullWidth
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: radii.s,
                  bgcolor: colors.bgMuted,
                  "& fieldset": { borderColor: colors.border },
                  "&:hover fieldset": { borderColor: colors.borderHover },
                  "&.Mui-focused fieldset": { borderColor: colors.primary },
                },
              }}
            >
              {suppliersList.map((sup) => (
                <MenuItem key={sup.id} value={sup.id}>
                  {sup.nama_supplier || sup.nama}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: typography.caption,
                fontWeight: typography.semibold,
                color: colors.textMuted,
                mb: 1,
              }}
            >
              NOMOR PO (OTOMATIS)
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                size="small"
                fullWidth
                value="PO-2026-DEF-Auto"
                disabled
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: radii.s,
                  },
                }}
              />
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: colors.successLight,
                  color: colors.success,
                  borderRadius: radii.xs,
                  fontSize: typography.small,
                  fontWeight: typography.bold,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                DRAFT BARU
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: typography.body,
            fontWeight: typography.bold,
            mb: 1.5,
            textTransform: "uppercase",
            color: colors.textMuted,
          }}
        >
          Rincian Item Defecta ({selectedItemsData.length} Jenis Obat Siap
          Diorder)
        </Typography>
        <Box
          sx={{
            border: `1px solid ${colors.borderLight}`,
            borderRadius: radii.s,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              bgcolor: colors.bgMuted,
              p: 1.5,
              fontSize: typography.small,
              fontWeight: typography.bold,
              color: colors.textMuted,
            }}
          >
            <Box>NAMA OBAT & SKU</Box>
            <Box align="center">STOK SAAT INI</Box>
            <Box align="center">JUMLAH ORDER</Box>
            <Box align="right">HPP SATUAN</Box>
            <Box align="right">SUBTOTAL</Box>
          </Box>
          {selectedItemsData.map((item, idx) => {
            const qtyOrder = item.saran_order || item.min_stock || 10;
            const hppItem = item.hpp || 15000;
            return (
              <Box
                key={idx}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                  p: 1.5,
                  alignItems: "center",
                  borderTop: `1px solid ${colors.borderLight}`,
                  fontSize: typography.body,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: typography.semibold,
                      fontSize: typography.body,
                      color: colors.text,
                    }}
                  >
                    {item.nama_produk || item.nama}
                  </Typography>
                  <Typography
                    sx={{ fontSize: typography.small, color: colors.textMuted }}
                  >
                    SKU: {item.sku}
                  </Typography>
                </Box>
                <Box align="center">
                  <Box
                    sx={{
                      bgcolor: colors.dangerLight,
                      color: colors.danger,
                      px: 1,
                      py: 0.5,
                      borderRadius: radii.xs,
                      fontWeight: typography.bold,
                      display: "inline-block",
                      fontSize: typography.caption,
                    }}
                  >
                    {item.current_stock ?? item.stok_sisa} {item.satuan}
                  </Box>
                </Box>
                <Box align="center">
                  <Box
                    sx={{
                      bgcolor: colors.primaryLight,
                      color: colors.primary,
                      px: 1,
                      py: 0.5,
                      borderRadius: radii.xs,
                      fontWeight: typography.bold,
                      display: "inline-block",
                      fontSize: typography.caption,
                    }}
                  >
                    {qtyOrder} {item.satuan}
                  </Box>
                </Box>
                <Box align="right" sx={{ fontWeight: typography.medium }}>
                  Rp {hppItem.toLocaleString("id-ID")}
                </Box>
                <Box align="right" sx={{ fontWeight: typography.bold }}>
                  Rp {(qtyOrder * hppItem).toLocaleString("id-ID")}
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions
        sx={{ px: 3, py: 2, justifyContent: "space-between" }}
      >
        <Typography
          sx={{ fontSize: typography.caption, color: colors.textMuted }}
        >
          * Item otomatis berpindah ke status 'Menunggu Pengiriman'.
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: colors.text,
              borderColor: colors.border,
              borderRadius: radii.s,
              textTransform: "none",
              fontWeight: typography.semibold,
              "&:hover": { borderColor: colors.borderHover },
            }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => onConfirm(selectedSupplierId)}
            sx={{
              fontWeight: typography.bold,
              px: 3,
              bgcolor: colors.primary,
              color: colors.textOnDark,
              borderRadius: radii.s,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: colors.primaryHover,
                boxShadow: "none",
              },
            }}
          >
            Terbitkan & Tarik ke Faktur
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// --- HALAMAN UTAMA ---
const BukuDefectaPage = () => {
  const navigate = useNavigate();
  const [defectaData, setDefectaData] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState("semua");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resDefecta, resSupplier] = await Promise.all([
          getStokMenipis(),
          getSupplier(),
        ]);
        setDefectaData(resDefecta || []);
        setSuppliersList(resSupplier.data || resSupplier || []);
      } catch (error) {
        console.error("Gagal mengambil data API Buku Defecta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return defectaData.filter((item) => {
      const name = item.nama_produk || item.nama || "";
      const sku = item.sku || "";
      const supplier = item.supplier || "";
      const matchQuery =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.toLowerCase().includes(searchQuery.toLowerCase());

      const currentStock = item.current_stock ?? item.stok_sisa ?? 0;
      const status =
        item.status || (currentStock === 0 ? "KRITIS" : "WASPADA");

      if (activeTabFilter === "kritis")
        return matchQuery && status === "KRITIS";
      if (activeTabFilter === "waspada")
        return matchQuery && status === "WASPADA";
      return matchQuery;
    });
  }, [defectaData, searchQuery, activeTabFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(
        filteredData.map((item) => item.id_produk || item.id)
      );
    } else {
      setSelectedItems([]);
    }
  };

  const selectedItemsData = defectaData.filter((item) =>
    selectedItems.includes(item.id_produk || item.id)
  );

  const estimasiNilaiTotal = selectedItemsData.reduce((sum, item) => {
    const qty = item.saran_order || item.min_stock || 10;
    const hpp = item.hpp || 15000;
    return sum + qty * hpp;
  }, 0);

  const handleConfirmPoAndSave = async (supplierId) => {
    try {
      const payload = {
        supplier_id: supplierId,
        items: selectedItemsData.map((item) => ({
          produk_id: item.id_produk || item.id,
          jumlah: item.saran_order || item.min_stock || 10,
          harga_satuan: item.hpp || 15000,
        })),
        tanggal_pesan: new Date().toISOString(),
      };

      await createPembelian(payload);
      alert("Purchase Order berhasil diterbitkan dan disimpan!");
      setIsPoModalOpen(false);
      navigate("/pembelian", { state: { items: selectedItemsData } });
    } catch (error) {
      console.error("Gagal menyimpan pembelian:", error);
      alert("Terjadi kesalahan saat memproses PO.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  // ==================== RENDER ====================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        px: spacing.xxl,
        pt: spacing.xxl,
        pb: spacing.xxl,
        display: "flex",
        flexDirection: "column",
        gap: spacing.xxl,
      }}
    >
      {/* ==================== HEADER ==================== */}
      <Paper
        elevation={0}
        sx={{
          p: spacing.xxl,
          borderRadius: radii.s,
          border: `1px solid ${colors.borderLight}`,
          bgcolor: colors.bgCard,
          boxShadow: shadows.card,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: spacing.lg,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              sx={{ fontSize: typography.caption, color: colors.textMuted }}
            >
              Inventaris Farmasi
            </Typography>
            <Typography
              sx={{ fontSize: typography.caption, color: colors.textMuted }}
            >
              /
            </Typography>
            <Typography
              sx={{
                fontSize: typography.caption,
                fontWeight: typography.semibold,
                color: colors.primary,
              }}
            >
              Buku Defecta
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={pageHeaderSx.title}>Buku Defecta</Typography>
            <Chip
              label="Smart Restock (ROP)"
              size="small"
              sx={{
                bgcolor: colors.primaryLight,
                color: colors.primary,
                fontWeight: typography.bold,
                fontSize: typography.tiny,
                height: 22,
                borderRadius: radii.xs,
              }}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={() => setIsPoModalOpen(true)}
          disabled={selectedItems.length === 0}
          sx={{
            bgcolor: colors.text,
            color: colors.textOnDark,
            fontWeight: typography.bold,
            px: 2.5,
            borderRadius: radii.s,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: colors.primary,
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: colors.bgMuted,
              color: colors.textMuted,
            },
          }}
        >
          Buat PO Terpilih ({selectedItems.length}) • Rp{" "}
          {estimasiNilaiTotal.toLocaleString("id-ID")}
        </Button>
      </Paper>

      {/* ==================== 4 STAT CARDS ==================== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: spacing.xxl,
        }}
      >
        {/* Stok Kritis */}
        <Paper
          sx={{
            ...statCardSx,
            p: spacing.xxl,
            borderRadius: radii.s,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: typography.caption,
                fontWeight: typography.bold,
                color: colors.textMuted,
                textTransform: "uppercase",
              }}
            >
              Stok Kritis
            </Typography>
            <Typography
              sx={{
                fontSize: typography.h2,
                fontWeight: typography.bold,
                color: colors.danger,
                my: 0.5,
              }}
            >
              {
                defectaData.filter(
                  (i) => (i.current_stock ?? i.stok_sisa ?? 0) === 0
                ).length
              }{" "}
              <Box
                component="span"
                sx={{
                  fontSize: typography.body,
                  fontWeight: typography.medium,
                  color: colors.textSecondary,
                }}
              >
                Item
              </Box>
            </Typography>
            <Typography
              sx={{ fontSize: typography.small, color: colors.danger }}
            >
              Habis &lt; 24 jam
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1,
              bgcolor: colors.dangerLight,
              color: colors.danger,
              borderRadius: radii.xs,
            }}
          >
            <ErrorOutlineIcon />
          </Box>
        </Paper>

        {/* Menghampiri Batas */}
        <Paper
          sx={{
            ...statCardSx,
            p: spacing.xxl,
            borderRadius: radii.s,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: typography.caption,
                fontWeight: typography.bold,
                color: colors.textMuted,
                textTransform: "uppercase",
              }}
            >
              Menghampiri Batas
            </Typography>
            <Typography
              sx={{
                fontSize: typography.h2,
                fontWeight: typography.bold,
                color: colors.warning,
                my: 0.5,
              }}
            >
              {
                defectaData.filter(
                  (i) => (i.current_stock ?? i.stok_sisa ?? 0) > 0
                ).length
              }{" "}
              <Box
                component="span"
                sx={{
                  fontSize: typography.body,
                  fontWeight: typography.medium,
                  color: colors.textSecondary,
                }}
              >
                Item
              </Box>
            </Typography>
            <Typography
              sx={{ fontSize: typography.small, color: colors.warning }}
            >
              Buffer &lt; 3 hari
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1,
              bgcolor: colors.warningLight,
              color: colors.warning,
              borderRadius: radii.xs,
            }}
          >
            <WarningAmberIcon />
          </Box>
        </Paper>

        {/* Estimasi Nilai PO */}
        <Paper
          sx={{
            ...statCardSx,
            p: spacing.xxl,
            borderRadius: radii.s,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: typography.caption,
                fontWeight: typography.bold,
                color: colors.textMuted,
                textTransform: "uppercase",
              }}
            >
              Estimasi Nilai PO
            </Typography>
            <Typography
              sx={{
                fontSize: typography.h3,
                fontWeight: typography.bold,
                color: colors.text,
                my: 0.5,
              }}
            >
              Rp {estimasiNilaiTotal.toLocaleString("id-ID")}
            </Typography>
            <Typography
              sx={{ fontSize: typography.small, color: colors.textMuted }}
            >
              Total {defectaData.length} SKU Defecta
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1,
              bgcolor: colors.primaryLight,
              color: colors.primary,
              borderRadius: radii.xs,
            }}
          >
            <Inventory2OutlinedIcon />
          </Box>
        </Paper>

        {/* PBF Terkait */}
        <Paper
          sx={{
            ...statCardSx,
            p: spacing.xxl,
            borderRadius: radii.s,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: typography.caption,
                fontWeight: typography.bold,
                color: colors.textMuted,
                textTransform: "uppercase",
              }}
            >
              PBF Terkait
            </Typography>
            <Typography
              sx={{
                fontSize: typography.h2,
                fontWeight: typography.bold,
                color: colors.text,
                my: 0.5,
              }}
            >
              {suppliersList.length}{" "}
              <Box
                component="span"
                sx={{
                  fontSize: typography.body,
                  fontWeight: typography.medium,
                  color: colors.textSecondary,
                }}
              >
                Distributor
              </Box>
            </Typography>
            <Typography
              sx={{ fontSize: typography.small, color: colors.success }}
            >
              Semua Kontrak Aktif
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1,
              bgcolor: colors.successLight,
              color: colors.success,
              borderRadius: radii.xs,
            }}
          >
            <LocalShippingIcon />
          </Box>
        </Paper>
      </Box>

      {/* ==================== SEARCH & FILTER ==================== */}
      <Box
        sx={{
          display: "flex",
          gap: spacing.lg,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Cari nama obat, SKU, atau supplier..."
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          sx={{
            flex: 1,
            minWidth: 280,
            "& .MuiOutlinedInput-root": {
              bgcolor: colors.bgCard,
              borderRadius: radii.s,
              "& fieldset": { borderColor: colors.border },
              "&:hover fieldset": { borderColor: colors.borderHover },
              "&.Mui-focused fieldset": { borderColor: colors.primary },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: colors.textMuted, fontSize: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            display: "flex",
            bgcolor: colors.bgCard,
            p: 0.5,
            borderRadius: radii.s,
            border: `1px solid ${colors.borderLight}`,
          }}
        >
          <Button
            size="small"
            onClick={() => {
              setActiveTabFilter("semua");
              setPage(1);
            }}
            sx={{
              borderRadius: radii.xs,
              px: 2,
              fontSize: typography.caption,
              fontWeight: typography.semibold,
              textTransform: "none",
              bgcolor:
                activeTabFilter === "semua"
                  ? colors.primary
                  : "transparent",
              color:
                activeTabFilter === "semua"
                  ? colors.textOnDark
                  : colors.textSecondary,
              "&:hover": {
                bgcolor:
                  activeTabFilter === "semua"
                    ? colors.primaryHover
                    : colors.bgMuted,
              },
            }}
          >
            Semua
          </Button>
          <Button
            size="small"
            onClick={() => {
              setActiveTabFilter("kritis");
              setPage(1);
            }}
            sx={{
              borderRadius: radii.xs,
              px: 2,
              fontSize: typography.caption,
              fontWeight: typography.semibold,
              textTransform: "none",
              bgcolor:
                activeTabFilter === "kritis"
                  ? colors.danger
                  : "transparent",
              color:
                activeTabFilter === "kritis"
                  ? colors.textOnDark
                  : colors.textSecondary,
              "&:hover": {
                bgcolor:
                  activeTabFilter === "kritis"
                    ? colors.danger
                    : colors.bgMuted,
              },
            }}
          >
            Kritis
          </Button>
          <Button
            size="small"
            onClick={() => {
              setActiveTabFilter("waspada");
              setPage(1);
            }}
            sx={{
              borderRadius: radii.xs,
              px: 2,
              fontSize: typography.caption,
              fontWeight: typography.semibold,
              textTransform: "none",
              bgcolor:
                activeTabFilter === "waspada"
                  ? colors.warning
                  : "transparent",
              color:
                activeTabFilter === "waspada"
                  ? colors.textOnDark
                  : colors.textSecondary,
              "&:hover": {
                bgcolor:
                  activeTabFilter === "waspada"
                    ? colors.warning
                    : colors.bgMuted,
              },
            }}
          >
            Waspada
          </Button>
        </Box>
      </Box>

      {/* ==================== TABLE CARD ==================== */}
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: radii.s,
          overflow: "hidden",
          border: `1px solid ${colors.borderLight}`,
          boxShadow: shadows.card,
        }}
      >
        <DefectaTable
          data={paginatedData}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onSinglePo={(item) => {
            setSelectedItems([item.id_produk || item.id]);
            setIsPoModalOpen(true);
          }}
        />

        <Box
          sx={{
            px: spacing.xxl,
            py: spacing.lg,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${colors.borderLight}`,
            minHeight: 64,
          }}
        >
          <Typography
            sx={{ fontSize: typography.body, color: colors.textSecondary }}
          >
            Menampilkan {paginatedData.length} dari {totalItems} item defecta
          </Typography>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </Box>
      </Box>

      <KonfirmasiPoModal
        open={isPoModalOpen}
        onClose={() => setIsPoModalOpen(false)}
        selectedItemsData={
          selectedItemsData.length
            ? selectedItemsData
            : [defectaData[0]].filter(Boolean)
        }
        suppliersList={suppliersList}
        onConfirm={handleConfirmPoAndSave}
      />
    </Box>
  );
};

export default BukuDefectaPage;