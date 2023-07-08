'use client'

import * as React from 'react'
import { useSWRConfig } from 'swr'
import { useForm, Controller } from 'react-hook-form'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import ControlledAccordions from '@/components/ControlledAccordions'
import BasicSelect from '@/components/BasicSelect'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { isEmptyObject } from '@/app/frontend-services/helpers'
import { ageList } from '@/app/frontend-services/data'

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

interface IRegisterCourseData {
  title: string
  content?: string
  lowerAgeLimit?: string
  upperAgeLimit?: string
}

const schema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string(),
  lowerAgeLimit: yup.string(),
  upperAgeLimit: yup.string(),
}).required()

interface Course {
  id: number,
  title: string,
  content: string,
  lowerAgeLimit: number,
  upperAgeLimit: number,
}

interface IAdminCoursesProps {
  courses: Course[]
}

const AdminCourses = ({ courses }: IAdminCoursesProps) => {
  const { mutate } = useSWRConfig()
  const { control, handleSubmit, reset, formState: { errors } } = useForm<IRegisterCourseData>({
    defaultValues: {
      title: '',
      content: '',
      lowerAgeLimit: '',
      upperAgeLimit: '',
    },
    resolver: yupResolver<IRegisterCourseData>(schema),
  })

  const [apiError, setApiError] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    apiError && setApiError('')
    reset()
  }

  const onSubmit = async (data: IRegisterCourseData) => {
    apiError && setApiError('')
    if (!isEmptyObject(errors)) {
      return
    }
    try {
      const response = await fetch('/api/course', { body: JSON.stringify(data), method: 'POST' })
      const createCourseResult = await response.json()
      if (createCourseResult.success) {
        mutate('/api/course')
        reset()
      } else {
        setApiError(createCourseResult.error.message)
      }
    } catch (error) {
      console.log('createCourse error:', error);
      setApiError('Помилка на сервері. Курс не додано')
    }
  }

  return (
        <Box sx={{ minWidth: 500 }}>
          <ControlledAccordions courses={courses}/>
          <Button variant="contained" sx={{ width: '100%', marginTop: 2}} onClick={handleOpen}>Створити курс</Button>
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
                    name="title"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        onChange={onChange}
                        value={value!}
                        label='Назва курсу'
                        margin='normal'
                        error={!!errors.title}
                        helperText={!!errors.title ? 'Введіть назву курсу' : ''}
                        fullWidth
                        autoFocus
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        onChange={onChange}
                        value={value!}
                        label="Опис курсу"
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="lowerAgeLimit"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BasicSelect
                        name="lowerAgeLimit"
                        menuItems={ageList}
                        onChange={(id) => onChange(String(id))}
                        value={value!}
                        label="Мінімальний вік"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="upperAgeLimit"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BasicSelect
                        name="upperAgeLimit"
                        menuItems={ageList}
                        onChange={(id) => onChange(String(id))}
                        value={value!}
                        label="Максимальний вік"
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
                  Додати курс
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

export default  AdminCourses
