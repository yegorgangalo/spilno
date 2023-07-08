import { ROLE } from "@/services/const"

export interface IManager {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  location: string
  role: ROLE
  isActive: boolean
}
