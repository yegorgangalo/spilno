import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bcryptPassword } from '@/services/common'
import { ROLE } from '@/services/const'
import { verifyJwtAuth } from '@/lib/jwt'
import { sendMail } from '@/services/mailService'

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
    try {
        const body = await req.json()
        console.log('Create manager body:', body);

        const transaction = await prisma.$transaction(async (ctx) => {
            const existedManagerAccount = await ctx.account.findFirst({
                where: {
                    email: body.email,
                    OR: [{ role: ROLE.ADMIN }, { role: ROLE.MANAGER}],
                }
            })

            if (existedManagerAccount) {
                throw Error('Account_email_key')
            }

            const managerAccount = await ctx.account.create({
                data: {
                    email: body.email,
                    password: await bcryptPassword(body.password),
                    role: body.role,
                }
            })

            const manager = await ctx.manager.create({
                data: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    phone: body.phone,
                    location: body.location,
                    isActive: true,
                    accountId: managerAccount.id,
                }
            })

            const html = `<div>
                            <div>
                              <img src="${process.env.BASE_URL}/logo.png" alt='logo' width="202" height="124">
                            </div>
                            <p>Вітаємо в команді "Спільно"</p>
                            <p>Ваші дані для входу:</p>
                            <p>Логін: <strong>${body.email}</strong></p>
                            <p>Пароль: <strong>${body.password}</strong></p>
                            <p><a href="${process.env.BASE_URL}/signin">увійти на сайт</a></p>
                        </div>`

            const isSentEmail = await sendMail({ subject: 'Дані для входу в Спільно. Unicef', toEmail: managerAccount.email, html })

            const data = {
                manager: { ...manager, email: managerAccount.email, role: managerAccount.role, isSentEmail },
            }
            return { data }
        })

        console.log('transaction manager result:', transaction);

        return NextResponse.json({ data: transaction.data, success: true })
    } catch (error) {
        const message = (error as Error).message
        if (message.includes('Manager_phone_key')) {
            return NextResponse.json({ error: { message: 'Менеджер чи адміністратор з даним телефоном вже зареєстрований', type: 'info' }, success: false })
        }
        if (message.includes('Account_email_key')) {
            return NextResponse.json({ error: { message: 'Менеджер чи адміністратор з даним email вже зареєстрований', type: 'info' }, success: false })
        }
        return NextResponse.json({ error, success: false })
    }
}

export const GET = (req: Request) => verifyJwtAuth(req, async () => {
    try {
        const managers = await prisma.manager.findMany({
            include: {
                account: {
                    select: {
                        email: true,
                        role: true
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
            role: manager.account.role,
            location: manager.location,
            isActive: manager.isActive,
        }))
        return NextResponse.json({ data: normalizedData, success: true })
    } catch (error) {
        return NextResponse.json({ error, success: false })
    }
})
