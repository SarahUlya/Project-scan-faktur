import { useEffect, useState } from "react";
import inventoryService from "../services/inventoryService";
import productService from "../services/productService";

export default function Inventory() {
    const [inventory, setInventory] = useState([]);
    const products = productService.getProducts();

    useEffect(() => {
        const stored = inventoryService.getInventory();
        setInventory(stored);
    }, []);

    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.name : "Unknown Product";
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Inventory Page</h1>

            <h2>Total Stok Per Produk</h2>
            <ul>
                {products.map(p => (
                    <li key={p.id}>
                        {p.name} - {inventoryService.getStockByProductId(p.id)}
                    </li>
                ))}
            </ul>


            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Nama Produk</th>
                        <th>Batch</th>
                        <th>Tanggal Kadaluarsa</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>No inventory data available.</td>
                        </tr>
                    ) : (
                        inventory.map(item => (
                            <tr key={item.id}>
                                <td>{getProductName(item.productId)}</td>
                                <td>{item.batch}</td>
                                <td>{item.expiredDate}</td>
                                <td>{item.qty}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}