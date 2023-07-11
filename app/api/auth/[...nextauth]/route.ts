import NextAuth from 'next-auth'
import type { AuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const authConfig: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email', required: true },
        password: { label: 'password', type: 'password', required: true },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null
        }
        // const res = await fetch(`${req.headers?.origin}/api/signin`, {
        const res = await fetch(`${process.env.BASE_URL}/api/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })
        console.log('authConfig:', { res, url: `${process.env.BASE_URL}/api/signin` });

        const { data: user } = await res.json()
        return user as User || null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },

    async session({ session, token }) {
      session.user = token as any
      return session
    },
  },
  pages: {
    signIn: '/signin'
  }
}

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
