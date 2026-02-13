import { useNavigate } from "react-router-dom";

export default function Dashboard({ setIsLogin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(false);
    navigate("/");
  }

  const dataFaktur = [
    { id: 1, nomor: "F001", tanggal: "2024-01-01", supplier: "PT Maju Jaya", total: 100000 },
    { id: 2, nomor: "F002", tanggal: "2024-01-02", supplier: "CV Sukses Abadi", total: 200000 },
    { id: 3, nomor: "F003", tanggal: "2024-01-03", supplier: "UD Makmur", total: 150000 },
  ];

  const totalFaktur = dataFaktur.length;
  const totalNilai = dataFaktur.reduce((sum, faktur) => sum + faktur.total, 0);

  const supplierSet = [...new Set(dataFaktur.map(faktur => faktur.supplier))].length;

  return (
    <>
      <div>
        <h2>Welcome to the Dashboard</h2>
      </div>

      <div style={{marginBottom: "20px"}}>
        <h3>Ringkasan</h3>
        <p>Total Faktur: {totalFaktur}</p>
        <p>Total Nilai: Rp {totalNilai.toLocaleString()}</p>
        <p>Jumlah Supplier: {supplierSet}</p>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor Faktur</th>
            <th>Tanggal</th>
            <th>Supplier</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {dataFaktur.map((faktur) => (
            <tr key={faktur.id}>
              <td>{faktur.id}</td>
              <td>{faktur.nomor}</td>
              <td>{faktur.tanggal}</td>
              <td>{faktur.supplier}</td>
              <td>{faktur.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}