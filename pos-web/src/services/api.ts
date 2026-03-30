import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response) {
            const responseData = error.response.data;
            // Extract message from keys like "Duplicate Resource" or a "message" field
            const message = typeof responseData === 'object' && responseData !== null
                ? Object.values(responseData).join(' ')
                : responseData;

            if (message) {
                error.message = message;
            }
        }
        return Promise.reject(error);
    }
);

export default api;