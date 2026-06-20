"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiBell, FiChevronDown, FiLogOut, FiMenu, FiSearch, FiUser, FiX } from "react-icons/fi";
import ThemeToggle from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Ideas", href: "/ideas" },
  { label: "Add Idea", href: "/add-idea", private: true },
  { label: "My Ideas", href: "/my-ideas", private: true },
  { label: "My Interactions", href: "/my-interactions", private: true },
];

function BrandMark({ compact = false }) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2.5">
      <span
        className={cn(
          "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 font-bold text-white",
          compact ? "h-7 w-7 text-xs" : "h-8 w-8 text-sm"
        )}
      >
        <span className="relative">Q</span>
      </span>
      <span className={cn("font-space text-main truncate font-semibold", compact ? "hidden text-base sm:inline" : "text-xl sm:text-2xl")}>IdeaVault</span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visibleLinks = navLinks.filter((link) => !link.private || isAuthenticated);
  const fallbackAvatar = "https://api.dicebear.com/9.x/avataaars/svg?seed=ideavault";
  const avatarSrc = user?.photoURL || fallbackAvatar;
  const userName = user?.name || "John Doe";

  return (
    <header className="sticky top-0 z-50 pt-3">
      <div
        className={cn(
          "surface-elevated relative mx-auto hidden h-18 w-[min(1180px,92%)] items-center rounded-2xl px-5 md:flex",
          scrolled
            ? "shadow-[var(--shadow-1)] backdrop-blur"
            : "shadow-[0_12px_24px_rgba(15,23,42,0.08)] backdrop-blur",
        )}
      >
        <BrandMark />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {visibleLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-base font-medium transition after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-[60%] after:-translate-x-1/2 after:origin-center after:rounded-full after:transition-transform after:duration-300",
                  active
                    ? "bg-violet-600 text-white shadow-[0_8px_20px_rgba(124,58,237,0.28)] after:scale-x-100 after:bg-white"
                    : "text-subtle after:scale-x-0 after:bg-violet-500 hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] hover:after:scale-x-100",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button className="icon-btn rounded-full" aria-label="Search" type="button">
            <FiSearch />
          </button>
          <button className="icon-btn rounded-full" aria-label="Notifications" type="button">
            <FiBell />
          </button>
          <ThemeToggle />

          {isAuthenticated ? (
            <details className="group relative">
              <summary className="text-subtle flex cursor-pointer list-none items-center gap-2 rounded-full px-2 py-1 text-sm hover:bg-[var(--surface-hover)]">
                <img
                  src={avatarSrc}
                  alt={userName}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border border-[var(--border-base)] object-cover"
                  onError={(event) => {
                    event.currentTarget.src = fallbackAvatar;
                  }}
                />
                <span>{userName}</span>
                <FiChevronDown className="text-muted" />
              </summary>
              <div className="surface-elevated absolute right-0 mt-3 w-56 rounded-xl p-2">
                <Link href="/profile" className="menu-item flex items-center gap-2">
                  <FiUser /> Profile Management
                </Link>
                <Link href="/my-ideas" className="menu-item flex items-center gap-2">
                  My Ideas
                </Link>
                <button
                  className="menu-item flex w-full items-center gap-3 text-left text-rose-500 hover:bg-rose-500/10"
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                  type="button"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </details>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-secondary rounded-md px-3 py-2 text-sm font-medium">
                Login
              </Link>
              <Link href="/register" className="btn-primary rounded-md px-3 py-2 text-sm font-medium">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="surface-elevated mx-auto flex h-16 w-[min(1180px,92%)] items-center rounded-xl px-3 md:hidden">
        <div className="flex items-center gap-2">
          <button
            className="icon-btn rounded-md"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Menu"
            type="button"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
          <BrandMark compact />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <img
              src={avatarSrc}
              alt={userName}
              width={30}
              height={30}
              className="h-7 w-7 rounded-full border border-[var(--border-base)] object-cover"
              onError={(event) => {
                event.currentTarget.src = fallbackAvatar;
              }}
            />
          ) : (
            <Link href="/login" className="btn-secondary rounded-md px-2 py-1 text-xs">
              Login
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="surface-elevated mx-auto mt-2 w-[min(1180px,92%)] rounded-xl p-2 md:hidden"
          >
            <div className="space-y-2">
              {visibleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium",
                    pathname === link.href
                      ? "bg-violet-600 text-white"
                      : "text-subtle hover:bg-[var(--surface-hover)]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="theme-divider space-y-2 border-t pt-2">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="menu-item block rounded-lg text-sm font-medium"
                  >
                    Profile Management
                  </Link>
                  <button
                    type="button"
                    className="menu-item block w-full rounded-lg text-left text-sm font-medium text-rose-500 hover:bg-rose-500/10"
                    onClick={async () => {
                      await logout();
                      setMobileOpen(false);
                      router.push("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="theme-divider flex items-center gap-2 border-t pt-2">
                  <Link href="/login" className="btn-secondary rounded-md px-3 py-2 text-sm">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary rounded-md px-3 py-2 text-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
