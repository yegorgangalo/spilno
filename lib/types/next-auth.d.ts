import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      firstName: string
      lastName: string
      email: string
      role: string
      accessToken: string
    }
  }
}
