import { ROLE } from '@/services/const'
import NextAuth from 'next-auth'
import type { AuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

interface SpilnoUser extends User {
  role: ROLE
  error?: { message: string }
}

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
        console.log('authConfig req.headers?.origin=', req.headers?.origin);
        try {
          const res = await fetch(`${req.headers?.origin}/api/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          })

          const { data: user, error } = await res.json()
          console.log('authConfig user=', user);

          return user as SpilnoUser || { error }
          // return user as User || null
        } catch (error) {
          console.log('!* authConfig Credentials provider authorize error', error)
          return { error: { message: 'server_error' } } as SpilnoUser
          // return null
        }

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
