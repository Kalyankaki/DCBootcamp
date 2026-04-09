import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login"];
const publicPrefixes = ["/api/auth/", "/demo"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public prefixes (auth API routes)
  if (publicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes - only superadmin role allowed
  if (pathname.startsWith("/admin")) {
    const role = (req.auth.user as any)?.role;
    if (role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }

  // Protect teacher routes - teacher and superadmin allowed
  if (pathname.startsWith("/teacher")) {
    const role = (req.auth.user as any)?.role;
    if (role !== "teacher" && role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/teacher/:path*", "/day/:path*"],
};
