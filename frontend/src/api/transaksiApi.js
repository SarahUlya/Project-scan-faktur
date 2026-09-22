import axiosInstance from "./axiosInstance";

/* ══════════════════════════════════════════════════════════════════
 * TRANSAKSI
 * ══════════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════════
 * SHIFT
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Cek shift aktif.
 * Response: { active: boolean, data: ShiftObject | null }
 */
export const getShiftAktifApi = async () => {
  try {
    const res = await axiosInstance.get("/shift/active");
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return { active: false, data: null };
    }
    throw err;
  }
};

/**
 * Buka shift baru.
 * Body: { modal_awal: number }
 */
export const bukaShiftApi = async (payload) => {
  const res = await axiosInstance.post("/shift/buka", payload);
  return res.data;
};

/**
 * Tutup shift.
 * Body: { id_shift, modal_akhir }
 */
export const tutupShiftApi = async (payload) => {
  const res = await axiosInstance.put("/shift/tutup", payload);
  return res.data;
};

/**
 * Daftar semua shift (riwayat).
 * Query: { start_date, end_date, id_user, status, page, limit }
 * Response: { data: [...], pagination: {...} }
 */
export const getShiftListApi = async (params = {}) => {
  const res = await axiosInstance.get("/shift", { params });
  return res.data;
};

/**
 * Detail 1 shift + transaksi di dalamnya.
 * Response: { data: { ...shift, transaksi: [...] } }
 */
export const getShiftDetailApi = async (id) => {
  const res = await axiosInstance.get(`/shift/${id}`);
  return res.data;
};

/* ══════════════════════════════════════════════════════════════════
 * KAS KECIL
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Catat kas kecil baru.
 * Body: {
 *   id_shift, id_user, nama_kasir,
 *   tipe: "masuk"|"keluar", nominal,
 *   keterangan, waktu_transaksi
 * }
 */
export const createKasKecil = async (payload) => {
  const res = await axiosInstance.post("/kas-kecil", payload);
  return res.data;
};

/**
 * Daftar riwayat kas kecil.
 * Query: { id_shift, tanggal, page, limit }
 * Response: { data: [...], pagination?: {...} }
 */
export const getKasKecilListApi = async (params = {}) => {
  const res = await axiosInstance.get("/kas-kecil", { params });
  return res.data;
};