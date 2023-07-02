import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bcryptPassword } from '@/services/common'
import { ROLE } from '@/services/const'
import { verifyJwtAuth } from '@/lib/jwt'

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        console.log('UPDATE manager body:', body);

        const updatedManager = await prisma.manager.update({
            where: {
                id: body.id
            },
            data: {
                isActive: body.isActive,
            }
        })

        console.log('PATCH result:', updatedManager);
        return NextResponse.json({ data: updatedManager, success: true })
    } catch (error) {
        return NextResponse.json({ error, success: false })
    }
}

export async function POST(req: Request) {
    const body = await req.json()
    console.log('POST manager body:', body);

    const transaction = await prisma.$transaction(async (ctx) => {
        const managerAccount = await ctx.account.create({
            data: {
                email: body.email,
                password: await bcryptPassword(body.password),
                role: ROLE.MANAGER,
            }
        })

        const manager = await ctx.manager.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phone,
                isActive: true,
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

export const GET = (req: Request) => verifyJwtAuth(req, async () => {
    const managers = await prisma.manager.findMany({
        include: {
            account: {
                select: {
                    email: true,
                }
            }
        }
    })
    const normalizedData = managers.map(manager => ({
        id: manager.id,
        firstName: manager.firstName,
        lastName: manager.lastName,
        phone: manager.phone,
        email: manager.account.email,
        isActive: manager.isActive,
    }))
    return NextResponse.json({ data: normalizedData })
})
