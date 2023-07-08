import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Box from '@mui/material/Box'

interface ImenuItem {
  id: string | number
  title: string
}
interface BasicSelectProps {
    name: string,
    label: string,
    required?: boolean,
    menuItems: ImenuItem[],
    value: string | number | null,
    onChange: (value: string | number) => void,
    error?: boolean,
    helperText?: string
  }

const BasicSelect = ({ name, label, required = false, menuItems, value, onChange, error, helperText }: BasicSelectProps) => {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as string | number)
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
            {menuItems.map(i => <MenuItem key={i.id} value={i.id}>{i.title}</MenuItem>)}
          </Select>
          {error ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
      </Box>
    )
  }

export default BasicSelect
