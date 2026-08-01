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

// Pembatalan transaksi
export const cancelTransaksiRequest = async (transaksiId, userId, alasan) => {
  const res = await axiosInstance.post(`/transaksi/${transaksiId}/cancel-request`, {
    userId,
    alasan: alasan || "Pembatalan oleh kasir/staff"
  });
  return res.data;
};

export const approveCancellation = async (transaksiId, adminId) => {
  const res = await axiosInstance.post(`/transaksi/${transaksiId}/approve-cancellation`, {
    adminId
  });
  return res.data;
};

export const rejectCancellation = async (transaksiId, adminId) => {
  const res = await axiosInstance.post(`/transaksi/${transaksiId}/reject-cancellation`, {
    adminId
  });
  return res.data;
};