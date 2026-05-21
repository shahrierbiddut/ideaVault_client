import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    timeout: 10000,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("ideavault_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        if (response.config.url && response.config.url.includes('/public/home-content')) {
            console.log("Axios response interceptor - home-content:", JSON.stringify(response.data).substring(0, 300));
        }
        return response;
    },
    (error) => {
        console.log("Axios error:", error.message);
        return Promise.reject(error);
    }
);

export default apiClient;