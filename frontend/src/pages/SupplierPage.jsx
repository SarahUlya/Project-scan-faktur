import React, { useState } from "react";
import SupplierTable from "../components/supplier/SupplierTable";
import PaginationControls from "../components/ui/PaginationControls";
import useSupplierDb from "../hooks/useSupplierDb";
import Modal from "../components/ui/Modal";
import SupplierForm from "../components/supplier/SupplierForm";
import SupplierLoadingSkeleton from "../components/supplier/SupplierLoadingSkeleton";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
} from "@mui/material";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  pageHeaderSx,
} from "@/theme/designTokens";

const PAGE_SIZE = 25;

const SupplierPage = () => {
  const { supplier, loading, addSupplier, updateSupplier } = useSupplierDb();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({
    open: false,
    mode: "add",
    data: null,
  });

  const filteredSupplier = supplier.filter((item) => {
    const query = search.toLowerCase();
    return (
      (item.nama || "").toLowerCase().includes(query) ||
      (item.email || "").toLowerCase().includes(query) ||
      (item.alamat || "").toLowerCase().includes(query) ||
      (item.telepon || "").toLowerCase().includes(query)
    );
  });

  const total = filteredSupplier.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagedSupplier = filteredSupplier.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleAdd = async (item) => {
    try {
      await addSupplier(item);
      setModal({ open: false, mode: "add", data: null });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setModal({ open: true, mode: "edit", data: item });
  };

  const handleEditSubmit = async (item) => {
    await updateSupplier(item);
    setModal({ open: false, mode: "edit", data: null });
  };

  const handleCloseModal = () => {
    setModal({ open: false, mode: "add", data: null });
  };

  if (loading) {
    return <SupplierLoadingSkeleton />;
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
          <Typography sx={pageHeaderSx.title}>Data Supplier</Typography>
          <Typography
            sx={{ ...pageHeaderSx.subtitle, fontSize: typography.body }}
          >
            Kelola informasi mitra pemasok obat dan alkes.
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
            placeholder="Cari nama supplier..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
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
            onClick={() =>
              setModal({ open: true, mode: "add", data: null })
            }
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
            Tambah Supplier
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
        <SupplierTable data={pagedSupplier} onEdit={handleEdit} />

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
            sx={{ color: colors.textSecondary, fontSize: typography.body }}
          >
            Menampilkan {pagedSupplier.length} dari {total} supplier
          </Typography>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </Box>
      </Box>

      {/* ==================== MODAL ==================== */}
      <Modal open={modal.open} onClose={handleCloseModal} width={460}>
        <SupplierForm
          mode={modal.mode}
          initialData={modal.data}
          onClose={handleCloseModal}
          onSubmit={modal.mode === "add" ? handleAdd : handleEditSubmit}
        />
      </Modal>
    </Box>
  );
};

export default SupplierPage;