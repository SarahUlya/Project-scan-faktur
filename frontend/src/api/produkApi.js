import { axiosInstance } from "./axiosInstance";

export const getProduk = async (search = "") => {
  try {
    const res = await axiosInstance.get(`/produk`, {
      params: {
        page: 1,
        limit: 10,
        search: search,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error ambil produk:", err);
  }
};