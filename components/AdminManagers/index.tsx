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
import BasicSelect from '@/components/BasicSelect'
import { isValidPhone } from '@/app/frontend-services/validation'
import { parsePhoneNumber } from 'libphonenumber-js'
import { ROLE } from '@/services/const'
import { IManager } from '@/app/ts/interfaces/IManager.interface'
import { availableManagerRoles } from '@/app/frontend-services/data'

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

type OmittedProps = 'id' | 'isActive'
interface IRegisterManagerData extends Omit<IManager, OmittedProps> {
  password: string
}

yup.addMethod<any>(yup.Schema, 'isValidPhone', isValidPhone)
const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  phone: yup.string().isValidPhone().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  location: yup.string().required(),
  role: yup.string().required(),
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
      role: ROLE.MANAGER,
    },
    resolver: yupResolver<IRegisterManagerData>(schema as any),
  })

  const [apiError, setApiError] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    apiError && setApiError('')
    reset()
  }

  const onSubmit = async (data: IRegisterManagerData) => {
    apiError && setApiError('')
    if (!isEmptyObject(errors)) {
      return
    }
    try {
      data.phone = parsePhoneNumber(data.phone, 'UA').number
      const response = await fetch('/api/manager', { body: JSON.stringify(data), method: 'POST' })
      const managerSignupResult = await response.json()

      if (managerSignupResult.success) {
        mutate('/api/manager')
        reset()
      } else {
        setApiError(managerSignupResult.error.message)
      }
    } catch (error) {
      console.log('managerSignup error:', error);
      setApiError('Помилка на сервері. Менеджера не додано')
    }
  }

  const normalizedManagers = (managers as IManager[])?.map(m => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`,
    phone: m.phone,
    email: m.email,
    location: m.location,
    role: m.role,
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BasicSelect
                        name="role"
                        menuItems={availableManagerRoles}
                        onChange={(id) => onChange(id as ROLE)}
                        value={value ?? ''}
                        label="Роль"
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
              {apiError
                ? <Grid item xs={12}>
                    <Alert severity='info'>
                      <AlertTitle>info</AlertTitle>
                      {apiError}
                    </Alert>
                  </Grid>
                : null
              }
            </Box>
          </Modal>
        </Box>
  )
}

export default  AdminManagers
