import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Box from '@mui/material/Box'

interface BasicSelectProps {
    name: string,
    label: string,
    required?: boolean,
    menuItems: string[],
    value: string,
    onChange: (value: string) => void,
    error?: boolean,
  }

const BasicSelect = ({ name, label, required = false, menuItems, value, onChange, error }: BasicSelectProps) => {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as string)
    }

    return (
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth error={error}>
          <InputLabel id={name}>{label}</InputLabel>
          <Select
            id={name}
            value={value  as string}
            label={label}
            onChange={handleChange}
            name={name}
            required={required}
          >
            {menuItems.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </Select>
          {error ? <FormHelperText>Required field</FormHelperText> : null}
        </FormControl>
      </Box>
    )
  }

export default BasicSelect
