import shortid from 'shortid'
import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 6

export const createPassword = () => {
  return bcrypt.hash(shortid.generate(), SALT_ROUNDS)
}

export const bcryptPassword = (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePasswords = (requestPassword: string, dbPassword: string) => {
  return bcrypt.compare(requestPassword, dbPassword)
}

export const generateFakeEmail = (name: string) => {
    const emailName = name.replace(/\s+/ig, '_').toLowerCase();
    return `fake_${emailName}@spilno.com`;
  }

export const isFakeEmail = (email: string) => {
    return email.match(/fake_\d{10,}_.*@spilno\.com/) !== null;
}

export const fetcher = (url: string, options: object) => {
    return fetch(url ,options).then((res) => {
      if (!res.ok) {
        return Promise.reject({
          status: res.status,
          message: `Response is not ok. ${res.statusText}`,
        })
      }
      return res.json()
    })
  }

export const isEmptyObject = (obj: object) => {
  return typeof obj === 'object' && !Object.keys(obj).length
}