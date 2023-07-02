import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Course {
  id: number,
  title: string,
  content: string,
  lowerAgeLimit: number,
  upperAgeLimit: number,
}

interface CreateAgeLimitsNotificationProps {
  lowerAgeLimit: number,
  upperAgeLimit: number,
}

interface ControlledAccordionsProps {
  courses: Course[]
}

export default function ControlledAccordions({ courses }: ControlledAccordionsProps) {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  }

  const createAgeLimitsNotification = ({ lowerAgeLimit, upperAgeLimit }: CreateAgeLimitsNotificationProps) => {
    if (lowerAgeLimit && upperAgeLimit) {
      return `${lowerAgeLimit}-${upperAgeLimit} років`
    }
    if (lowerAgeLimit && !upperAgeLimit) {
      return `з ${lowerAgeLimit} років`
    }
    if (!lowerAgeLimit && upperAgeLimit) {
      return `до ${upperAgeLimit} років`
    }
    return ''
  }

  return (
    <div>
      {courses?.map(({ id, title, content, lowerAgeLimit, upperAgeLimit }) => {
      const hasAgeLimits = !!(lowerAgeLimit || upperAgeLimit)
        return (
          <Accordion key={id} expanded={expanded === String(id)} onChange={handleChange(String(id))}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={String(id)}
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>{title}</Typography>
              {hasAgeLimits && <Typography sx={{ color: 'text.secondary' }}>
                {createAgeLimitsNotification({ lowerAgeLimit, upperAgeLimit })}
                </Typography>}
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: 'text.secondary' }}>{content}</Typography>
            </AccordionDetails>
          </Accordion>
      )}
      )}
    </div>
  )
}
