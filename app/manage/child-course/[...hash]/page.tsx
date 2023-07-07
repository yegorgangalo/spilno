'use client'
import * as React from 'react'
import { useSession } from 'next-auth/react'
import { decode } from 'js-base64'

import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuBar from '@/components/MenuBar'
import BasicSelect from '@/components/BasicSelect'
import { useFetchCourses } from '@/hooks/useFetchCourses'

const calculateFullYears = (dateString: string) => {
  const today = new Date()
  const pastDate = new Date(dateString)
  const yearsDiff = today.getFullYear() - pastDate.getFullYear()

  // Check if the current month and day are before the pastDate's month and day
  if (
    today.getMonth() < pastDate.getMonth() ||
    (today.getMonth() === pastDate.getMonth() && today.getDate() < pastDate.getDate())
  ) {
    return yearsDiff - 1
  }

  return yearsDiff
}

interface CreateAgeLimitsNotificationProps {
  lowerAgeLimit: number,
  upperAgeLimit: number,
}

const createAgeLimitsNotification = ({ lowerAgeLimit, upperAgeLimit }: CreateAgeLimitsNotificationProps) => {
  if (lowerAgeLimit && upperAgeLimit) {
    return `${lowerAgeLimit}-${upperAgeLimit} років`
  }
  if (lowerAgeLimit && !upperAgeLimit) {
    return `з ${lowerAgeLimit} років`
  }
  if (!lowerAgeLimit && upperAgeLimit) {
    return `до ${upperAgeLimit} років`
  }
  return ''
}

interface ManageChildCoursePageProps {
    params: { hash: string }
}

const ManageChildCoursePage = (props: ManageChildCoursePageProps) => {
  const [selectedCourseId, setSelectedCourseId] = React.useState<number | string>('')
  const [visitTime, setVisitTime] = React.useState<Dayjs | null>(dayjs(new Date()))

  const courseResponse = useFetchCourses()

  const session = useSession()
  const accessToken = session.data?.user.accessToken

  const courseData = courseResponse.data?.data
  const courseError = courseResponse.error
  const courseIsLoading = courseResponse.isLoading

  const encodedData = props.params.hash[0]
  const decodedData = JSON.parse(decode(decodeURIComponent(encodedData)))
  const { id: childId, firstName, lastName, dob, gender, city, allowPhoto } = decodedData.child

  const assignChildToCourse = async () => {
    try {
      const response = await fetch('/api/assign-child-course', {
        body: JSON.stringify({ courseId: selectedCourseId, childId, visitTime }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${accessToken}`,
        }
      })
      const signupResult = await response.json()
      console.log('signupResult=', signupResult)

      if (signupResult) {
        // mutate('/api/course')
        // reset()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const courseList = courseData?.map(({ id, title, lowerAgeLimit, upperAgeLimit }) => ({
    id,
    title: `${title}: ${createAgeLimitsNotification({ lowerAgeLimit, upperAgeLimit })}`
  })) || []

  return (<>
      <MenuBar/>
      <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
            }}
            >
              <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ minWidth: 300, backgroundColor: allowPhoto ? '#DEFFCB' : '#FFCBCB' }}>
                  <CardHeader title='Дані дитини'/>
                  <CardContent>
                    <Typography component="h6" variant="h6">{`Ім'я: ${firstName}`}</Typography>
                    <Typography component="h6" variant="h6">{`Прізвище: ${lastName}`}</Typography>
                    <Typography component="h6" variant="h6">{`Вік: ${calculateFullYears(dob)} років`}</Typography>
                    <Typography component="h6" variant="h6">{`Стать: ${gender}`}</Typography>
                    <Typography component="h6" variant="h6">{`Місто: ${city}`}</Typography>
                    <Typography component="h6" variant="h6">{`Дозвіл на фото: ${allowPhoto ? 'так' : 'ні'}`}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <BasicSelect
                  name="course"
                  menuItems={courseList}
                  onChange={(id) => setSelectedCourseId(Number(id))}
                  value={selectedCourseId}
                  label="Обрати майстер-клас"
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label='Час відвідування майстер-класу'
                    value={visitTime}
                    onChange={(newTime) => setVisitTime(newTime)}
                    // disablePast
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!selectedCourseId}
                  onClick={assignChildToCourse}
                >
                  Зареєструвати на майстер-клас
                </Button>
              </Grid>
            </Grid>
          </Box>
      </Container>
  </>)
}

export default  ManageChildCoursePage
