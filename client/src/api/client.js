import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://physiopath-server-uv04.onrender.com'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('therapistToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
