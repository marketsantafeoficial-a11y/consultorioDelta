import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

const SESSION_COOKIE = "consultorios_session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/professional")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const session = await verifySession(token);

    if (pathname.startsWith("/dashboard") && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/professional", request.url));
    }

    if (pathname.startsWith("/professional") && session.role !== "PROFESSIONAL") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname === "/auth/login") {
      const target = session.role === "ADMIN" ? "/dashboard" : "/professional";
      return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/professional/:path*", "/auth/login"],
};
