import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Scan from "./pages/Scan"
import Login from "./pages/Login"
import Products from "./pages/Products"
import Inventory from "./pages/inventory"
import POS from "./pages/POS"
import Sales from "./pages/Sales"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"

function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === "true")
  const [fakturList, setFakturList] = useState(() => {
    const saved = localStorage.getItem("fakturList");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("fakturList", JSON.stringify(fakturList));
  }, [fakturList]);

  console.log("App state:", fakturList);

  return (
    <BrowserRouter>
    {isLogin && <Navbar />}
      <Routes>
        <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
        <Route path="/dashboard" element={isLogin ? <Dashboard setIsLogin={setIsLogin} fakturList={fakturList} /> : <Navigate to="/" />} />
        <Route path="/scan" element={isLogin ? <Scan setIsLogin={setIsLogin} setFakturList={setFakturList} /> : <Navigate to="/" />} />
        <Route path="/product" element={isLogin ? <Products setIsLogin={setIsLogin} /> : <Navigate to="/" />} />
        <Route path="/inventory" element={isLogin ? <Inventory setIsLogin={setIsLogin} /> : <Navigate to="/" />} />
        <Route path="/pos" element={isLogin ? <POS setIsLogin={setIsLogin} /> : <Navigate to="/" />} />
        <Route path="/sales" element={isLogin ? <Sales setIsLogin={setIsLogin} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
