import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Scan from "./pages/Scan"
import Login from "./pages/Login"
import { useState } from "react"

function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === "true")

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
        <Route path="/dashboard" element={isLogin ? <Dashboard setIsLogin={setIsLogin} /> : <Navigate to="/" />} />
        <Route path="/scan" element={isLogin ? <Scan /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
