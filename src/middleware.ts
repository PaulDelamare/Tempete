import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
     const { pathname, origin } = request.nextUrl;

     const publicRoutes = [
          "/api/auth/get-session",
          "/api/auth/signin",
          "/api/auth/signup"
     ];

     if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return NextResponse.next();
     }

     const protectedRoutes = ["/api/user", "/dashboard"];

     const needsSession =
          request.method !== "GET" || protectedRoutes.some((route) => pathname.startsWith(route));

     if (!needsSession) {
          return NextResponse.next();
     }

     const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
          baseURL: origin,
          headers: {
               cookie: request.headers.get("cookie") || "",
          },
     });

     if (!session) {
          if (request.headers.get("accept")?.includes("text/html")) {
               return NextResponse.redirect(new URL("/sign-in", request.url));
          } else {
               return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
               });
          }
     }

     return NextResponse.next();
}

export const config = {
     matcher: ["/api/:path*", "/dashboard/:path*"],
     runtime: "nodejs",
};
