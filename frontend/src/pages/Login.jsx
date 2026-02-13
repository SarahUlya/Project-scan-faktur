import { useNavigate } from "react-router-dom";

export default function Login({ setIsLogin }) {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    localStorage.setItem("isLogin", "true");
    setIsLogin(true);
    navigate("/dashboard");
  }
  
  return (
    <div>
      <h2>Halaman Login</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
