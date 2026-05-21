"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
    }
  }, [authLoading, isAuthenticated, pathname, router]);

  if (authLoading) return <LoadingSpinner label="Checking session..." />;
  if (!isAuthenticated) return null;
  return children;
}
