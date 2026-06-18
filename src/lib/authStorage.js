const TOKEN_KEY = "ideavault_token";
const USER_KEY = "ideavault_user";
const COOKIE_TOKEN_KEY = "iv_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function getCookieSecureFlag() {
    if (typeof window === "undefined") return "";
    return window.location.protocol === "https:" ? "; Secure" : "";
}

function saveAuthCookie(token) {
    if (typeof document === "undefined") return;
    document.cookie = `${COOKIE_TOKEN_KEY}=${encodeURIComponent(token || "")}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${getCookieSecureFlag()}`;
}

function clearAuthCookie(name) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${getCookieSecureFlag()}`;
}

export function saveSession({ token, user }) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token || "");
    localStorage.setItem(USER_KEY, JSON.stringify(user || null));
    saveAuthCookie(token);
}

export function clearSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    clearAuthCookie(COOKIE_TOKEN_KEY);
    // Cleanup legacy non-httpOnly cookie if it was previously written by client code.
    clearAuthCookie("token");
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
