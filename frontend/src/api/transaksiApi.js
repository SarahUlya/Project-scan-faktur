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

export const verifikasiTransaksi = async (id) => {
  const res = await axiosInstance.patch(`/transaksi/${id}/verifikasi`);
  return res.data;
};

export const returTransaksi = async (id, payload = {}) => {
  const res = await axiosInstance.post(`/transaksi/${id}/retur`, payload);
  return res.data;
};

export const batalkanTransaksi = async (id) => {
  const res = await axiosInstance.patch(`/transaksi/${id}/batal`);
  return res.data;
};

// 🟢 Kas Kecil & Shift dengan Handling Fallback 404
export const createKasKecil = async (payload) => {
  const res = await axiosInstance.post("/kas-kecil", payload);
  return res.data;
};

export const getShiftAktifApi = async () => {
  try {
    const res = await axiosInstance.get("/shift/active");   // ← "active"
    return res.data; // { active: boolean, data: {...} | null }
  } catch (err) {
    if (err.response?.status === 404) {
      return { active: false, data: null };
    }
    throw err;
  }
};

export const bukaShiftApi = async (payload) => {
  const res = await axiosInstance.post("/shift/buka", payload);
  return res.data;
};

export const tutupShiftApi = async (payload) => {
  const res = await axiosInstance.put("/shift/tutup", payload);   // ← PUT
  return res.data;
};