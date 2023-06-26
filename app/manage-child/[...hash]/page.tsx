'use client'
import { decode } from 'js-base64'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

interface ManageChildPageProps {
    params: { hash: string }
}

const ManageChildPage = (props: ManageChildPageProps) => {
    const encodedData = props.params.hash[0]

    const decodedData = JSON.parse(decode(decodeURIComponent(encodedData)))
    // console.log({ decodedData, encodedData })
    const { firstName, lastName } = decodedData.child

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
            </Box>
        </Container>
    )
}

export default  ManageChildPage
