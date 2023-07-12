export const isEmptyObject = (obj: object) => {
  return typeof obj === 'object' && !Object.keys(obj).length
}

export const calculateFullYears = (dateString: string) => {
  const today = new Date()
  const pastDate = new Date(dateString)
  const yearsDiff = today.getFullYear() - pastDate.getFullYear()

  // Check if the current month and day are before the pastDate's month and day
  if (
    today.getMonth() < pastDate.getMonth() ||
    (today.getMonth() === pastDate.getMonth() && today.getDate() < pastDate.getDate())
  ) {
    return yearsDiff - 1
  }

  return yearsDiff
}

interface CreateAgeLimitsNotificationProps {
  lowerAgeLimit: number,
  upperAgeLimit: number,
}

export const createAgeLimitsNotification = ({ lowerAgeLimit, upperAgeLimit }: CreateAgeLimitsNotificationProps) => {
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

export const getCurrentTimeRoundedUpToTensMinutes = () => {
  const currentTime = new Date()
  currentTime.setSeconds(0)
  currentTime.setMilliseconds(0)
  const minutes = currentTime.getMinutes()
  const roundedMinutes = Math.ceil(minutes / 10) * 10
  currentTime.setMinutes(roundedMinutes)
  return currentTime
}

export const getEventWithTrimTargetValue = (event: React.ChangeEvent<HTMLInputElement>) => {
  event.target.value = event.target.value.trim()
  return event
}
