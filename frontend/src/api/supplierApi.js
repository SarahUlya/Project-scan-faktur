import api from "./axiosInstance";

export const getSupplier = async () => {
  return api.get("/supplier");
};