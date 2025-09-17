import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PUBLIC_PATHS = ["/login", "/api/send-otp", "/api/verify-otp", "/_next", "/public", "/favicon.ico"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public assets and login/otp APIs
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const claims = await verifyToken(token);
  if (!claims || claims.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/clients/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/seo/:path*",
    "/audit-report/:path*",
    "/backlinks/:path*",
    "/client-portal/:path*",
    "/content/:path*",
    "/mode/:path*",
  ],
};


