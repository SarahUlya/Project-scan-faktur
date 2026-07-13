import axiosInstance from "./axiosInstance";

export const getPembelian = async (page = 1) => {
  const res = await axiosInstance.get(
    "/pembelian",
    {
      params: {
        page,
      },
    }
  );

  return res.data;
};

export const getPembelianDetail = async (id) => {
  const res = await axiosInstance.get(`/pembelian/${id}`);
  return res.data;
};

export const createPembelian = async (data) => {
  const res = await axiosInstance.post("/pembelian", data);
  return res.data;
};