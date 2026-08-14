import axiosInstance from "./axiosInstance";

export const createTransaksi = async (payload) => {
  const res = await axiosInstance.post("/transaksi", payload);
  return res.data;
};

export const getTransaksi = async () => {
  const res = await axiosInstance.get("/transaksi");
  return res.data;
};

export const getTransaksiDetail = async (id) => {
  const res = await axiosInstance.get(`/transaksi/${id}`);
  return res.data;
};
