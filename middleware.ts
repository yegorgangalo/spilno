import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { ROLE } from '@/services/const'

export default withAuth(
  function middleware(req) {
    const newUrl = new URL(req.url)
    console.log('withAuth middleware', { newUrlOrigin: newUrl.origin })

      if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== ROLE.ADMIN) {
        return NextResponse.redirect(`${newUrl.origin}/signin?callbackUrl=${encodeURIComponent(req.url)}&message=noaccess`)
      }
      if (req.nextUrl.pathname.startsWith('/manage') && ![ROLE.ADMIN, ROLE.MANAGER].includes(req.nextauth.token?.role as ROLE)) {
        return NextResponse.redirect(`${newUrl.origin}/signin?callbackUrl=${encodeURIComponent(req.url)}&message=noaccess`)
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

