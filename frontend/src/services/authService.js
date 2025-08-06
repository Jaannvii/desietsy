import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL;

const register = (data) => axios.post(`${API_URL}/auth/register`, data);
const verifyEmail = (token) =>
    axios.get(`${API_URL}/auth/verify-email/${token}`);
const login = (data) => axios.post(`${API_URL}/auth/login`, data);
const getMe = () => axios.get(`${API_URL}/auth/me`);
const logout = () => axios.get(`${API_URL}/auth/logout`);
const forgotPassword = (data) =>
    axios.post(`${API_URL}/auth/forgot-password`, data);
const resetPassword = (token, data) =>
    axios.post(`${API_URL}/auth/reset-password/${token}`, data);

export {
    register,
    verifyEmail,
    login,
    getMe,
    logout,
    forgotPassword,
    resetPassword,
};
