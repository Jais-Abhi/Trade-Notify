import axios from 'axios';

const api = axios.create({
    baseURL: 'https://trade-notify.vercel.app/api',
    // baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export default api;
