'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import Image from 'next/image'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import PasswordTextField from '@/components/PasswordTextField'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ROLE } from '@/services/const'
import { isEmptyObject, getEventWithTrimTargetValue } from '@/app/frontend-services/helpers'

interface ISigninManagerData {
  email: string
  password: string
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
}).required()

const SignInPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/manage/child-course'
  const { control, handleSubmit, formState: { errors } } = useForm<ISigninManagerData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver<ISigninManagerData>(schema),
  })

  React.useEffect(() => {
    if (session?.user && !searchParams.has('message')) {
      router.push(session?.user.role === ROLE.ADMIN ? '/admin' : '/manage/child-course')
    }
  }, [router, searchParams, session])

  const onSubmit = async (data: ISigninManagerData) => {
    console.log(data)
    if (!isEmptyObject(errors)) {
      return
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl
    });
  }

  const errorMessageMap = {
    noaccess: 'Авторизуйтесь',
    wrong_credentials: 'Невірні логін чи пароль',
    access_denied: 'Ваш акаунт неактивний',
    server_error: 'помилка серверу'
  }

  const errorMessage = errorMessageMap[searchParams.get('message') as keyof typeof errorMessageMap]
  const showSignInError = searchParams.has('error')

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
          <Image src='logo_vertical.svg' alt='logo' width='240' height='360' />
          {!!errorMessage && <Typography component="h6" variant="h6" color='red'>{errorMessage}</Typography>}
          {showSignInError && <Typography component="h6" variant="h6" color='red'>Помилка аутентифікації</Typography>}
            <Box id='courseForm' component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        onChange={(e) => onChange(getEventWithTrimTargetValue(e as React.ChangeEvent<HTMLInputElement>))}
                        value={value!}
                        label="Електронна пошта"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <PasswordTextField
                        onChange={(e) => onChange(getEventWithTrimTargetValue(e as React.ChangeEvent<HTMLInputElement>))}
                        value={value!}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        fullWidth
                        required
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
                  Авторизуватися
                </Button>
              </Grid>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link href="/">На головну</Link>
                </Grid>
              </Grid>
            </Box>
        </Box>
    </Container>
  )
}

export default SignInPage
