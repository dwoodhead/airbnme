import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function sha256hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/login')) return NextResponse.next()

  const sitePassword = process.env.SITE_PASSWORD
  if (!sitePassword) return NextResponse.next()

  const expected = await sha256hex(sitePassword)
  const cookie = request.cookies.get('airbnme_auth')?.value

  if (cookie === expected) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  if (pathname !== '/') loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|photos/).*)'],
}
