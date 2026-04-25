import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import api from "../api/axiosInstance";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) setUsername(savedUsername);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("LOGIN DATA:", username, password);

      // 🔹 1. login
      const res = await login({ username, password });
      const token = res.data.token;

      localStorage.setItem("token", token);

      // 🔹 2. ambil user
      const me = await api.get("/auth/login", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ME RESPONSE:", me.data);

      localStorage.setItem("user", JSON.stringify(me.data.user));

      console.log("USER DISIMPAN:", localStorage.getItem("user"));

      navigate("/");
      window.location.reload();

    } catch (err) {
      console.log(err);
      setError("Login gagal");
    }
  };

  return {
    username, setUsername,
    password, setPassword,
    error, setError,
    rememberMe, setRememberMe,
    showPassword, setShowPassword,
    handleLogin
  };
};