'use client'

import * as React from 'react'
import { useSWRConfig } from 'swr'
import { useForm, Controller } from 'react-hook-form'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import ControlledAccordions from '@/components/ControlledAccordions'
import BasicSelect from '@/components/BasicSelect'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

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

const ageList = [...Array(17 + 1).keys()].map(k => String(k)).slice(1)

// const fetcher = (url: string, options: object) => {
//   return fetch(url ,options).then((res) => {
//     if (!res.ok) {
//       return Promise.reject({
//         status: res.status,
//         message: `Response is not ok. ${res.statusText}`,
//       })
//     }
//     return res.json()
//   })
// }

const isEmptyObject = (obj: object) => {
  return typeof obj === 'object' && !Object.keys(obj).length
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

  console.log('errors=', errors);


  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  // const { data, error, isLoading } = useSWR('/api/course', fetcher)
  // const courses = data?.data

  const onSubmit = async (data: IRegisterCourseData) => {
    console.log(data)
    if (!isEmptyObject(errors)) {
      return
    }
    const response = await fetch('/api/course', { body: JSON.stringify(data), method: 'POST' })
    const signupResult = await response.json()
    if (signupResult) {
      mutate('/api/course')
      reset()
    }
  }

  return (
        <Box sx={{ minWidth: 500 }}>
          <ControlledAccordions courses={courses}/>
          <Button variant="contained" sx={{ width: '100%', marginTop: 2}} onClick={handleOpen}>Add course</Button>
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
                        label="Назва курсу"
                        margin="normal"
                        error={!!errors.title}
                        helperText={errors.title?.message}
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
                        onChange={onChange}
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
                        onChange={onChange}
                        value={value!}
                        label="Максимальний вік"
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
                Додати курс
              </Button>
            </Box>
          </Modal>
        </Box>
  )
}

export default  AdminCourses
