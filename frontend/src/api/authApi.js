import api from './axiosInstance';

export const login = async (data) => {
    return api.post('/auth/login', data);
};

export const getMe = async () => {
    return api.get('/auth/login');
}