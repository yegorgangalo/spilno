'use client'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'

const defaultTheme = createTheme()

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider theme={defaultTheme}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
