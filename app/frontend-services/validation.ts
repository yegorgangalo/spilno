import { parsePhoneNumber, CountryCode } from 'libphonenumber-js'
import * as yup from 'yup'

export function isValidPhone(this: yup.Schema , message: string, country?: CountryCode) {
  return this.test('isValidPhone', message, function (formPhoneValue: string) {
    const { path, createError } = this
    const yupError = createError({ path, message: 'введіть український телефон' })
    try {
      const isValid = parsePhoneNumber(formPhoneValue, country || 'UA').isValid() //need trycatch
      return isValid || yupError
    } catch (err) {
      return yupError
    }
  })
}
