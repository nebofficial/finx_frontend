import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwtPayload, getAllowedPrefix } from './lib/jwt-decode'

const PROTECTED_PREFIXES = ['/admin', '/systemadmin', '/collector', '/branchadmin', '/superadmin']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value

  // Root: redirect logged-in users to their dashboard
  if (pathname === '/') {
    if (!token) return NextResponse.next()
    const payload = decodeJwtPayload(token)
    const allowedPrefix = getAllowedPrefix(payload?.role)
    if (allowedPrefix) {
      const url = req.nextUrl.clone()
      url.pathname = allowedPrefix
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
  if (!isProtected) return NextResponse.next()

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const payload = decodeJwtPayload(token)
  const role = payload?.role
  const allowedPrefix = getAllowedPrefix(role)

  if (allowedPrefix) {
    const pathMatchesRole =
      pathname === allowedPrefix || pathname.startsWith(allowedPrefix + '/')
    if (!pathMatchesRole) {
      const url = req.nextUrl.clone()
      url.pathname = allowedPrefix
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/systemadmin/:path*',
    '/collector/:path*',
    '/branchadmin/:path*',
    '/superadmin/:path*',
  ],
}
