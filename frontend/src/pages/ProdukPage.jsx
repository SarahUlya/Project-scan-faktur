import React, { useState } from "react";
import ProdukTable from "../components/produk/ProdukTable";
import Button from "../components/ui/Button";
import useProdukDb from "../hooks/useProdukDb";
import Modal from "../components/ui/Modal";
import ProdukForm from "../components/produk/ProdukForm";
import HapusProdukConfirm from "../components/produk/HapusProdukConfirm";
import { Box } from "@mui/material";
import { getNewId } from "../utils/helpers";

const PAGE_SIZE = 10;

const ProdukPage = () => {
	const {
		produk,
		kategori,
		getNamaKategori,
		loading,
		add,
		update,
		remove,
		search,
		setSearch,
		pagedProduk,
		page,
		setPage
	} = useProdukDb(); 
	
	const [modal, setModal] = useState({ open: false, mode: "add", data: null });
	const [hapus, setHapus] = useState({ open: false, data: null });

	const total = produk.length;
	const totalPages = Math.ceil(total / PAGE_SIZE);


	const handleAdd = (item) => {
		add({ ...item, id: getNewId(produk, "PRD") });
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
		const data = produk.find((p) => p.id === id);
		setHapus({ open: true, data });
	};
	const handleDeleteConfirm = () => {
		if (hapus.data) remove(hapus.data.id);
		setHapus({ open: false, data: null });
	};

	return (
		<Box>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 15 }}>
				<input
					type="text"
					placeholder="🔍 Cari produk (nama / kode / kategori)..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{
						flex: 1,
						padding: "10px 14px",
						borderRadius: 10,
						border: "1px solid #ddd",
						outline: "none",
						fontSize: 14
					}}
				/>
				<Button color="pink" sx={{ fontWeight: 700, fontSize: 15, borderRadius: 2, px: 3, py: 1.5 }}
					onClick={() => setModal({ open: true, mode: "add", data: null })}>
					+ Input Produk
				</Button>
			</div>

			<div style={{ background: "#fff", borderRadius: 16, padding: 0, boxShadow: "0 2px 8px #f3f6f9", overflow: "hidden" }}>
				<ProdukTable data={pagedProduk}
					getNamaKategori={getNamaKategori} onEdit={handleEdit} onDelete={handleDelete} />
			</div>
			<div style={{ marginTop: 16, color: "#B0B0B0", fontSize: 14 }}>
				Menampilkan {pagedProduk.length} dari {total} produk
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
				<ProdukForm
					mode={modal.mode}
					initialData={modal.data}
					kategori={kategori}
					onClose={() => setModal({ open: false, mode: "add", data: null })}
					onSubmit={modal.mode === "add" ? handleAdd : handleEditSubmit}
				/>
			</Modal>

			<Modal open={hapus.open} onClose={() => setHapus({ open: false, data: null })} width={400}>
				<HapusProdukConfirm
					open={hapus.open}
					onClose={() => setHapus({ open: false, data: null })}
					onDelete={handleDeleteConfirm}
					produk={hapus.data}
				/>
			</Modal>
		</Box>
	);
};

export default ProdukPage;
