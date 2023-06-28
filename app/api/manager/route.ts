import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createPassword } from '@/services/common'
import { ROLE } from '@/services/const'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const body = await req.json()
    console.log('POST manager body:', body);

    const transaction = await prisma.$transaction(async (ctx) => {
        const managerAccount = await ctx.account.create({
            data: {
                email: body.email,
                password: await createPassword(),
                role: ROLE.MANAGER,
            }
        })

        const manager = await ctx.manager.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phone,
                accountId: managerAccount.id,
            }
        })

        const data = {
            manager: { ...manager, email: managerAccount.email },
        }
        return { data }
    })

    console.log('transaction manager result:', transaction);

    return NextResponse.json({ data: transaction.data })
}

export async function GET(req: Request) {
    console.log('get managers start');

    const managers = await prisma.manager.findMany()
    console.log('get managers result:', managers);
    return NextResponse.json({ data: managers })
}
