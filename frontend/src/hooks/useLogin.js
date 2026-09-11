import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import api from "../api/axiosInstance";

const resolveLoginError = (err) => {
  if (!err.response) {
    return "Server error atau tidak dapat terhubung. Periksa koneksi internet Anda.";
  }

  const status = err.response.status;
  const msg = String(
    err.response.data?.message ||
      err.response.data?.error ||
      err.response.data?.msg ||
      ""
  ).toLowerCase();

  if (status === 403 || msg.includes("nonaktif") || msg.includes("inactive")) {
    return "Akun nonaktif. Hubungi administrator untuk mengaktifkan akun.";
  }

  if (
    status === 401 ||
    status === 400 ||
    msg.includes("password") ||
    msg.includes("username") ||
    msg.includes("kredensial") ||
    msg.includes("salah")
  ) {
    return "Kredensial salah. Periksa username dan password Anda.";
  }

  if (status >= 500) {
    return "Server error. Coba lagi beberapa saat.";
  }

  return err.response.data?.message || "Login gagal. Silakan coba lagi.";
};

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
    setError("");

    try {
      const res = await login({ username, password });
      const token = res.data.token;

      localStorage.setItem("token", token);

      const me = await api.get("/auth/login", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(me.data.user));

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      localStorage.removeItem("currentShift");

      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(resolveLoginError(err));
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    setError,
    rememberMe,
    setRememberMe,
    showPassword,
    setShowPassword,
    handleLogin,
  };
};
