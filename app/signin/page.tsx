'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import PasswordTextField from '@/components/PasswordTextField'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

const isEmptyObject = (obj: object) => {
  return typeof obj === 'object' && !Object.keys(obj).length
}

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
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ISigninManagerData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver<ISigninManagerData>(schema),
  })

  React.useEffect(() => {
    if (session?.user && !searchParams.has('message')) {
      router.push('/manage/child-course')
    }
  }, [router, searchParams, session])

  const onSubmit = async (data: ISigninManagerData) => {
    console.log(data)
    if (!isEmptyObject(errors)) {
      return
    }

    const signinResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl
    });

    console.log('signinResult=', signinResult);

    if (!signinResult?.ok) {
      console.log('error signin', signinResult);
    }
  }

  const showNoAccessMessage = searchParams.get('message') === 'noaccess'

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
          {showNoAccessMessage && <Typography component="h6" variant="h6">Авторизуйтесь</Typography>}
            <Box id='courseForm' component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        onChange={onChange}
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
                        onChange={onChange}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Авторизуватися
              </Button>
            </Box>
        </Box>
    </Container>
  )
}

export default SignInPage