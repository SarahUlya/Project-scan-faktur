import { useState, useEffect } from 'react';
import { formatRupiah } from '../utils/formatCurrency';

export default function Product({  }) {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({
        name: "",
        category: "",
        unit: "",
        price: ""
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("products");
        if (saved) {
            const parsed = JSON.parse(saved);
            setProducts(parsed);
        }
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem("products", JSON.stringify(products));
        }
    }, [products]);

    const handleChange = (e) => {
        setForm({
            name: "",
            category: "",
            unit: "",
            price: "",
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            const updated = products.map(p => p.id === editingId ?
                { ...p, ...form, price: Number(form.price) } : p);
            setProducts(updated);
            setEditingId(null);
        } else {
            const newProduct = {
                id: Date.now().toString(),
                name: form.name,
                category: form.category,
                unit: form.unit,
                price: Number(form.price),
                createdAt: new Date().toISOString(),
            };

            setProducts([...products, newProduct]);
        }
        setForm({
            name: "",
            category: "",
            unit: "",
            price: ""
        });
    };

    const handleEdit = (product) => {
        setForm({
            name: product.name || "",
            category: product.category || "",
            unit: product.unit || "",
            price: product.price ?? ""
        });
        setEditingId(product.id);
    };

    const handleDelete = (id) => {
        const filtered = products.filter(p => p.id !== id);
        setProducts(filtered);
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.unit.toLowerCase().includes(search.toLowerCase()) ||
        p.price.toString().includes(search)
    );

    return (
        <div style={{ padding: "20px" }}>
            <h1>Product Page</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nama Produk"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Kategori Produk"
                    value={form.category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="unit"
                    placeholder="Satuan Produk"
                    value={form.unit}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Harga Produk"
                    value={form.price ?? ""}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {editingId ? "Update" : "Tambah"}
                </button>
            </form>

            <hr />

            <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Satuan</th>
                        <th>Harga</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>Tidak ada produk</td>
                        </tr>
                    ) : (
                        filtered.map((product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.unit}</td>
                                <td>{formatRupiah(product.price)}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)}>Edit</button>
                                    <button onClick={() => handleDelete(product.id)}>Hapus</button>
                                </td>
                            </tr>
                        ))
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

