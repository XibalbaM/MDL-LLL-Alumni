import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    const { pathname } = request.nextUrl;

    // Protected Routes
    if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/network") ||
        pathname.startsWith("/directory") ||
        pathname.startsWith("/profile")
    ) {
        if (!session.user) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (session.user.isFirstLogin && pathname !== "/first-login") {
            return NextResponse.redirect(new URL("/first-login", request.url));
        }
    }

    // First Login Page Protection
    if (pathname === "/first-login") {
        if (!session.user) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        if (!session.user.isFirstLogin) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // Login Page Redirect
    if (pathname === "/") {
        if (session.user) {
            if (session.user.isFirstLogin) {
                return NextResponse.redirect(new URL("/first-login", request.url));
            }
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/network/:path*",
        "/directory/:path*",
        "/profile/:path*",
        "/first-login",
        "/",
    ],
};
