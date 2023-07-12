'use client'
import * as React from 'react'
import { useSession } from 'next-auth/react'
import TextField from '@mui/material/TextField'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TimeField } from '@mui/x-date-pickers/TimeField'
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
import * as helpers from '@/app/frontend-services/helpers'

interface IApiError extends Error {
  type: AlertColor
}

interface IDbChild {
  id: number
  firstName: string
  lastName: string
  city: string
  dob: string
  gender: string
  allowPhoto: boolean
}

const ManageChildrenCoursesPage = () => {
  const [child, setChild] = React.useState<IDbChild | null>(null)
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')

  const [loading, setLoading] = React.useState(false)
  const [apiError, setApiError] = React.useState<IApiError | null>(null)
  const [selectedCourseId, setSelectedCourseId] = React.useState<number | string>('')
  const [visitTime, setVisitTime] = React.useState<Dayjs | null>(dayjs(helpers.getCurrentTimeRoundedUpToTensMinutes()))

  const courseResponse = useFetchCourses()

  const session = useSession()

  React.useEffect(() => {
    apiError && setTimeout(() => setApiError(null), 3000)
  }, [apiError])

  const accessToken = session.data?.user.accessToken

  const courseData = courseResponse.data?.data
  const courseError = courseResponse.error
  const courseIsLoading = courseResponse.isLoading

  const findChild = async () => {
    apiError && setApiError(null)
    setLoading(true)
    try {
        const response = await fetch(`/api/child?firstName=${firstName}&lastName=${lastName}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${accessToken}`,
            }
          })
          const findChildResult = await response.json()
          console.log('findChildResult=', findChildResult)
          if (!findChildResult.data) {
            setApiError({ message: 'дитину не знайдено', type: 'error'} as IApiError)
          }
          setChild(findChildResult.data)
          setApiError({ message: 'дитину знайдено', type: 'success'} as IApiError)
    } catch (error) {
        console.log(error)
        setApiError({ message: (error as Error).message, type: 'error'} as IApiError)
    }
    setLoading(false)
  }

  const assignChildToCourse = async () => {
    apiError && setApiError(null)
    setLoading(true)
    try {
      // visitTime?.format().split('+')[0] + '.000Z'
      // visitTime?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')

      const response = await fetch('/api/assign-child-course', {
        body: JSON.stringify({ courseId: selectedCourseId, childId: child?.id, visitTime }),
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
        setVisitTime(dayjs(helpers.getCurrentTimeRoundedUpToTensMinutes()))
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
    title: `${title}: ${helpers.createAgeLimitsNotification({ lowerAgeLimit, upperAgeLimit })}`
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
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
            }}
            >
              <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h2" variant="h6">Інформація про дитину</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={(e) => setFirstName(helpers.getEventWithTrimTargetValue(e as React.ChangeEvent<HTMLInputElement>).target.value)}
                  value={firstName}
                  label="Ім'я"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={(e) => setLastName(helpers.getEventWithTrimTargetValue(e as React.ChangeEvent<HTMLInputElement>).target.value)}
                  value={lastName}
                  label="Прізвище"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!firstName || !lastName}
                  onClick={findChild}
                >
                  Знайти дитину
                </Button>
              </Grid>
              {!!child && <Grid item xs={12}>
                <Card sx={{ minWidth: 300, backgroundColor: child.allowPhoto ? '#DEFFCB' : '#FFCBCB' }}>
                  <CardHeader title='Дані дитини'/>
                  <CardContent>
                    <Typography component="h6" variant="h6">{`Ім'я: ${child.firstName}`}</Typography>
                    <Typography component="h6" variant="h6">{`Прізвище: ${child.lastName}`}</Typography>
                    <Typography component="h6" variant="h6">{`Вік: ${helpers.calculateFullYears(child.dob)} років`}</Typography>
                    <Typography component="h6" variant="h6">{`Стать: ${child.gender}`}</Typography>
                    <Typography component="h6" variant="h6">{`Місто: ${child.city}`}</Typography>
                    <Typography component="h6" variant="h6">{`Дозвіл на фото: ${child.allowPhoto ? 'так' : 'ні'}`}</Typography>
                  </CardContent>
                </Card>
              </Grid>}
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
                  <TimeField
                    label='Час відвідування майстер-класу'
                    value={visitTime}
                    onChange={(newTime) => setVisitTime(newTime)}
                    format="HH:mm"
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!selectedCourseId || !child?.id}
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

export default  ManageChildrenCoursesPage
