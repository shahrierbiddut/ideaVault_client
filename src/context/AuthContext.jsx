"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, getSession, saveSession } from "@/lib/authStorage";
import apiClient from "@/lib/apiClient";
import { signInWithPopup } from "firebase/auth";
import { getFirebaseAuthClient } from "@/lib/firebaseClient";

const AuthContext = createContext(null);

function extractApiError(error, fallbackMessage) {
  return error?.response?.data?.error || error?.response?.data?.message || fallbackMessage;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const session = getSession();
    setUser(session.user);
    setToken(session.token);
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
    const { auth, provider } = getFirebaseAuthClient();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    const response = await apiClient.post("/auth/google", { idToken });
    const payload = response?.data?.data;
    if (!payload?.token || !payload?.user) {
      throw new Error("Invalid Google login response from server");
    }

    saveSession({ token: payload.token, user: payload.user });
    setUser(payload.user);
    setToken(payload.token);
    return payload.user;
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

  const logout = useCallback(() => {
    apiClient.post("/auth/logout").catch(() => null);
    clearSession();
    setUser(null);
    setToken(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    if (!user || !token) return null;

    const response = await apiClient.put("/users/profile", payload);
    const updatedUser = response?.data?.data;
    if (!updatedUser) {
      throw new Error("Invalid profile update response from server");
    }

    saveSession({ token, user: updatedUser });
    setUser(updatedUser);
    return updatedUser;
  }, [token, user]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      loginWithGoogle,
      register,
      logout,
      updateProfile,
      refreshUser,
      extractApiError,
    }),
    [login, loginWithGoogle, logout, register, token, updateProfile, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
