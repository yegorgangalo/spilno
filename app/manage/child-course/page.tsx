'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import MenuBar from '@/components/MenuBar'

interface AssignCoursePageProps {
    params: { hash: string }
}

const AssignCoursePage = (props: AssignCoursePageProps) => {

    return (<>
        <MenuBar/>
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
                    Тут можна додати логіку призначення курсу для дитини, яку будемо шукати по базі даних. Альтернатива для опікунів, які не можуть знайти qr-code своєї дитини від попередньої реєстрації
                </Typography>
            </Box>
        </Container>
    </>)
}

export default  AssignCoursePage
