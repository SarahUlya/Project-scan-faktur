import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://api.reysprime.my.id/api/v1/",

  
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