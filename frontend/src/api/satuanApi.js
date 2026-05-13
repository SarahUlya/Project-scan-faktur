import axiosInstance from "./axiosInstance";

export const getSatuan = async () => {
  const res = await axiosInstance.get("/satuan");
  return res.data;
};