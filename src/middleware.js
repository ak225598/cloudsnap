import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup" || path === "/verifyemail";
  const redirectPath = path === "/" || path.startsWith("/home/");

  const token = request.cookies.get("token")?.value || "";
  
    if (redirectPath && token) {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  } else if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/verifyemail",
    "/home/media",
    "/home/upload",
    "/home/help",
    "/home/settings",
    "/home/profile",
    "/home",
  ],
};
