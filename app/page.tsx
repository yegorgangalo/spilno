'use client'
import { useRouter } from 'next/navigation'

import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
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
// import { decode } from '@/services/common'
// import { encode, decode } from 'string-encode-decode'
import { encode } from 'js-base64'

// const encode = (data: object) => {
//   return Buffer.from(JSON.stringify(data)).toString('base64')
// }

enum genderType {
  MALE = 'Male',
  FEMALE = 'Female',
}

interface BasicSelectProps {
  name?: string,
}

const BasicSelect = ({ name }: BasicSelectProps) => {
  const [gender, setGender] = React.useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setGender(event.target.value as string)
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="gender">Gender</InputLabel>
        <Select
          labelId="gender"
          id="gender"
          value={gender}
          label="Gender"
          onChange={handleChange}
          name={name}
        >
          <MenuItem value={genderType.FEMALE}>{genderType.FEMALE}</MenuItem>
          <MenuItem value={genderType.MALE}>{genderType.MALE}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default function SignUp() {
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    // console.log(data)
    const response = await fetch('/api/signup', { body: JSON.stringify(data), method: 'POST' })
    const signupResult = await response.json()
    const encodedData = encodeURIComponent(encode(JSON.stringify(signupResult.data)))
    console.log('handleSubmit encodedData=', encodedData)

    router.push(`/qrcode/${encodedData}`)
  }

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h2" variant="h6">Parent information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="parentFirstName"
                  required
                  fullWidth
                  id="parentFirstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="parentLastName"
                  label="Last Name"
                  name="parentLastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="parentPhone"
                  label="Phone number"
                  name="parentPhone"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="parentEmail"
                  label="Email Address"
                  name="parentEmail"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography component="h2" variant="h6">Child information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="childFirstName"
                  required
                  fullWidth
                  id="childFirstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="childLastName"
                  label="Last Name"
                  name="childLastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="childCity"
                  label="City"
                  name="childCity"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateField label="Basic date field" id="childDob" name="childDob" />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <BasicSelect name="childGender"/>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox color="primary" defaultChecked />}
                  label="Я надаю дозвіл на фотографування своєї дитини"
                  name="childAllowPhoto"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox color="primary" defaultChecked />}
                  label="Я погоджуюсь на обробку персональних даних"
                  name="terms"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Get QR-code
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
