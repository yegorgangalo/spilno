'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

interface AdminPanelPageProps {
}

const AdminPanelPage = (props: AdminPanelPageProps) => {

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
                  Admin panel
                </Typography>
            </Box>
        </Container>
    )
}

export default  AdminPanelPage
