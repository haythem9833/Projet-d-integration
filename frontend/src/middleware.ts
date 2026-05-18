import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/api"];

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no token in cookies, allow the request to proceed
  // The client-side ProtectedRoute component will handle authentication
  if (!token) {
    return NextResponse.next();
  }

  // Try to decode token to get user role (basic JWT parsing)
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return NextResponse.next();
    }

    // Decode payload (second part)
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    const role = payload.role || payload.sub;

    // Route protection based on role
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    if (pathname.startsWith("/professor") && role !== "PROFESSOR" && role !== "TRAINER") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    if (pathname.startsWith("/student") && role !== "STUDENT") {
      // Redirect to appropriate dashboard based on role
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (role === "PROFESSOR" || role === "TRAINER") {
        return NextResponse.redirect(new URL("/professor/dashboard", request.url));
      }
    }
  } catch (error) {
    console.error("Error parsing token:", error);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
