import React from "react";
import { Box, Typography } from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";

const ProductCard = ({ item, getNamaKategori, getNamaSatuan }) => {
	return (
		<Box
			sx={{
				background: "#fff",
				borderRadius: 4,
				p: 2,
				border: "1px solid #F1F5F9",
			}}
		>
			<Box
				sx={{
					height: 120,
					bgcolor: "#F8FAFC",
					borderRadius: 3,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					mb: 2,
				}}
			>
				<MedicationIcon
					sx={{
						fontSize: 48,
						color: "#CBD5E1",
					}}
				/>
			</Box>

			<Typography fontSize={12}>
				{getNamaKategori(item.id_kategori)}
			</Typography>

			<Typography fontWeight={700}>
				{item.nama_produk}
			</Typography>

			<Typography fontSize={13}>
				{getNamaSatuan(item.id_satuan)}
			</Typography>

			<Typography
				sx={{
					mt: 2,
					color: "#0F766E",
					fontWeight: 700,
				}}
			>
				Rp {item.harga_jual}
			</Typography>
		</Box>
	);
};

export default ProductCard;