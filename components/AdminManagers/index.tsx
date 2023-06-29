'use client'

import * as React from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import PasswordTextField from '@/components/PasswordTextField'
import EnhancedTable from '@/components/Table'

interface IManager {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  isActive: boolean
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '1px solid grey',
  boxShadow: 24,
  p: 4,
}

const isEmptyObject = (obj: object) => {
  return typeof obj === 'object' && !Object.keys(obj).length
}

interface IRegisterManagerData {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
}

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  phone: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
}).required()

interface IAdminManagers {
  managers: IManager[]
}

const AdminManagers = ({ managers }: IAdminManagers) => {
  const { mutate } = useSWRConfig()
  const { control, handleSubmit, reset, formState: { errors } } = useForm<IRegisterManagerData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
    },
    resolver: yupResolver<IRegisterManagerData>(schema),
  })

  console.log('errors=', errors);


  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  // const { data, error, isLoading } = useSWR<IResponseData>('/api/manager', fetcher)
  // const managers = data?.data

  const onSubmit = async (data: IRegisterManagerData) => {
    console.log(data)
    if (!isEmptyObject(errors)) {
      return
    }
    const response = await fetch('/api/manager', { body: JSON.stringify(data), method: 'POST' })
    const signupResult = await response.json()
    console.log('signupResult=', signupResult);

    if (signupResult) {
      mutate('/api/manager')
      reset()
    }
  }

  const normalizedManagers = (managers as IManager[])?.map(m => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`,
    phone: m.phone,
    email: m.email,
    isActive: m.isActive,
  }))

  return (
        <Box sx={{ minWidth: 500 }}>
          <EnhancedTable rows={normalizedManagers} updateManagers={() => mutate('/api/manager')}/>
          <Button variant="contained" sx={{ width: '100%', marginTop: 2}} onClick={handleOpen}>Додати менеджера</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box id='courseForm' component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={style}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        onChange={onChange}
                        value={value!}
                        label="Ім'я"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        fullWidth
                        autoFocus
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        onChange={onChange}
                        value={value!}
                        label="Прізвище"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        onChange={onChange}
                        value={value!}
                        label="Телефон"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
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
                Додати менеджера
              </Button>
            </Box>
          </Modal>
        </Box>
  )
}

export default  AdminManagers
