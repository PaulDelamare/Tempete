import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard")) {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
  runtime: "nodejs",
};
