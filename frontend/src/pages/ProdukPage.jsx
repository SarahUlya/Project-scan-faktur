import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProdukTable from "../components/produk/ProdukTable";
import ProdukDetailModal from "../components/produk/ProdukDetailModal";
import PaginationControls from "../components/ui/PaginationControls";
import useProdukDb from "../hooks/useProdukDb";
import Modal from "../components/ui/Modal";
import ProdukForm from "../components/produk/ProdukForm";
import { Box, Typography, TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

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

	console.log(produk);

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
		setProduk(prev =>
			prev.map(p =>
				p.id_produk === item.id_produk ? { ...p, ...item } : p
			)
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
			data: null
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

return (
	<Box>
		{/* Loading Indicator */}
		{loading && (
			<Box sx={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: "rgba(0,0,0,0.1)",
				backdropFilter: "blur(4px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 9999,
			}}>
				<Box sx={{
					background: "#fff",
					borderRadius: "16px",
					p: 4,
					textAlign: "center",
					boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
					maxWidth: 300,
				}}>
					<Box sx={{ mb: 2, fontSize: 48 }}>📦</Box>
					<Typography sx={{ fontWeight: 800, color: "#1E293B", fontSize: 16, mb: 1 }}>
						Memuat Data Produk
					</Typography>
					<Typography sx={{ color: "#64748B", fontSize: 13 }}>
						Harap tunggu, kami sedang mengambil data produk dan batch...
					</Typography>
					<Box sx={{
						mt: 3,
						height: 4,
						background: "#F1F5F9",
						borderRadius: 2,
						overflow: "hidden",
					}}>
						<Box sx={{
							height: "100%",
							width: "60%",
							background: "linear-gradient(90deg, #0F766E 0%, #EC407A 100%)",
							animation: "loading 1.5s infinite",
							"@keyframes loading": {
								"0%": { width: "20%" },
								"50%": { width: "80%" },
								"100%": { width: "20%" },
							},
						}} />
					</Box>
				</Box>
			</Box>
		)}

		<Box sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 20px 40px rgba(15, 118, 110, 0.08)", p: 3, mb: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3, flexWrap: "wrap" }}>
				<Box sx={{ flex: 1, minWidth: 280 }}>
					<Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
						Master Data Produk
					</Typography>
					<Typography sx={{ color: "#64748B", mt: 1 }}>
						Manajemen katalog obat dan perlengkapan medis.
					</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 2, alignItems: "center", minWidth: 480 }}>
					<TextField
						size="small"
						variant="outlined"
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
						disabled={loading}
						sx={{
							textTransform: "none",
							borderRadius: 3,
							height: 44,
							px: 3,
							fontWeight: 700,
							backgroundColor: "rgb(233, 30, 99)",
							color: "rgb(255, 255, 255)",
							boxShadow: "0 20px 40px rgba(15, 118, 110, 0.2)",
							'&:hover': {
								backgroundColor: "#0D5C56",
							},
							"&:disabled": {
								opacity: 0.5,
							},
						}}
						onClick={handleOpenAdd}
					>
						Input Produk
					</Button>
				</Box>
			</Box>
		</Box>


		<Box sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 20px 40px rgba(15, 118, 110, 0.08)", overflow: "hidden" }}>
			<ProdukTable
				data={produk}
				getNamaKategori={getNamaKategori}
				getNamaSatuan={getNamaSatuan}
				onViewDetail={handleDetail}
				onEdit={handleEdit}
			/>
			<div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<div>Menampilkan {produk.length} dari {total} produk</div>
				<PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
			</div>
		</Box>
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
