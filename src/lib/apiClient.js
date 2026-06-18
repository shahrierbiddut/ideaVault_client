import axios from "axios";

const getServerErrorMessage = (data) => {
    if (!data) return null;
    if (typeof data === "string") return data;
    if (Array.isArray(data?.error)) {
        return data.error.map((item) => item?.msg || item?.message || String(item)).filter(Boolean).join(" | ");
    }
    return data?.error || data?.message || null;
};

const getNormalizedRequestPath = (requestPath = "") => {
    if (!requestPath) return "";

    try {
        const url = requestPath.startsWith("http") ? new URL(requestPath) : new URL(requestPath, "http://localhost");
        return url.pathname;
    } catch {
        return requestPath.split("?")[0];
    }
};

const isProtectedRequest = (method, path) => {
    if (!path) return false;

    if (path === "/auth/me") return true;
    if (path.startsWith("/users")) return true;
    if (path.startsWith("/interactions")) return true;
    if (path.startsWith("/ideas/my-ideas")) return true;
    if ((path === "/ideas" || path.startsWith("/ideas/")) && method !== "GET") return true;
    if ((path === "/comments" || path.startsWith("/comments/")) && method !== "GET") return true;

    return false;
};

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, "");

if (typeof window !== "undefined") {
    const isLocalHttpsMismatch = normalizedBaseUrl.includes("https://localhost") || normalizedBaseUrl.includes("https://127.0.0.1");
    if (isLocalHttpsMismatch) {
        console.warn("[apiClient] Localhost API URL is using HTTPS. If your server is HTTP, change NEXT_PUBLIC_API_URL to http://localhost:<port>/api");
    }
}

const apiClient = axios.create({
    baseURL: normalizedBaseUrl,
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
    (response) => response,
    (error) => {
        const method = (error?.config?.method || "GET").toUpperCase();
        const requestPath = error?.config?.url || "";
        const normalizedRequestPath = getNormalizedRequestPath(requestPath);
        const url = error?.config?.baseURL && requestPath ? `${error.config.baseURL}${requestPath}` : requestPath;
        const status = error?.response?.status;
        const serverMessage = getServerErrorMessage(error?.response?.data);
        const userMessage = serverMessage || (!error?.response ? "Network error. Please check server connectivity and CORS settings." : `Request failed with status ${status}`);
        error.userMessage = userMessage;

        if (typeof window !== "undefined" && status === 401 && isProtectedRequest(method, normalizedRequestPath)) {
            const hasLocalToken = Boolean(localStorage.getItem("ideavault_token"));
            if (hasLocalToken) {
                window.dispatchEvent(new CustomEvent("ideavault:unauthorized", {
                    detail: { status, requestPath: normalizedRequestPath, message: userMessage },
                }));
            }
        }

        if (!error?.response) {
            console.error(`[apiClient] Network error: ${method} ${url || "(unknown url)"} -> ${userMessage}`);
        } else {
            console.error(`[apiClient] Request failed: ${method} ${url || "(unknown url)"} -> ${status} | ${userMessage}`, error?.response?.data || null);
        }

        return Promise.reject(error);
    }
);

export default apiClient;