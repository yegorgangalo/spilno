'use client'

import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

// export const metadata = {
//   title: 'Spilno',
//   description: 'education platform',
// }

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <html lang="en">
        <body suppressHydrationWarning={true}>{children}</body>
      </html>
    </ThemeProvider>
  )
}
