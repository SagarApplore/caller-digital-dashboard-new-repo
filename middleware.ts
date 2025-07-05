import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = [
  "/",
  "/dashboard",
  "/analytics",
  "/campaigns",
  "/clients",
  "/assistants",
  "/transcripts",
  "/llm-config",
  "/monetization",
];
const authRoutes = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Since we're using localStorage for auth, we can't check auth state in middleware
  // The client-side ProtectedRoute component will handle authentication checks
  // This middleware will only handle basic route protection for auth routes

  // If accessing auth routes, allow access (client-side will handle redirects if already authenticated)
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // For protected routes, let the client-side ProtectedRoute handle authentication
  // This prevents the middleware from redirecting when the user is actually authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
