"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getSession } from "@/lib/authStorage";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasPersistedToken = !isAuthenticated && Boolean(getSession().token);
  const canAccessRoute = isAuthenticated || hasPersistedToken;

  useEffect(() => {
    if (!authLoading && !canAccessRoute) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
    }
  }, [authLoading, canAccessRoute, pathname, router]);

  if (authLoading) return <LoadingSpinner label="Checking session..." />;
  if (!canAccessRoute) return null;
  return children;
}
