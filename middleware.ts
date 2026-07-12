import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()')

  if (pathname.startsWith('/api/ai/') || pathname.startsWith('/api/ai-tutor')) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'

    if (!rateLimit(ip, 30, 60_000)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Подождите минуту.' },
        { status: 429 }
      )
    }
  }

  return response
}

export const config = {
  matcher: ['/api/:path*', '/(dashboard)/:path*'],
}
