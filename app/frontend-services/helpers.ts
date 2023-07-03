export const isEmptyObject = (obj: object) => {
  return typeof obj === 'object' && !Object.keys(obj).length
}
