"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, getSession, saveSession } from "@/lib/authStorage";
import apiClient from "@/lib/apiClient";
import { signInWithPopup } from "firebase/auth";
import { getFirebaseAuthClient } from "@/lib/firebaseClient";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

function extractApiError(error, fallbackMessage) {
  return error?.userMessage || error?.response?.data?.error || error?.response?.data?.message || error?.message || fallbackMessage;
}

function mapFirebasePopupError(error) {
  const code = error?.code || "";

  if (code === "auth/popup-closed-by-user") return "Google sign-in popup was closed before completion.";
  if (code === "auth/popup-blocked") return "Popup was blocked by your browser. Please allow popups and try again.";
  if (code === "auth/cancelled-popup-request") return "A Google sign-in request is already running.";
  if (code === "auth/network-request-failed") return "Network error while contacting Google. Check your internet connection.";

  return null;
}

function isProtectedApiPath(pathname = "") {
  if (!pathname) return false;
  if (pathname === "/auth/me") return true;
  if (pathname.startsWith("/users")) return true;
  if (pathname.startsWith("/interactions")) return true;
  if (pathname.startsWith("/ideas/my-ideas")) return true;
  return false;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      const session = getSession();
      if (!mounted) return;

      setUser(session.user);
      setToken(session.token);

      if (!session.token || !session.user) {
        if (mounted) setAuthLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/auth/me");
        const nextUser = response?.data?.data;
        if (!mounted) return;

        if (nextUser) {
          saveSession({ token: session.token, user: nextUser });
          setUser(nextUser);
        } else {
          clearSession();
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        if (!mounted) return;

        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          clearSession();
          setUser(null);
          setToken(null);
        }
      } finally {
        if (mounted) setAuthLoading(false);
      }
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onUnauthorized = (event) => {
      const session = getSession();
      if (!session.token) return;

      const requestPath = event?.detail?.requestPath || "";
      const basePath = requestPath.split("?")[0];
      if (!isProtectedApiPath(basePath)) return;

      clearSession();
      setUser(null);
      setToken(null);
      toast.error("Session expired. Please login again.");
    };

    window.addEventListener("ideavault:unauthorized", onUnauthorized);
    return () => window.removeEventListener("ideavault:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const payload = response?.data?.data;
    if (!payload?.token || !payload?.user) {
      throw new Error("Invalid login response from server");
    }

    saveSession({ token: payload.token, user: payload.user });
    setUser(payload.user);
    setToken(payload.token);
    return payload.user;
  }, []);

  const register = useCallback(async ({ name, email, password, photoURL }) => {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
      photoURL,
    });
    const payload = response?.data?.data;
    if (!payload?.token || !payload?.user) {
      throw new Error("Invalid registration response from server");
    }

    saveSession({ token: payload.token, user: payload.user });
    setUser(payload.user);
    setToken(payload.token);
    return payload.user;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    let idToken;

    try {
      const { auth, provider } = getFirebaseAuthClient();
      const result = await signInWithPopup(auth, provider);
      idToken = await result.user.getIdToken();
    } catch (error) {
      const mappedError = mapFirebasePopupError(error);
      throw new Error(mappedError || "Google sign-in failed before reaching server.");
    }

    try {
      const response = await apiClient.post("/auth/google", { idToken });
      const payload = response?.data?.data;
      if (!payload?.token || !payload?.user) {
        throw new Error("Invalid Google login response from server");
      }

      saveSession({ token: payload.token, user: payload.user });
      setUser(payload.user);
      setToken(payload.token);
      return payload.user;
    } catch (error) {
      throw new Error(extractApiError(error, "Google sign-in could not be completed."));
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await apiClient.get("/auth/me");
      const nextUser = response?.data?.data;
      if (nextUser && token) {
        saveSession({ token, user: nextUser });
        setUser(nextUser);
      }
      return nextUser;
    } catch (error) {
      throw new Error(extractApiError(error, "Failed to fetch user profile"));
    }
  }, [token]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.warn("Logout request failed; clearing local session anyway.", error?.message || error);
    }

    clearSession();
    setUser(null);
    setToken(null);
  }, []);

  const updateProfile = useCallback(
    async (payload) => {
      if (!user || !token) return null;

      const response = await apiClient.put("/users/profile", payload);
      const updatedUser = response?.data?.data;
      if (!updatedUser) {
        throw new Error("Invalid profile update response from server");
      }

      saveSession({ token, user: updatedUser });
      setUser(updatedUser);
      return updatedUser;
    },
    [token, user]
  );

  const changePassword = useCallback(
    async ({ currentPassword, newPassword }) => {
      if (!token) return null;

      const response = await apiClient.post("/users/change-password", {
        currentPassword,
        newPassword,
      });
      const result = response?.data?.data;
      if (!result) {
        throw new Error("Invalid password change response from server");
      }

      return result;
    },
    [token]
  );

  const deleteAccount = useCallback(
    async ({ password }) => {
      if (!token) return null;

      await apiClient.delete("/users/profile", {
        data: { password },
      });

      clearSession();
      setUser(null);
      setToken(null);
    },
    [token]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      authLoading,
      isAuthenticated: Boolean(token),
      login,
      loginWithGoogle,
      register,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
      refreshUser,
      extractApiError,
    }),
    [authLoading, login, loginWithGoogle, logout, register, token, updateProfile, changePassword, deleteAccount, refreshUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
