import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // This is critical for sending and receiving HttpOnly cookies
});

export default api;
