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
  transitions,
  zIndex,
  fieldInputSx,
  pageHeaderSx,
  statCardSx,
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

  console.log(
  produk.map((item) => ({
    id: item.id_produk,
    nama: item.nama_produk,
    status: item.status,
    aktif: item.is_active,
  }))
);

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
      prev.map((p) => (p.id_produk === item.id_produk ? { ...p, ...item } : p)),
    );
  };

  const clearAddParam = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("add");
    setSearchParams(params);
  };

  const handleAdd = async (item) => {
    await addProduk(item);

    setModal({
      open: false,
      mode: "add",
      data: null,
    });

    clearAddParam();
  };
  const handleEdit = (item) => {
    setModal({ open: true, mode: "edit", data: item });
  };
  const handleEditSubmit = async (item) => {
    try {
      await updateProduk(item.id_produk, item);

      setModal({
        open: false,
        mode: "edit",
        data: null,
      });
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
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: colors.bgCard,
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(15, 118, 110, 0.08)",
          p: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: colors.text }}
            >
              Data Produk
            </Typography>

            <Typography sx={{ color: colors.textSecondary, mt: 1 }}>
              Manajemen katalog obat dan perlengkapan medis.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              minWidth: 480,
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
                    <SearchIcon sx={{ color: colors.textSecondary }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  background: colors.bgLight,
                  height: 44,
                },
              }}
              sx={{ flex: 1 }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              disabled={false}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                height: 44,
                px: 3,
                fontWeight: 700,
                backgroundColor: colors.primary,
                color: colors.textOnDark,
                "&:hover": {
                  backgroundColor: colors.primaryDark,
                },
              }}
            >
              Produk
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <Box
        sx={{
          background: colors.bgLight,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <>
          <ProdukTable
            data={produk}
            getNamaKategori={getNamaKategori}
            getNamaSatuan={getNamaSatuan}
            onViewDetail={handleDetail}
            onEdit={handleEdit}
          />

          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: colors.bgCard,
              borderTop: `1px solid ${colors.border}`,
              minHeight: 64,
              borderBottomLeftRadius: radii.lg,
              borderBottomRightRadius: radii.lg,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                color: colors.textSecondary,
              }}
            >
              Menampilkan {produk.length} dari {total} produk
            </Typography>

            <PaginationControls
              page={page}
              totalPages={totalPages || 1}
              onChange={setPage}
            />
          </Box>
        </>
      </Box>
      {/* Modal Tambah/Edit */}
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

      {/* Modal Detail */}
      <Modal open={!!detail} onClose={() => setDetail(null)} width={760}>
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
