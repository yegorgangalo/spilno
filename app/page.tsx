'use client'
import { useRouter } from 'next/navigation'

import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateField } from '@mui/x-date-pickers/DateField'
import { encode } from 'js-base64'
import BasicSelect from '@/components/BasicSelect'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const isEmptyObject = (obj: object) => {
  return typeof obj === 'object' && !Object.keys(obj).length
}

enum GENDER {
  MALE = 'жін',
  FEMALE = 'чол',
}

interface ISignUpData {
  parentFirstName: string
  parentLastName: string
  parentPhone: string
  parentEmail: string
  childFirstName: string
  childLastName: string
  childCity: string
  childDob: React.ChangeEvent<Element>
  childGender: string
  childAllowPhoto?: string
  terms?: string
}

const signUpSchema = yup.object().shape({
  parentFirstName: yup.string().required(),
  parentLastName: yup.string().required(),
  parentPhone: yup.string().required(),
  parentEmail: yup.string().email().required(),
  childFirstName: yup.string().required(),
  childLastName: yup.string().required(),
  childCity: yup.string().required(),
  childDob: yup.string().required(),
  childGender: yup.string().oneOf([GENDER.MALE, GENDER.FEMALE]).required(),
  childAllowPhoto: yup.string(),
  terms: yup.string(),
}).required()

export default function SignUp() {
  const router = useRouter()

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ISignUpData>({
    defaultValues: {
      parentFirstName: '',
      parentLastName: '',
      parentPhone: '',
      parentEmail: '',
      childFirstName: '',
      childLastName: '',
      childCity: '',
      childDob: '',
      childGender: '',
      childAllowPhoto: 'true',
      terms: 'true',
    },
    resolver: yupResolver<ISignUpData>(signUpSchema),
  })

  const onSubmit = async (data: ISignUpData) => {
    if (!isEmptyObject(errors)) {
      return
    }
    const response = await fetch('/api/signup', { body: JSON.stringify(data), method: 'POST' })
    const signupResult = await response.json()
    const encodedData = encodeURIComponent(encode(JSON.stringify(signupResult.data)))
    router.push(`/qrcode/${encodedData}`)
  }

  const genderList = [{ id: GENDER.MALE, title: GENDER.MALE }, { id: GENDER.FEMALE, title: GENDER.FEMALE }]

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
            Spilno
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h2" variant="h6">Інформація про опікуна</Typography>
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
                      helperText={errors.parentFirstName?.message}
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
                      helperText={errors.parentLastName?.message}
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
                    <TextField
                      onChange={onChange}
                      value={value!}
                      label="Електронна пошта"
                      error={!!errors.parentEmail}
                      helperText={errors.parentEmail?.message}
                      fullWidth
                      required
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
                      helperText={errors.childFirstName?.message}
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
                      helperText={errors.childLastName?.message}
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
                      helperText={errors.childCity?.message}
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
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField
                          onChange={onChange}
                          value={value!}
                          label="Дата народження"
                          error={!!errors.childDob}
                          helperText={errors.childDob?.message}
                          fullWidth
                          required
                        />
                      </LocalizationProvider>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Отримати QR-code
            </Button>
            {/* <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
      </Container>
  )
}
