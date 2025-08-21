import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
     const { pathname, origin } = request.nextUrl;

     const publicRoutes = [
          "/api/auth/get-session",
          "/api/auth/signin",
          "/api/auth/signout",
          "/sign-in",
          "/sign-up",
     ];

     if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return NextResponse.next();
     }

     if (request.method === "GET" && pathname !== "/api/user") {
          return NextResponse.next();
     }

     const { data: session } = await betterFetch<Session>(
          "/api/auth/get-session",
          {
               baseURL: origin,
               headers: {
                    cookie: request.headers.get("cookie") || "",
               },
          }
     );

     if (!session) {
          if (request.headers.get("accept")?.includes("text/html")) {
               return NextResponse.redirect(new URL("/sign-in", request.url));
          }

          return new NextResponse(
               JSON.stringify({ error: "Unauthorized" }),
               {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
               }
          );
     }

     return NextResponse.next();
}

export const config = {
     matcher: [
          "/api/user/:path*",
          "/dashboard/:path*",
     ],
     exclude: ["/api/auth/:path*"],
     runtime: "nodejs",
};
