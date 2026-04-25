import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://stegosaur-reenact-algebra.ngrok-free.dev/api/v1",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("INTERCEPTOR TOKEN:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);


export default axiosInstance;