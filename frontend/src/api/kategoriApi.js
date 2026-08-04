import api from './axiosInstance';

export const getKategori = async (page = 1, limit = 1000) => {
    const res = await api.get('/kategori', {
        params: {
            page,
            limit
        }
    });
    return res.data;
};