import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED_PREFIXES = ["/admin", "/systemadmin", "/collector", "/branchadmin"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get("auth_token")?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/sign-in"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/systemadmin/:path*",
    "/collector/:path*",
    "/branchadmin/:path*"
  ],
}

