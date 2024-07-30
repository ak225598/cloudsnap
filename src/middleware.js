import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup", "/verifyemail", "/forgotPassword"];
const OPEN_API_PATHS = [
  "/api/users/signup",
  "/api/users/login",
  "/api/users/password-recovery-email",
  "/api/users/verifyEmail",
  "/api/users/changePassword",
];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = PUBLIC_PATHS.includes(path);
  const isRedirectPath = path === "/" || path.startsWith("/home/");
  const isApiUserPath =
    path.startsWith("/api/users/") || path.startsWith("/api/cloudinary");
  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath) {
    return token
      ? NextResponse.redirect(new URL("/home", request.nextUrl))
      : NextResponse.next();
  }

  if (isRedirectPath && token) {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }

  if (isApiUserPath) {
    if (OPEN_API_PATHS.includes(path)) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to continue." },
        { status: 401 }
      );
    }

    try {
      const res = await fetch(
        `${request.nextUrl.origin}/api/users/verify-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      const { valid, authUserId } = await res.json();
      if (!valid) {
        return NextResponse.json(
          {
            error:
              "Invalid or expired authentication token. Please log in again.",
          },
          { status: 401 }
        );
      }

      const response = NextResponse.next();
      response.headers.set("X-Authenticated-User-ID", authUserId);
      return response;
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotPassword",
    "/home",
    "/home/:path*",
    "/api/users/:path*",
    "/api/cloudinary/:path*",
  ],
};
