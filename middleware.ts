import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
     // const sessionCookie = getSessionCookie(request);

     // THIS IS NOT SECURE!
     // This is the recommended approach to optimistically redirect users
     // We recommend handling auth checks in each page/route
     // if (!sessionCookie) {
     //      return NextResponse.redirect(new URL("/", request.url));
     // }

     // return NextResponse.next();

     const session = await auth.api.getSession({
          headers: await headers()
     })

     if (!session) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
     }

     return NextResponse.next();
}

export const config = {
     matcher: ["/dashboard"],
};
