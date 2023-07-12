import { FC, MouseEvent, ChangeEvent, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import FormHelperText from '@mui/material/FormHelperText'

interface PasswordTextFieldProps {
  label?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement> ) => void
  helperText?: string
  error?: boolean
  fullWidth?: boolean
  required?: boolean
}

const PasswordTextField: FC<PasswordTextFieldProps> = ({ value, onChange, helperText = 'Вкажіть коректний пароль', error, label = 'Пароль', fullWidth, required }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(state => !state)
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const showErrorText = helperText && error

  return (<FormControl variant="outlined" error={error} fullWidth={fullWidth} required={required}>
    <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
    <OutlinedInput
      id="outlined-adornment-password"
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      label="Password"
    />
    {showErrorText && <FormHelperText id="outlined-error-helper-text">{helperText}</FormHelperText>}
  </FormControl>)
}

export default PasswordTextField
