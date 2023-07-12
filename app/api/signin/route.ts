import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signJwtAccessToken } from '@/lib/jwt'
import { comparePasswords } from '@/services/common'
import { ROLE } from '@/services/const'

interface IRequestBody {
    email: string
    password: string
}

export async function POST(req: Request) {
    try {
        const body: IRequestBody = await req.json()
        console.log('|-|>>>>>>>>>>>- signin request body=', body);

        const account = await prisma.account.findFirst({
            where: {
                email: body.email,
                OR: [{ role: ROLE.ADMIN }, { role: ROLE.MANAGER }]
            }
        })

        console.log('|-|>>>>>>>>>>>- signIn account=', account);

        if (!account) {
            return NextResponse.json({ error: { message: 'wrong_credentials'} })
        }

        const isSamePassword = await comparePasswords(body.password, account.password)

        console.log('|-|>>>>>>>>>>>- signIn isSamePassword=', isSamePassword);

        if (!isSamePassword) {
            return NextResponse.json({ error: { message: 'wrong_credentials' } })
        }

        if ([ROLE.MANAGER, ROLE.ADMIN].includes(account.role as ROLE)) {
            const manager = await prisma.manager.findFirst({
                where: {
                    accountId: account.id,
                }
            })

            console.log('|-|>>>>>>>>>>>- signIn manager=', manager);

            if (!manager?.isActive) {
                return NextResponse.json({ error: { message: 'access_denied' } })
            }

            const userWithoutPassword = { ...manager, email: account.email, role: account.role }

            const accessToken = signJwtAccessToken(userWithoutPassword)

            return NextResponse.json({ data: { ...userWithoutPassword, accessToken } })
        }

        return NextResponse.json({ error: { message: 'unhandled' } })
    } catch (error) {
        console.log('Signin error', error);
        return NextResponse.json({ error: { message: (error as Error).message } }, { status: 500 })
    }
}
