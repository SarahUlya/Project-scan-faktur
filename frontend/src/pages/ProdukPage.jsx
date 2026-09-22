import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProdukTable from "../components/produk/ProdukTable";
import ProdukDetailModal from "../components/produk/ProdukDetailModal";
import PaginationControls from "../components/ui/PaginationControls";
import useProdukDb from "../hooks/useProdukDb";
import Modal from "../components/ui/Modal";
import ProdukForm from "../components/produk/ProdukForm";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ProdukLoadingSkeleton from "../components/produk/ProdukLoadingSkeleton";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  pageHeaderSx,
} from "@/theme/designTokens";

const PAGE_SIZE = 25;

const ProdukPage = () => {
  const {
    produk,
    addProduk,
    updateProduk,
    setProduk,
    loading,
    getNamaKategori,
    getNamaSatuan,
    search,
    setSearch,
    kategori,
    page,
    setPage,
    total,
    totalPages,
    satuanList,
    deleteProduk,
    fetchProduk,
  } = useProdukDb();

  const [modal, setModal] = useState({ open: false, mode: "add", data: null });
  const [detail, setDetail] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearch(query);
    setPage(1);

    if (searchParams.get("add") === "true") {
      setModal({ open: true, mode: "add", data: null });
    }
  }, [searchParams]);

  const update = (item) => {
    setProduk((prev) =>
      prev.map((p) => (p.id_produk === item.id_produk ? { ...p, ...item } : p))
    );
  };

  const clearAddParam = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("add");
    setSearchParams(params);
  };

  const handleAdd = async (item) => {
    await addProduk(item);
    setModal({ open: false, mode: "add", data: null });
    clearAddParam();
  };

  const handleEdit = (item) => {
    setModal({ open: true, mode: "edit", data: item });
  };

  const handleEditSubmit = async (item) => {
    try {
      await updateProduk(item.id_produk, item);
      setModal({ open: false, mode: "edit", data: null });
    } catch (err) {
      console.error(err);
      alert("Gagal update produk");
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleDetail = (item) => {
    setDetail(item);
  };

  const handleCloseModal = () => {
    setModal({ open: false, mode: "add", data: null });
    clearAddParam();
  };

  const handleOpenAdd = () => {
    setModal({ open: true, mode: "add", data: null });
    const params = new URLSearchParams(searchParams);
    params.set("add", "true");
    setSearchParams(params);
  };

  if (loading && produk.length === 0) {
    return <ProdukLoadingSkeleton />;
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
        <Box sx={{ flex: 1, minWidth: 280 }}>
          <Typography sx={pageHeaderSx.title}>Data Produk</Typography>
          <Typography
            sx={{ ...pageHeaderSx.subtitle, fontSize: typography.body }}
          >
            Manajemen katalog obat dan perlengkapan medis.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: spacing.lg,
            alignItems: "center",
            minWidth: { xs: "100%", sm: 480 },
          }}
        >
          <TextField
            size="small"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => {
              const query = e.target.value;
              setSearch(query);

              const params = new URLSearchParams(searchParams);
              if (query) {
                params.set("search", query);
              } else {
                params.delete("search");
              }
              setSearchParams(params);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.textMuted, fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                bgcolor: colors.bgMuted,
                borderRadius: radii.s,
                fontSize: typography.body,
                height: 44,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.borderHover },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              textTransform: "none",
              borderRadius: radii.s,
              height: 44,
              px: spacing.xxl,
              fontWeight: typography.bold,
              fontSize: typography.body,
              bgcolor: colors.primary,
              color: colors.textOnDark,
              boxShadow: "none",
              "&:hover": {
                bgcolor: colors.primaryHover,
                boxShadow: "none",
              },
            }}
          >
            Produk
          </Button>
        </Box>
      </Paper>

      {/* ==================== TABLE CARD ==================== */}
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: radii.s,
          border: `1px solid ${colors.borderLight}`,
          boxShadow: shadows.card,
          overflow: "hidden",
        }}
      >
        <ProdukTable
          data={produk}
          getNamaKategori={getNamaKategori}
          getNamaSatuan={getNamaSatuan}
          onViewDetail={handleDetail}
          onEdit={handleEdit}
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
            Menampilkan {produk.length} dari {total} produk
          </Typography>

          <PaginationControls
            page={page}
            totalPages={totalPages || 1}
            onChange={setPage}
          />
        </Box>
      </Box>

      {/* ==================== MODAL TAMBAH/EDIT ==================== */}
      <Modal open={modal.open} onClose={handleCloseModal} width={460}>
        <ProdukForm
          mode={modal.mode}
          initialData={modal.data}
          kategori={kategori}
          satuanList={satuanList}
          onClose={handleCloseModal}
          onSubmit={modal.mode === "add" ? handleAdd : handleEditSubmit}
        />
      </Modal>

      {/* ==================== MODAL DETAIL ==================== */}
      <Modal open={!!detail} onClose={() => setDetail(null)} width={460}>
        <ProdukDetailModal
          product={detail}
          getNamaKategori={getNamaKategori}
          onClose={() => setDetail(null)}
        />
      </Modal>
    </Box>
  );
};

export default ProdukPage;