import { DateSchema, DateSchemaConstructor } from 'yup'

declare module 'yup' {
    interface Schema {
        isValidPhone(phone?: string): Schema
    }
}

export const date: DateSchemaConstructor
