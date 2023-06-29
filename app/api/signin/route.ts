import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { comparePasswords } from '@/services/common'
import { ROLE } from '@/services/const'

const prisma = new PrismaClient()

interface IRequestBody {
    email: string
    password: string
}

export async function POST(req: Request) {
    const body: IRequestBody = await req.json()
    console.log('signin body=', body);

    const account = await prisma.account.findFirst({
        where: {
            email: body.email,
        }
    })

    if (!account) {
        return NextResponse.json({ error: { message: 'Wrong credentials'} })
    }

    const isSamePassword = await comparePasswords(body.password, account.password)

    if (!isSamePassword) {
        return NextResponse.json({ error: { message: 'Wrong credentials' } })
    }

    if (account.role === ROLE.MANAGER) {
        const manager = await prisma.manager.findFirst({
            where: {
                accountId: account.id,
            }
        })

        if (!manager?.isActive) {
            return NextResponse.json({ error: { message: 'Access denied' } })
        }

        return NextResponse.json({ data: { ...manager, email: account.email, role: account.role } })
    }

  return NextResponse.json({ data: {} })
}
