import { GENDER, MESSENGER } from '@/app/frontend-services/enums'
import { ROLE } from '@/services/const'

export const genderList = [{ id: GENDER.MALE, title: GENDER.MALE }, { id: GENDER.FEMALE, title: GENDER.FEMALE }]

export const messengerList = [
  { value: MESSENGER.TELEGRAM, label: MESSENGER.TELEGRAM },
  { value: MESSENGER.VIBER, label: MESSENGER.VIBER },
  { value: MESSENGER.WHATSAPP, label: MESSENGER.WHATSAPP },
  { value: MESSENGER.SMS, label: MESSENGER.SMS },
]

export const ageList = [...Array(17 + 1).keys()].map(k => ({ id: String(k), title: String(k)})).slice(1)

export const availableManagerRoles = [{ id: ROLE.MANAGER, title: 'Менеджер' }, { id: ROLE.ADMIN, title: 'Адміністратор' }]
