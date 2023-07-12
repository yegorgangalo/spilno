import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { ROLE } from '@/services/const'

export default withAuth(
  function middleware(req) {
    const newUrl = new URL(req.url)
    const errorMessage = (req.nextauth.token?.error as Error)?.message
    const redirectUrl = `${newUrl.origin}/signin?callbackUrl=${encodeURIComponent(req.url)}&message=${errorMessage || 'noaccess'}`
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== ROLE.ADMIN) {
      return NextResponse.redirect(redirectUrl)
    }
    if (req.nextUrl.pathname.startsWith('/manage') && ![ROLE.ADMIN, ROLE.MANAGER].includes(req.nextauth.token?.role as ROLE)) {
      return NextResponse.redirect(redirectUrl)
    }
  },
  {
    callbacks: {
        authorized: ({ token }) => !!token,
    }
  }
)

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/manage',
    '/manage/:path*',
  ]
}
