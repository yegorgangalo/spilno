'use client'
import * as React from 'react'
import { useSession } from 'next-auth/react'
import { decode } from 'js-base64'

import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import Alert, { AlertColor } from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import LinearProgress from '@mui/material/LinearProgress'
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
import { calculateFullYears, createAgeLimitsNotification, getCurrentTimeRoundedUpToTensMinutes } from '@/app/frontend-services/helpers'

interface ManageChildCourseByHashPageProps {
    params: { hash: string }
}

interface IApiError extends Error {
  type: AlertColor
}

const ManageChildCourseByHashPage = (props: ManageChildCourseByHashPageProps) => {
  const [loading, setLoading] = React.useState(false)
  const [apiError, setApiError] = React.useState<IApiError | null>(null)
  const [selectedCourseId, setSelectedCourseId] = React.useState<number | string>('')
  const [visitTime, setVisitTime] = React.useState<Dayjs | null>(dayjs(getCurrentTimeRoundedUpToTensMinutes()))

  const courseResponse = useFetchCourses()

  const session = useSession()

  React.useEffect(() => {
    apiError && setTimeout(() => setApiError(null), 3000)
  }, [apiError])

  const accessToken = session.data?.user.accessToken

  const courseData = courseResponse.data?.data
  const courseError = courseResponse.error
  const courseIsLoading = courseResponse.isLoading

  const encodedData = props.params.hash[0]
  const decodedData = JSON.parse(decode(decodeURIComponent(encodedData)))
  const { id: childId, firstName, lastName, dob, gender, city, allowPhoto } = decodedData.child

  const assignChildToCourse = async () => {
    apiError && setApiError(null)
    setLoading(true)
    try {
      // visitTime?.format().split('+')[0] + '.000Z'
      // visitTime?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')

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

      if (signupResult.success) {
        setSelectedCourseId('')
        setVisitTime(dayjs(getCurrentTimeRoundedUpToTensMinutes()))
        setApiError({ message: 'Успішно зареєстровано', type: 'success'} as IApiError)
      }
    } catch (error) {
      console.log(error)
      setApiError({ message: (error as Error).message, type: 'error'} as IApiError)
    }
    setLoading(false)
  }

  const courseList = courseData?.map(({ id, title, lowerAgeLimit, upperAgeLimit }) => ({
    id,
    title: `${title}: ${createAgeLimitsNotification({ lowerAgeLimit, upperAgeLimit })}`
  })) || []

  return (<>
      <MenuBar/>
      {loading
        ? <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%' }}>
          <LinearProgress/>\
        </Box> : null}
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
              {apiError ? <Grid item xs={12}>
                <Alert severity={apiError.type}>
                  <AlertTitle>{apiError.type}</AlertTitle>
                  {apiError.message}
                </Alert>
              </Grid> : null}
            </Grid>
          </Box>
      </Container>
  </>)
}

export default  ManageChildCourseByHashPage
