import { NextResponse } from "next/server";

const protectedRoutes = ["/add-idea", "/my-ideas", "/my-interactions", "/profile"];

export function middleware(req) {
  const token = req.cookies.get("iv_token")?.value || req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-idea/:path*", "/my-ideas/:path*", "/my-interactions/:path*", "/profile/:path*"],
};
