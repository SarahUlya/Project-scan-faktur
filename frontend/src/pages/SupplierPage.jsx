import React, { useState } from "react";
import SupplierTable from "../components/supplier/SupplierTable";
import PaginationControls from "../components/ui/PaginationControls";
import useSupplierDb from "../hooks/useSupplierDb";
import Modal from "../components/ui/Modal";
import SupplierForm from "../components/supplier/SupplierForm";
import { Box, Typography, TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { getNewId } from "../utils/helpers";

const PAGE_SIZE = 25;



const SupplierPage = () => {
	const { supplier, loading, add, update, remove } = useSupplierDb();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [modal, setModal] = useState({ open: false, mode: "add", data: null });

	const filteredSupplier = supplier.filter((item) => {
		const query = search.toLowerCase();
		return (
			(item.namaSupplier || "").toLowerCase().includes(query) ||
			(item.alamat || "").toLowerCase().includes(query) ||
			(item.telepon || "").toLowerCase().includes(query)
		);
	});

	const total = filteredSupplier.length;
	const totalPages = Math.ceil(total / PAGE_SIZE);
	const pagedSupplier = filteredSupplier.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const handleAdd = (item) => {
		add({ ...item, id: getNewId(supplier, "SUP") });
		setModal({ open: false, mode: "add", data: null });
	};
	const handleEdit = (item) => {
		setModal({ open: true, mode: "edit", data: item });
	};
	const handleEditSubmit = (item) => {
		update(item);
		setModal({ open: false, mode: "edit", data: null });
	};
	const handleSearch = (value) => {
		setSearch(value);
		setPage(1);
	};

	return (
		<Box>
			<Box sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 20px 40px rgba(233, 30, 99, 0.08)", p: 3, mb: 3 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3, flexWrap: "wrap" }}>
					<Box sx={{ flex: 1, minWidth: 280 }}>
						<Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
							Data Supplier
						</Typography>
						<Typography sx={{ color: "#64748B", mt: 1 }}>
							Kelola informasi mitra pemasok obat dan alkes.
						</Typography>
					</Box>

					<Box sx={{ display: "flex", gap: 2, alignItems: "center", minWidth: 480 }}>
						<TextField
							size="small"
							variant="outlined"
							placeholder="Cari supplier, alamat, atau telepon..."
							value={search}
							onChange={(e) => handleSearch(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon sx={{ color: "#94A3B8" }} />
									</InputAdornment>
								),
								sx: {
									borderRadius: 3,
									background: "#F8F8FB",
									height: 44,
								},
							}}
							sx={{ flex: 1, minWidth: 240 }}
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
								backgroundColor: "rgb(233, 30, 99)",
								color: "rgb(255, 255, 255)",
								boxShadow: "0 20px 40px rgba(233, 30, 99, 0.2)",
								'&:hover': {
									backgroundColor: "#d81b60",
								},
							}}
							onClick={() => setModal({ open: true, mode: "add", data: null })}
						>
							Tambah Supplier
						</Button>
					</Box>
				</Box>
			</Box>

			<Box sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 20px 40px rgba(233, 30, 99, 0.08)", overflow: "hidden" }}>
				<SupplierTable data={pagedSupplier} onEdit={handleEdit} />
				<div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div>Menampilkan {pagedSupplier.length} dari {total} supplier</div>
					<PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
				</div>
			</Box>
			<Modal open={modal.open} onClose={() => setModal({ open: false, mode: "add", data: null })} width={460}>
				<SupplierForm
					mode={modal.mode}
					initialData={modal.data}
					onClose={() => setModal({ open: false, mode: "add", data: null })}
					onSubmit={modal.mode === "add" ? handleAdd : handleEditSubmit}
				/>
			</Modal>

		</Box>
	);
};

export default SupplierPage;
