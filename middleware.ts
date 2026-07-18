import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/auth', '/landing', '/api', '/_next', '/favicon', '/sw.js', '/manifest', '/offline', '/icons']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  const hasCookie = [...request.cookies.getAll()].some(c => c.name.includes('-auth-token') && c.value)
  if (!hasCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw.js|manifest|icons|offline).*)'],
}
