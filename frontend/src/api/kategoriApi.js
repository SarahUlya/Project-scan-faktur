import api from './axiosInstance';

export const getKategori = async () => {
    const res = await api.get('/kategori');
    return res.data;
};