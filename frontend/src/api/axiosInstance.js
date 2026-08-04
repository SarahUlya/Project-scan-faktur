// import axios from 'axios';

// const axiosInstance = axios.create({
//   // Ganti baseURL ke URL ngrok baru dari temanmu
//   baseURL: "https://stegosaur-reenact-algebra.ngrok-free.dev/api/v1",
//   timeout: 10000, // Matikan request jika dalam 10 detik server tidak merespons
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//   },
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     console.log("INTERCEPTOR TOKEN:", token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://103.117.56.138:3000/api/v1",
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