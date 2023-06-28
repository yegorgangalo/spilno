// 'use client'
import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Box from '@mui/material/Box'

interface BasicSelectProps {
    name: string,
    label: string,
    required?: boolean,
    menuItems: string[],
    value: string,
    // onChange: (value: string | number) => void,
    onChange: (event: any) => void,
  }

const BasicSelect = ({ name, label, required = false, menuItems, value, onChange }: BasicSelectProps) => {
    // const [gender, setGender] = React.useState('')

    const handleChange = (event: SelectChangeEvent) => {
    //   setGender(event.target.value as string)
        onChange(event.target.value as string | number)
    }

    return (
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id={name}>{label}</InputLabel>
          <Select
            id={name}
            // value={gender}
            value={value  as string}
            label={label}
            onChange={handleChange}
            name={name}
            required={required}
          >
            {menuItems.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
    )
  }

export default BasicSelect
