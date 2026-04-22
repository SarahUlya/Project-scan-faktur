import React, { useState } from "react";
import SupplierTable from "../components/supplier/SupplierTable";
import Button from "../components/ui/Button";
import useSupplierDb from "../hooks/useSupplierDb";
import Modal from "../components/ui/Modal";
import SupplierForm from "../components/supplier/SupplierForm";
import HapusSupplierConfirm from "../components/supplier/HapusSupplierConfirm";
import { Box } from "@mui/material";
import { getNewId } from "../utils/helpers";

const PAGE_SIZE = 10;



const SupplierPage = () => {
	const { supplier, loading, add, update, remove } = useSupplierDb();
	const [page, setPage] = useState(1);
	const [modal, setModal] = useState({ open: false, mode: "add", data: null });
	const [hapus, setHapus] = useState({ open: false, data: null });

	const total = supplier.length;
	const totalPages = Math.ceil(total / PAGE_SIZE);
	const pagedSupplier = supplier.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
	const handleDelete = (id) => {
		const data = supplier.find((s) => s.id === id);
		setHapus({ open: true, data });
	};
	const handleDeleteConfirm = () => {
		if (hapus.data) remove(hapus.data.id);
		setHapus({ open: false, data: null });
	};

	return (
		<Box>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
				<div>
					<h2 style={{ margin: 0, fontWeight: 800, fontSize: 24 }}>Manajemen Data Supplier</h2>
					<div style={{ color: "#B0B0B0", fontSize: 15, marginTop: 4 }}>Kelola informasi mitra pemasok obat dan alkes.</div>
				</div>
				<Button color="pink" sx={{ fontWeight: 700, fontSize: 15, borderRadius: 2, px: 3, py: 1.5 }} onClick={() => setModal({ open: true, mode: "add", data: null })}>
					+ Tambah Supplier
				</Button>
			</div>
			<div style={{ background: "#fff", borderRadius: 16, padding: 0, boxShadow: "0 2px 8px #f3f6f9", overflow: "hidden" }}>
				<SupplierTable data={pagedSupplier} onEdit={handleEdit} onDelete={handleDelete} />
			</div>
			<div style={{ marginTop: 16, color: "#B0B0B0", fontSize: 14 }}>
				Menampilkan {pagedSupplier.length} dari {total} supplier
			</div>
			<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
				<div style={{ display: "flex", gap: 8 }}>
					{Array.from({ length: totalPages }, (_, i) => (
						<Button
							key={i + 1}
							color="pink"
							variant={page === i + 1 ? "contained" : "outlined"}
							sx={{ minWidth: 36, px: 0, borderRadius: 8, fontWeight: 700, fontSize: 15 }}
							onClick={() => setPage(i + 1)}
						>
							{i + 1}
						</Button>
					))}
				</div>
			</div>
			<Modal open={modal.open} onClose={() => setModal({ open: false, mode: "add", data: null })} width={460}>
				<SupplierForm
					mode={modal.mode}
					initialData={modal.data}
					onClose={() => setModal({ open: false, mode: "add", data: null })}
					onSubmit={modal.mode === "add" ? handleAdd : handleEditSubmit}
				/>
			</Modal>

			<Modal open={hapus.open} onClose={() => setHapus({ open: false, data: null })} width={400}>
				<HapusSupplierConfirm
					open={hapus.open}
					onClose={() => setHapus({ open: false, data: null })}
					onDelete={handleDeleteConfirm}
					supplier={hapus.data}
				/>
			</Modal>
		</Box>
	);
};

export default SupplierPage;
