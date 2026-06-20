"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRocket } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiImage, FiLock, FiMail, FiUser } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function AuthCard({ mode = "login" }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const searchParams = useSearchParams();
  const DEFAULT_LOGIN_REDIRECT = "/my-ideas";
  const redirectTo = searchParams.get("redirect") || DEFAULT_LOGIN_REDIRECT;
  // const redirectTo = searchParams.get("redirect") || "/";
  const { login, register, loginWithGoogle, extractApiError } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const validations = {
    min: form.password.length >= 6,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
  };

  const onGoogleLogin = async () => {
    try {
      setGoogleSubmitting(true);
      await loginWithGoogle();
      toast.success("Google login successful");
      // router.push(redirectTo);
      window.location.replace(redirectTo);
    } catch (error) {
      toast.error(extractApiError(error, "Google login failed"));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && !(validations.min && validations.upper && validations.lower)) {
      toast.error("Password needs 6+ chars with uppercase and lowercase.");
      return;
    }

    try {
      setSubmitting(true);
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      toast.success(isLogin ? "Welcome back to IdeaVault" : "Account created successfully");
      // router.push(redirectTo);
      window.location.replace(redirectTo);
    } catch (error) {
      toast.error(extractApiError(error, isLogin ? "Login failed" : "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="grid min-h-[78vh] items-center gap-6 py-8 lg:grid-cols-[0.96fr_1fr]">
      <div className="surface-elevated relative hidden min-h-[560px] overflow-hidden rounded-lg px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(124,58,237,.18),transparent_44%,rgba(6,182,212,.14)),linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[length:100%_100%,44px_44px,44px_44px]" />
        <div className="relative z-10">
          <span className="inline-flex rounded-md border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-500">
            {isLogin ? "Login Page" : "Register Page"}
          </span>
          <h1 className="text-main mt-5 max-w-sm font-space text-4xl font-semibold leading-tight">{isLogin ? "Welcome Back!" : "Create Your Account"}</h1>
          <p className="text-subtle mt-4 max-w-sm text-sm leading-6">{isLogin ? "Continue sharing and exploring ideas." : "Join our community of creators and innovators."}</p>
        </div>

        <div className="relative z-10 mx-auto flex h-72 w-72 items-center justify-center">
          <div className="absolute inset-x-8 bottom-6 h-10 rounded-[50%] bg-violet-950/70 blur-xl" />
          <div className="relative flex h-44 w-44 rotate-[-8deg] items-center justify-center rounded-lg border border-white/15 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-[0_26px_70px_rgba(124,58,237,.48)]">
            <div className="absolute inset-4 rounded-md border border-white/20 bg-slate-950/18" />
            {isLogin ? <FiLock className="relative text-7xl text-white drop-shadow-xl" /> : <FaRocket className="relative text-7xl text-white drop-shadow-xl" />}
          </div>
          <div className="absolute left-6 top-12 h-12 w-12 rounded-md border border-cyan-200/20 bg-cyan-300/15" />
          <div className="absolute bottom-16 right-3 h-16 w-16 rounded-md border border-fuchsia-200/20 bg-fuchsia-300/15" />
          <div className="absolute right-10 top-5 h-3 w-16 rounded-full bg-cyan-300/55" />
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3 text-center">
          {["Share", "Validate", "Build"].map((item) => (
            <div key={item} className="surface-muted text-subtle rounded-md px-3 py-2 text-xs font-medium">
              {item}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="surface-elevated rounded-lg p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-md">
          <div className="mb-7 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">IdeaVault</p>
            <h2 className="text-main mt-2 font-space text-3xl font-semibold">{isLogin ? "Login to IdeaVault" : "Create Your Account"}</h2>
          </div>

          <div className="space-y-4">
            {!isLogin ? (
              <label className="block space-y-1.5">
                <span className="text-subtle text-sm font-medium">Name</span>
                <span className="relative block">
                  <FiUser className="text-muted pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2" />
                  <input
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="field h-11 !pl-10"
                    required
                  />
                </span>
              </label>
            ) : null}

            <label className="block space-y-1.5">
              <span className="text-subtle text-sm font-medium">Email</span>
              <span className="relative block">
                <FiMail className="text-muted pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="field h-11 !pl-10"
                  required
                />
              </span>
            </label>

            {!isLogin ? (
              <label className="block space-y-1.5">
                <span className="text-subtle text-sm font-medium">Photo URL</span>
                <span className="relative block">
                  <FiImage className="text-muted pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2" />
                  <input placeholder="Enter photo URL" value={form.photoURL} onChange={(e) => setForm((p) => ({ ...p, photoURL: e.target.value }))} className="field h-11 !pl-10" />
                </span>
              </label>
            ) : null}

            <label className="block space-y-1.5">
              <span className="text-subtle text-sm font-medium">Password</span>
              <span className="relative block">
                <FiLock className="text-muted pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="field h-11 !pl-10 !pr-11"
                  required
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
            </label>

            {isLogin ? (
              <Link href="#" className="block text-right text-xs font-medium text-violet-300 transition hover:text-violet-100">
                Forgot Password?
              </Link>
            ) : null}
          </div>

          <button className="btn-primary mt-6 h-11 w-full justify-center rounded-md" type="submit" disabled={submitting}>
            {submitting ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
          <button
            className="btn-secondary mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            type="button"
            onClick={onGoogleLogin}
            disabled={googleSubmitting}>
            <FcGoogle className="text-lg" />
            {googleSubmitting ? "Connecting Google..." : isLogin ? "Login with Google" : "Sign up with Google"}
          </button>

          <p className="text-subtle mt-5 text-center text-sm">
            {isLogin ? "Don’t have an account? " : "Already have an account? "}
            <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-cyan-500 transition hover:text-cyan-400">
              {isLogin ? "Register" : "Login"}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
