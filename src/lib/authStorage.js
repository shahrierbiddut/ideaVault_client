const TOKEN_KEY = "ideavault_token";
const USER_KEY = "ideavault_user";

export function saveSession({ token, user }) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token || "");
    localStorage.setItem(USER_KEY, JSON.stringify(user || null));
}

export function clearSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Cleanup legacy non-httpOnly cookies if any were previously written by client code.
    document.cookie = "iv_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
}

export function getSession() {
    if (typeof window === "undefined") return { token: null, user: null };
    const token = localStorage.getItem(TOKEN_KEY) || null;
    const userText = localStorage.getItem(USER_KEY);
    let user = null;
    try {
        user = userText ? JSON.parse(userText) : null;
    } catch {
        user = null;
    }
    return { token, user };
}