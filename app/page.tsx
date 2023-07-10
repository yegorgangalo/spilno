'use client'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import * as React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { encode } from 'js-base64'
import BasicSelect from '@/components/BasicSelect'
import RadioButtonGroup from '@/components/RadioButtonGroup'
import Alert, { AlertColor } from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { parsePhoneNumber } from 'libphonenumber-js'
import { isEmptyObject } from '@/app/frontend-services/helpers'
import { isValidPhone } from '@/app/frontend-services/validation'
import { GENDER, MESSENGER } from '@/app/frontend-services/enums'
import { genderList, messengerList } from '@/app/frontend-services/data'
import { Moment } from 'moment'
import DateTextField from '@/components/DateTextField'
import dayjs from 'dayjs'

interface ISignUpData {
  parentFirstName: string
  parentLastName: string
  parentPhone: string
  parentEmail: string
  parentMessenger: string
  childFirstName: string
  childLastName: string
  childCity: string
  childDob: Moment
  childGender: string
  childAllowPhoto?: boolean
  terms?: boolean
}

interface IApiError extends Error {
  type: AlertColor
}

yup.addMethod<any>(yup.Schema, 'isValidPhone', isValidPhone)
const signUpSchema = yup.object().shape({
  parentFirstName: yup.string().required(),
  parentLastName: yup.string().required(),
  parentPhone: yup.string().isValidPhone().required(),
  parentEmail: yup.string().email().required(),
  parentMessenger: yup.string().required(),
  childFirstName: yup.string().required(),
  childLastName: yup.string().required(),
  childCity: yup.string().required(),
  childDob: yup.string().required(),
  childGender: yup.string().oneOf(Object.values(GENDER)).required(),
  childAllowPhoto: yup.boolean(),
  terms: yup.boolean(),
}).required()

export default function SignUp() {
  const router = useRouter()

  const [apiError, setApiError] = React.useState<IApiError | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [isOpenToolTip, setIsOpenToolTip] = React.useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<ISignUpData>({
    defaultValues: {
      parentFirstName: '',
      parentLastName: '',
      parentPhone: '',
      parentEmail: '',
      parentMessenger: MESSENGER.SMS,
      childFirstName: '',
      childLastName: '',
      childCity: '',
      childDob: dayjs('2015-01-01'),
      childGender: GENDER.MALE,
      childAllowPhoto: true,
      terms: true,
    },
    resolver: yupResolver<ISignUpData>(signUpSchema as any),
  })

  const onSubmit = async (data: ISignUpData) => {
    apiError && setApiError(null)
    if (!isEmptyObject(errors)) {
      return
    }

    setLoading(true)
    try {
      data.parentPhone = parsePhoneNumber(data.parentPhone, 'UA').number
      const response = await fetch('/api/signup', { body: JSON.stringify(data), method: 'POST' })
      const signupResult = await response.json()
      if (!signupResult.success) {
        throw signupResult.error
      }
      const encodedData = encodeURIComponent(encode(JSON.stringify(signupResult.data)))
      router.push(`/qrcode/${encodedData}`)
    } catch (error) {
      const message = (error as IApiError).message
      const type = (error as IApiError).type || 'error'
      setApiError({ type, message } as IApiError)
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Spilno. Unicef</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      {!!loading && <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%' }}>
        <LinearProgress/>\
      </Box>}
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image src='logo_vertical.svg' alt='logo' width='240' height='360' />
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h2" variant="h6">Інформація батька/матері або опікуна</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="parentFirstName"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value!}
                      label="Ім'я"
                      error={!!errors.parentFirstName}
                      helperText={!!errors.parentFirstName ? "Введіть ваше ім'я" : ''}
                      fullWidth
                      autoFocus
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="parentLastName"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value!}
                      label="Прізвище"
                      error={!!errors.parentLastName}
                      helperText={!!errors.parentLastName ? 'Введіть ваше прізвище' : ''}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="parentPhone"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value!}
                      label="Телефон"
                      error={!!errors.parentPhone}
                      helperText={errors.parentPhone?.message}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="parentEmail"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Tooltip title="На вказану електронну пошту вам прийде QR-code" open={isOpenToolTip}>
                      <TextField
                        onFocus={() => setIsOpenToolTip(true)}
                        onBlur={() => setIsOpenToolTip(false)}
                        onChange={onChange}
                        value={value!}
                        label="Електронна пошта"
                        error={!!errors.parentEmail}
                        helperText={!!errors.parentEmail ? 'Введіть ваш емейл' : ''}
                        fullWidth
                        required
                        />
                    </Tooltip>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="parentMessenger"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioButtonGroup
                      onChange={onChange}
                      value={value}
                      buttons={messengerList}
                      label="Месенджер для комунікації"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography component="h2" variant="h6">Інформація про дитину</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="childFirstName"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value!}
                      label="Ім'я"
                      error={!!errors.childFirstName}
                      helperText={!!errors.childFirstName ? "Введіть ім'я дитини" : ''}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="childLastName"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value!}
                      label="Прізвище"
                      error={!!errors.childLastName}
                      helperText={!!errors.childLastName ? "Введіть прізвище дитини" : ''}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="childCity"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value!}
                      label="Місто"
                      error={!!errors.childCity}
                      helperText={!!errors.childCity ? "Вкажіть місто" : ''}
                      fullWidth
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Controller
                    name="childDob"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DateTextField
                        onChange={onChange}
                        value={value}
                        error={!!errors?.childDob}
                        helperText='Невірна дата народження'
                      />
                    )}
                  />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="childGender"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <BasicSelect
                      name="childGender"
                      menuItems={genderList}
                      onChange={(id) => onChange(String(id))}
                      value={value ?? ''}
                      label="Стать*"
                      error={!!errors.childGender}
                      helperText='Вкажіть стать'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="childAllowPhoto"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      label="Я надаю дозвіл на фотографування своєї дитини"
                      control={ <Checkbox checked={!!value} onChange={(e, item) => onChange(item)} color="primary" />}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="terms"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      label="Я погоджуюсь на обробку персональних даних"
                      control={<Checkbox checked={!!value} onChange={(e, item) => onChange(item)} color="primary" />}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Отримати QR-code
              </Button>
            </Grid>
            {apiError ? <Grid item xs={12}>
              <Alert severity={apiError.type}>
                <AlertTitle>{apiError.type}</AlertTitle>
                {apiError.message}
              </Alert>
            </Grid> : null}
          </Box>
          {/* <Grid container justifyContent="center">
            <Grid item>
              <Link href="/signin" variant="body2">
                Вхід для менеджерів
              </Link>
            </Grid>
          </Grid> */}
        </Box>
      </Container>
    </>
  )
}
