import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { NextResponse } from 'next/server'

interface SignOption {
  expiresIn?: string | number
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: '365d',
}

export const signJwtAccessToken = (payload: JwtPayload, options: SignOption = DEFAULT_SIGN_OPTION) => {
  const secret_key = process.env.JWT_SECRET_KEY
  const token = jwt.sign(payload, secret_key!, options)
  return token
}

const verifyJwt = (token: string) => {
  try {
    if (!token.includes('bearer')) {
      throw Error('wrong type of token')
    }
    const tokenWithoutBearer = token.split(' ')[1]
    const secret_key = process.env.JWT_SECRET_KEY as Secret
    const decoded = jwt.verify(tokenWithoutBearer, secret_key)
    return decoded as JwtPayload
  } catch (error) {
    console.log('verifyJwt error:', { error: (error as Error).message, token })
    return null
  }
}

export function verifyJwtAuth(req: Request, requestHandler: Function) {
  try {
    const accessToken = req.headers.get('authorization')
    if (!accessToken || !verifyJwt(accessToken)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }
    return requestHandler()
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}