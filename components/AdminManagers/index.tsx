'use client'

import * as React from 'react'
import { useSWRConfig } from 'swr'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import PasswordTextField from '@/components/PasswordTextField'
import EnhancedTable from '@/components/Table'
import { isValidPhone } from '@/app/frontend-services/validation'
import { parsePhoneNumber } from 'libphonenumber-js'

interface IManager {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  location: string
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
  location: string
}

yup.addMethod<yup.Schema>(yup.Schema, 'isValidPhone', isValidPhone)
const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  phone: yup.string().isValidPhone().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  location: yup.string().required(),
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
      location: '',
    },
    resolver: yupResolver<IRegisterManagerData>(schema),
  })

  const [apiError, setApiError] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const onSubmit = async (data: IRegisterManagerData) => {
    console.log(data)
    if (!isEmptyObject(errors)) {
      return
    }
    data.phone = parsePhoneNumber(data.phone, 'UA').number
    const response = await fetch('/api/manager', { body: JSON.stringify(data), method: 'POST' })
    const managerSignupResult = await response.json()
    console.log('managerSignupResult=', managerSignupResult);

    if (managerSignupResult.success) {
      mutate('/api/manager')
      reset()
    } else {
      setApiError(managerSignupResult.error.message)
    }
  }

  const normalizedManagers = (managers as IManager[])?.map(m => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`,
    phone: m.phone,
    email: m.email,
    location: m.location,
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
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={style}>
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
                    name="location"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        onChange={onChange}
                        value={value!}
                        label="Локація"
                        error={!!errors.location}
                        helperText={errors.location?.message}
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
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  >
                  Додати менеджера
                </Button>
                </Grid>
              {apiError ? <Grid item xs={12}>
              <Alert severity='info'>
                <AlertTitle>info</AlertTitle>
                {apiError}
              </Alert>
            </Grid> : null}
            </Box>
          </Modal>
        </Box>
  )
}

export default  AdminManagers
