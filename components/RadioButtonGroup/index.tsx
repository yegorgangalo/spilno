import * as React from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface IButtons {
  value: string
  label: string
}

interface IRadioButtonGroupProps {
  label: string
  buttons: IButtons[]
  value: string
  onChange: (value: string) => void
}

const RadioButtonGroup = ({ label, buttons, value, onChange }: IRadioButtonGroupProps) => {
  const handleChange = (event: React.MouseEvent<HTMLElement>, item: string) => {
    onChange(item)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
          m: 1,
        },
      }}
    >
      <FormControl sx={{ width: '100%'}}>
        <FormLabel>{label}</FormLabel>
        <ToggleButtonGroup
          color="primary"
          value={value}
          exclusive
          // size='large'
          onChange={handleChange}
          aria-label="Messenger"
          fullWidth
        >
          {buttons.map(b => <ToggleButton key={b.value} value={b.value}>{b.label}</ToggleButton>)}
        </ToggleButtonGroup>
      </FormControl>
    </Box>
  )
}

export default RadioButtonGroup
