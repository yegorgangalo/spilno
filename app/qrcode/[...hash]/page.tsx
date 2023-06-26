'use client'
import Link from 'next/link'
import { QRCodeCanvas } from 'qrcode.react'
import { decode } from 'js-base64'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

// const decode = (string: string) => {
//     return Buffer.from(string, 'base64').toString('utf8')
// }

interface QrCodeProps {
    params: { hash: string }
}

const QrCode = (props: QrCodeProps) => {
    const encodedData = props.params.hash[0]

    const decodedData = JSON.parse(decode(decodeURIComponent(encodedData)))
    console.log('pathname=', { decodedData})
    const { firstName, lastName } = decodedData.child

    // const manageChildUrl = `${location.origin}/manage-child/${encodedData}`
    const manageChildUrl = `http://192.168.1.6:3000/manage-child/${encodedData}`

    return (
        <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
                <Typography component="h1" variant="h5">
                  QrCode for {`${firstName} ${lastName}`}
                </Typography>
                <QRCodeCanvas value={manageChildUrl} size={512} />
                <Link href={`/manage-child/${encodedData}`}>manage-child/</Link>
            </Box>
        </Container>
    )
}

export default  QrCode
