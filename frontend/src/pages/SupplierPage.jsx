import React, { useState } from "react";
import SupplierTable from "../components/supplier/SupplierTable";
import PaginationControls from "../components/ui/PaginationControls";
import useSupplierDb from "../hooks/useSupplierDb";
import Modal from "../components/ui/Modal";
import SupplierForm from "../components/supplier/SupplierForm";
import SupplierLoadingSkeleton from "../components/supplier/SupplierLoadingSkeleton";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { colors,radii } from "@/theme/designTokens";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";

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
      (item.alamat || "").toLowerCase().includes(query) ||
      (item.telepon || "").toLowerCase().includes(query)
    );
  });

  const total = filteredSupplier.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagedSupplier = filteredSupplier.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleAdd = async (item) => {
    try {
      await addSupplier(item);

      setModal({
        open: false,
        mode: "add",
        data: null,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setModal({
      open: true,
      mode: "edit",
      data: item,
    });
  };

  const handleEditSubmit = async (item) => {
    await updateSupplier(item);

    setModal({
      open: false,
      mode: "edit",
      data: null,
    });
  };
  if (loading) {
    return <SupplierLoadingSkeleton />;
  }
  return (
    <Box>
      <Box
        sx={{
          background: colors.bgCard,
          borderRadius: 3,
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
              sx={{ fontWeight: 700, color: colors.text }}
            >
              Data Supplier
            </Typography>

            <Typography sx={{ color: colors.textSecondary, mt: 1 }}>
              Kelola informasi mitra pemasok obat dan alkes.
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
              placeholder="Cari supplier, alamat, atau telepon..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.textSecondary }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  background: colors.bgMuted,
                  height: 44,
                },
              }}
              sx={{ flex: 1 }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                height: 44,
                px: 3,
                fontWeight: 700,
                backgroundColor: colors.primary,
                color: colors.textOnDark,
                "&:hover": {
                  backgroundColor: colors.primary,
                },
              }}
              onClick={() =>
                setModal({
                  open: true,
                  mode: "add",
                  data: null,
                })
              }
            >
              Tambah Supplier
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          background: colors.bgLight,
          overflow: "hidden",
        }}
      >
        <SupplierTable data={pagedSupplier} onEdit={handleEdit} />

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
              color: colors.textSecondary,
              fontSize: 14,
            }}
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

      <Modal
        open={modal.open}
        onClose={() =>
          setModal({
            open: false,
            mode: "add",
            data: null,
          })
        }
        width={460}
      >
        <SupplierForm
          mode={modal.mode}
          initialData={modal.data}
          onClose={() =>
            setModal({
              open: false,
              mode: "add",
              data: null,
            })
          }
          onSubmit={modal.mode === "add" ? handleAdd : handleEditSubmit}
        />
      </Modal>
    </Box>
  );
};

export default SupplierPage;
