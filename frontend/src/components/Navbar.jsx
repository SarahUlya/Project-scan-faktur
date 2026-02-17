import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <div style={{display: "flex", gap: "15px", padding: "15px", background: "#222", color: "white"}}>
            <button onClick={() => navigate("/product")} >Produk</button>
            <button onClick={() => navigate("/dashboard")} >Dashboard</button>
            <button onClick={() => navigate("/scan")} >Scan</button>
            <button onClick={() => navigate("/inventory")} >Inventory</button>
            <button onClick={() => navigate("/pos")} >POS</button>
            <button onClick={() => navigate("/sales")} >Sales</button>
        </div>
    );
}