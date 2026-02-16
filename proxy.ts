// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export default async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const publicRoutes = ["/login", "/register"];
//   const protectedRoutes = ["/simpleUser","/admin"];

//   const session = (await cookies()).get("session")?.value;

//   // Not logged in → block protected routes
//   if (!session && protectedRoutes.some(p => pathname.startsWith(p))) {
//     return NextResponse.redirect(new URL("/login", req.nextUrl));
//   }

//   // Logged in → block auth pages
//   if (session && publicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/", req.nextUrl));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next|favicon.ico).*)"],
// };
// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register"];
  const protectedRoutes = [ "/admin", "/simpleUser"]; // Added simpleUser

  const session = (await cookies()).get("session")?.value;

  // Add no-cache headers for auth pages to prevent bfcache
  if (publicRoutes.includes(pathname)) {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  // Not logged in → block protected routes
  if (!session && protectedRoutes.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Logged in → block auth pages
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};