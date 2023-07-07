'use client'

// import Head from 'next/head'
import { useSession } from 'next-auth/react'
import LinearProgress from '@mui/material/LinearProgress'

interface HtmlBodyProps {
  children: React.ReactNode
}

const HtmlBody = ({ children }: HtmlBodyProps) => {
  const session = useSession()
  return (
    <html lang='en'>
      {/* <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head> */}
      <body suppressHydrationWarning={true}>
        {session.status === 'loading' ? <LinearProgress/> : children}
      </body>
    </html>
  )
}

export default HtmlBody
