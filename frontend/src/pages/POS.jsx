import { useState } from "react";
import productService from "../services/productService";
import inventoryService from "../services/inventoryService";
import transactionService from "../services/transactionService";

export default function POS() {
    const products = productService.getProducts();
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleSell = () => {
        if (!selectedProductId) {
            alert("Please select a product.");
            return;
        }
        if (!quantity || Number(quantity) <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        const currentStock = inventoryService.getStockByProductId(selectedProductId);
        if (currentStock < Number(quantity)) {
            alert("Insufficient stock for this product.");
            return;
        }

        const product = products.find(p => p.id === selectedProductId);

        inventoryService.reduceStock(selectedProductId, Number(quantity));

        const saleTransaction = {
            id: Date.now().toString(),
            productId: selectedProductId,
            productName: product.name,
            qty: Number(quantity),
            total: product.price * Number(quantity),
            type: "sale",
            date: new Date().toISOString(),
        };
        transactionService.addTransaction(saleTransaction);
        alert("Transaction successful!");
        setQuantity("");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>POS - Penjualan</h1>

            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                <option value="">Pilih Produk</option>
                {products.map(p => {
                    const stock = inventoryService.getStockByProductId(p.id);
                    return (
                        <option key={p.id} value={p.id} disabled={stock === 0}>
                            {p.name} (Stock: {stock})
                        </option>
                    );
                })}
            </select>

            <input
                type="number"
                placeholder="Jumlah"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />

            <button onClick={handleSell}>Jual</button>
        </div>
    );

}