import axiosInstance from "./axiosInstance";

export const getPembelian = async (
  page = 1,
  limit = 10,
  search = "",
) => {
  const res = await axiosInstance.get("/pembelian", {
    params: {
      page,
      limit,
      search,
    },
  });

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