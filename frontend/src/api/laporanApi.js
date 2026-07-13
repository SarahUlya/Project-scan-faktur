import axiosInstance from "./axiosInstance";

const requestLaporan = async (endpoint, params = {}) => {
  const response = await axiosInstance.get(endpoint, { params });
  return response.data;
};

export const getLaporanPenjualan = async (params = {}) => {
  return requestLaporan("/laporan/penjualan", params);
};

export const getLaporanProdukTerlaris = async (params = {}) => {
  return requestLaporan("/laporan/produk-terlaris", params);
};

export const getLaporanTidakLaku = async (params = {}) => {
  return requestLaporan("/laporan/tidak-laku", params);
};
