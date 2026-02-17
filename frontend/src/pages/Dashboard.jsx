import { useNavigate } from "react-router-dom";
import transactionService from "../services/transactionService";
import { useState, useEffect } from "react";

export default function Dashboard({ setIsLogin }) {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const stored = transactionService.getTransactions()
      .filter(t => t.type === "PURCHASE");
    setTransactions(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(false);
    navigate("/");
  }

  const totalFaktur = transactions.length;
  const totalQty = transactions.reduce((sum, transaction) => sum + (transaction.qty || 0), 0);

  const supplierSet = [...new Set(transactions.map(t => t.supplier))].length;

  console.log("Dashboard menerima:", transactions);
  console.log("ISI TRANSAKSI:", transactions);

  return (
    <>
      <div>
        <h2>Welcome to the Dashboard</h2>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Ringkasan</h3>
        <p>Total Faktur: {totalFaktur}</p>
        <p>Total Qty: {totalQty}</p>
        <p>Jumlah Supplier: {supplierSet}</p>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor Faktur</th>
            <th>Tanggal</th>
            <th>Supplier</th>
            <th>Total Qty</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction.id}>
              <td>{index + 1}</td>
              <td>{transaction.invoiceNumber}</td>
              <td>{new Date(transaction.date).toLocaleString()}</td>
              <td>{transaction.supplier}</td>
              <td>{transaction.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleLogout}>
        Logout
      </button>

      <button onClick={() => navigate("/sales")}>
        Lihat Penjualan
      </button>

    </>
  );
}