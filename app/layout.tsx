// 'use client'

import './globals.css'
import HtmlBody from '@/components/HtmlBody'
import Providers from '@/components/Providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spilno.Unicef',
  description: 'Education platform',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (<>
    <Providers>
        <HtmlBody>
          {children}
        </HtmlBody>
    </Providers>
  </>
  )
}
