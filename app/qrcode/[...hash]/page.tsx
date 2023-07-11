'use client'
import Link from 'next/link'
import { QRCodeCanvas } from 'qrcode.react'
import { decode } from 'js-base64'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

interface QrCodeProps {
    params: { hash: string }
}

const QrCode = (props: QrCodeProps) => {
    const encodedData = props.params.hash[0]

    const decodedData = JSON.parse(decode(decodeURIComponent(encodedData)))
    console.log('decodedData=', decodedData)
    const { firstName, lastName } = decodedData.child

    const manageChildCourseUrl = `${location.origin}/manage/child-course/${encodedData}`

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
                <Typography component="h2" variant="h6">Покажіть даний QR-code менеджеру</Typography>
                <Typography component="h1" variant="h6">для реєстрації на майстер-клас</Typography>
                <Typography component="h1" variant="h6">вашої дитини:</Typography>
                <Typography component="h1" variant="h5">{`${firstName} ${lastName}`}</Typography>
                <Card sx={{ marginTop: 2, marginBottom: 2 }}>
                  <CardContent>
                    <QRCodeCanvas value={manageChildCourseUrl} size={512} />
                  </CardContent>
                </Card>
                {/* <Link href={`/manage/child-course/${encodedData}`}>manage/child-course/</Link> */}
            </Box>
        </Container>
    )
}

export default  QrCode
