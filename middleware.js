import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Protected routes
  const protectedRoutes = [
    /^\/profile\/[^/]+\/edit/,
    /^\/community\/new/,
    /^\/assistant/,
  ];

  // Check if current path matches any protected route
  const isProtectedRoute = protectedRoutes.some((route) => route.test(pathname));

  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
