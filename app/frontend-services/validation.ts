import { parsePhoneNumber } from 'libphonenumber-js'

export function isValidPhone (message: string, country: string) {
  return this.test('isValidPhone', message, function (formPhoneValue) {
    const { path, createError } = this
    const yupError = createError({ path, message: 'введіть український телефон' })
    try {
      const isValid = parsePhoneNumber(formPhoneValue, country || 'UA').isValid() //need trycatch
      return isValid || yupError
      return !!isValid
    } catch (err) {
      return yupError
    }
  })
}
