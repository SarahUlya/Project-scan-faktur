import api from "./axiosInstance";

export const getSupplier = async () => {
  return api.get("/supplier");
};

export const createSupplier = async (data) => {
  try {
    const res = await api.post("/supplier", data);
    console.log("SUCCESS:", res.data);
    return res.data;
  } catch (err) {
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
    console.log("FULL:", err.response);
    throw err;
  }
};