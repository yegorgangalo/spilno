import shortid from 'shortid'
import * as bcrypt from 'bcrypt'

export const createPassword = () => {
    return bcrypt.hash(shortid.generate(), 6)
}

export const generateFakeEmail = (name: string) => {
    const emailName = name.replace(/\s+/ig, '_').toLowerCase();
    return `fake_${emailName}@spilno.com`;
  }

export const isFakeEmail = (email: string) => {
    return email.match(/fake_\d{10,}_.*@spilno\.com/) !== null;
}

export const decode = (data: object) => {
    return Buffer.from(JSON.stringify(data)).toString('base64')
}

export const encode = (string: string) => {
    return Buffer.from(string, 'base64').toString('ascii')
}
