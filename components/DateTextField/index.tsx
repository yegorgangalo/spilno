import * as React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { DateField } from '@mui/x-date-pickers/DateField'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Moment } from 'moment'

interface IDateTextFieldProps {
    onChange: (event: Moment) => void
    value: Moment
    error?: boolean
    helperText: string
}

const DateTextField = ({ onChange, value, error, helperText }: IDateTextFieldProps) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              onChange={(event) => {
                onChange(event as Moment);
              }}
              value={value}
              label='Дата народження'
              // @ts-ignore
              error={error}
              helperText={error ? helperText : ''}
              disableFuture
              sx={{ width: '100%' }}
              format='DD/MM/YYYY'
            />
        </LocalizationProvider>
    )
}

export default DateTextField
