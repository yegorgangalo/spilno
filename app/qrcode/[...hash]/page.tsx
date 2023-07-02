'use client'
import Link from 'next/link'
import { QRCodeCanvas } from 'qrcode.react'
import { decode } from 'js-base64'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

interface QrCodeProps {
    params: { hash: string }
}

const QrCode = (props: QrCodeProps) => {
    const encodedData = props.params.hash[0]

    const decodedData = JSON.parse(decode(decodeURIComponent(encodedData)))
    console.log('pathname=', { decodedData})
    const { firstName, lastName } = decodedData.child

    const manageChildCourseUrl = `${location.origin}/manage/child-course/${encodedData}`
    // const manageChildCourseUrl = `http://192.168.1.6:3000/manage/child-course/${encodedData}`

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
                <QRCodeCanvas value={manageChildCourseUrl} size={512} />
                <Link href={`/manage/child-course/${encodedData}`}>manage/child-course/</Link>
            </Box>
        </Container>
    )
}

export default  QrCode
