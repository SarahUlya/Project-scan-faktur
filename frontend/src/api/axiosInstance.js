import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://103.117.56.138:3000/api/v1/",
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