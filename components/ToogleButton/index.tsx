import * as React from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

enum MESSENGER {
  TELEGRAM = 'telegram',
  VIBER = 'viber',
  WHATSAPP = 'whatsapp',
}

export default function ColorToggleButton() {
  const [alignment, setAlignment] = React.useState(MESSENGER.TELEGRAM)

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: MESSENGER,
  ) => {
    setAlignment(newAlignment)
  }

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value={MESSENGER.TELEGRAM}>Telegram</ToggleButton>
      <ToggleButton value={MESSENGER.VIBER}>Viber</ToggleButton>
      <ToggleButton value={MESSENGER.WHATSAPP}>WhatsApp</ToggleButton>
    </ToggleButtonGroup>
  )
}
