import React from "react";
import Table from "../ui/Table";
import useProdukDb from "../../hooks/useProdukDb";

const getColumns = (onEdit, onDelete, getNamaKategori) => [
	{ header: "NAMA PRODUK", accessor: "nama", width: 220, bold: true },
	{
		header: "KATEGORI OBAT",
		accessor: "id_kategori",
		width: 120,
		render: (row) => {
			console.log("Isi row di render:", row);
			return getNamaKategori(row.id_kategori || row.kategori);
		}
	},
	{ header: "SATUAN DASAR", accessor: "satuan", width: 100 },
	{ header: "STOK MINIMUM", accessor: "stokMinimum", width: 100, align: "center" },
	{
		header: "STATUS PRODUK",
		accessor: "status",
		width: 100,
		render: (row) => (
			<span style={{
				background: row.status === "AKTIF" ? "#E6FFF3" : "#F3F6F9",
				color: row.status === "AKTIF" ? "#1BC58D" : "#B0B0B0",
				fontWeight: 700,
				fontSize: 13,
				borderRadius: 8,
				padding: "2px 12px"
			}}>{row.status}</span>
		)
	},
	{
		header: "AKSI",
		accessor: "aksi",
		width: 80,
		render: (row) => (
			<>
				<span
					style={{ cursor: "pointer", marginRight: 8, color: "#B0B0B0" }}
					title="Edit"
					onClick={() => onEdit && onEdit(row)}
				>✏️</span>
				<span
					style={{ cursor: "pointer", color: "#B0B0B0" }}
					title="Hapus"
					onClick={() => onDelete && onDelete(row.id)}
				>🗑️</span>
			</>
		)
	}
];

const ProdukTable = ({ data, onEdit, onDelete, getNamaKategori }) => {
	console.log("DATA TABLE:", data);
	console.log("ROW PERTAMA:", data?.[0]);
	return (
		<Table columns={getColumns(onEdit, onDelete, getNamaKategori)}
			data={data} />
	);
};

export default ProdukTable;
