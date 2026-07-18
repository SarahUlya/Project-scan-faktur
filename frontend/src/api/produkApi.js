import axiosInstance from "./axiosInstance";

export const getProduk = async (page = 1, limit = 25, search = "") => {
  const res = await axiosInstance.get("/produk", {
    params: {
      page,
      limit,
      search,
    },
  });

  return res.data;
};

export const addProdukApi = async (data) => {
  const res = await axiosInstance.post("/produk", data);

  return res.data;
};

export const updateProdukApi = async (id, data) => {
  const res = await axiosInstance.put(`/produk/${id}`, data);

  return res.data;
};

