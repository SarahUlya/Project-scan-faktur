import { useState } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
import transactionService  from "../services/transactionService";
import inventoryService from "../services/inventoryService";

export default function Scan({ }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [jumlah, setJumlah] = useState("");
  const navigate = useNavigate();
  const storedProducts = productService.getProducts();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please select a JPG, PNG, or PDF file.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    if (!selectedProductId) {
      alert("Please select a product.");
      return;
    }
    if (!jumlah) {
      alert("Please enter the quantity.");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (storedProducts.length === 0) {
        alert("Data produk kosong!");
        setLoading(false);
        return;
      }
      const product = storedProducts.find(p => p.id === selectedProductId);
      if (!product) {
        alert("Product not found");
        setLoading(false);
        return;
      }

      inventoryService.addStock(selectedProductId, Number(jumlah), `Batch-${Date.now()}`, "2025-12-31");

      const newTransaction = {
        id: Date.now().toString(),
        productId: selectedProductId,
        productName: product.name,
        qty: Number(jumlah),
        supplier: "Supplier Random",
        invoiceNumber: `INV-${Math.floor(Math.random() * 1000)}`,
        type: "PURCHASE",
        date: new Date().toISOString(),
      };
      transactionService.addTransaction(newTransaction);
      setLoading(false);
      alert("File uploaded successfully!");

      navigate("/dashboard");
    }, 2000);

  };

  const handleRemove = () => {
    setFile(null);
    setError("");
  };

  console.log(storedProducts);

  return (
    <div>
      <h2>Welcome to the Scan Faktur</h2>

      <input type="file" onChange={handleFileChange} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {file && (
        <div style={{ marginTop: "10px" }}>
          <p>Pilih File: {file.name}</p>
          <button onClick={handleRemove}>Remove</button>
        </div>
      )}

      <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
        <option value="">Pilih Product</option>
        {storedProducts.map((p) => {
          const stock = inventoryService.getStockByProductId(p.id);
          return (
            <option key={p.id} value={p.id}>
              {p.name} (Stok: {stock})
            </option>
          );
        })}
      </select>

      <input
        type="number"
        placeholder="Jumlah"
        value={jumlah}
        onChange={(e) => setJumlah(e.target.value)}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}