import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 🔒 Cas 2 : sécuriser certaines pages avec better-auth
  if (pathname.startsWith("/dashboard")) {
    console.log("in dashboard middleware");
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
        },
      }
    );
    console.log("session:", session);
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

// Appliquer sur les routes API et dashboard
export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
  runtime: "nodejs",
};
