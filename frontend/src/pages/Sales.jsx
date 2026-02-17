import { useState, useEffect } from "react";
import transactionService from "../services/transactionService";
import { formatRupiah } from "../utils/formatCurrency";

export default function Sales() {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const stored = transactionService.getTransactions()
            .filter(t => t.type === "sale");
        setSales(stored);
    }, []);

    const totalQty = sales.reduce((sum, sale) => sum + (sale.qty || 0), 0);
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Laporan Penjualan</h1>

            <div style={{ marginBottom: "20px" }}>
                <p>Total Transaksi: {sales.length}</p>
                <p>Total Quantity Terjual: {totalQty}</p>
                <p>Total Revenue:  {formatRupiah(totalRevenue)}</p>
            </div>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Produk</th>
                        <th>Tanggal</th>
                        <th>Quantity</th>
                        <th>Total Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale, index) => (
                        <tr key={sale.id}>
                            <td>{index + 1}</td>
                            <td>{sale.productName}</td>
                            <td>{new Date(sale.date).toLocaleString()}</td>
                            <td>{sale.qty}</td>
                            <td>Rp {sale.total?.toLocaleString()}</td>
                        </tr>
                    ))}
                    {sales.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>Belum ada transaksi penjualan.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}