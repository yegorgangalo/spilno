'use client'

import './globals.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'

const defaultTheme = createTheme()

// export const metadata = {
//   title: 'Spilno',
//   description: 'education platform',
// }

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <SessionProvider>
      <ThemeProvider theme={defaultTheme}>
        <html lang='en'>
          <body suppressHydrationWarning={true}>{children}</body>
        </html>
      </ThemeProvider>
    </SessionProvider>
  )
}
