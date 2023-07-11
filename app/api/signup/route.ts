import { NextResponse } from 'next/server'
import { encode } from 'js-base64'
import QRCode from 'qrcode'
import { prisma } from '@/lib/prisma'
import { generateFakeEmail, createPassword } from '@/services/common'
import { ROLE } from '@/services/const'
import { sendMail } from '@/services/mailService'

interface Parent {
    id       : number,
    firstName: string,
    lastName : string,
    phone    : string,
    messenger: string,
    terms    : boolean,
    accountId: number,
    createdAt: Date,
}

interface Child {
    id        : number,
    firstName : string,
    lastName  : string,
    dob       : string,
    gender    : string,
    city      : string,
    allowPhoto: boolean,
    accountId : number,
    createdAt : Date,
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('signup incoming data:', { body });

    const transaction = await prisma.$transaction(async (ctx) => {
        let parentAccount = null
        let parent: Parent | null = null
        let childAccount = null
        let child: Child | null = null

        const childFakeEmail = generateFakeEmail(`${body.childFirstName} ${body.childLastName}`)

        //-------parent start--------
        parentAccount = await ctx.account.findFirst({
            where: {
                email: body.parentEmail,
                role: ROLE.PARENT,
            }
        })

        if (!parentAccount) {
            parentAccount = await ctx.account.create({
                data: {
                    email: body.parentEmail,
                    password: await createPassword(),
                    role: ROLE.PARENT,
                }
            })

            parent = await ctx.parent.create({
                data: {
                  firstName: body.parentFirstName,
                  lastName: body.parentLastName,
                  phone: body.parentPhone,
                  messenger: body.parentMessenger,
                  terms: body.terms,
                  accountId: parentAccount.id,
                },
            })
        } else {
            parent = await ctx.parent.findFirst({
                where: {
                    accountId: parentAccount.id,
                }
            })

            console.log('DB parent phone=', parent?.phone);
            console.log('Request body.parentPhone=', body.parentPhone);
            if (parent?.phone !== body.parentPhone) {
                throw Error('Account_email_key')
            }
        }
        //-------parent end--------

        //-------child start--------
        childAccount = await ctx.account.findFirst({
            where: {
                email: childFakeEmail,
                role: ROLE.CHILD,
            }
        })

        if (!childAccount) {
            childAccount = await ctx.account.create({
                data: {
                    email: childFakeEmail,
                    password: await createPassword(),
                    role: ROLE.CHILD,
                }
            })

            child = await ctx.child.create({
                data: {
                  firstName: body.childFirstName,
                  lastName: body.childLastName,
                  dob: body.childDob,
                  gender: body.childGender,
                  city: body.childCity,
                  allowPhoto: body.childAllowPhoto,
                  accountId: childAccount.id,
                },
            })
        } else {
            child = await ctx.child.findFirst({
                where: {
                    accountId: childAccount.id,
                }
            })
        }
        //-------child end--------

        const currentParentChildRelation = await ctx.parentChildRelation.findFirst({
            where: {
                parentId: (parent as Parent).id,
                childId: (child as Child).id,
            }
        })

        if (!currentParentChildRelation) {
            await ctx.parentChildRelation.create({
                data: {
                    parentId: (parent as Parent).id,
                    childId: (child as Child).id,
                }
            })
        }

        const data = {
            parent: { ...parent, email: parentAccount.email },
            child: { ...child, email: childAccount.email },
        }
        return { data }
    })

    const reqUrl = new URL(req.url)
    console.log('signup QR-code reqUrl=', reqUrl);
    const encodedData = encodeURIComponent(encode(JSON.stringify(transaction.data)))
    const QrCodeUrl = await QRCode.toDataURL(`${reqUrl.origin}/qrcode/${encodedData}`)
    const html = `<p>QR-code для ${body.childFirstName} ${body.childLastName}:</p>
                  </br><img src="${QrCodeUrl}" width="512" height="512"></br></br>
                  <p>Або за посиланням:</p></br>
                  <a href=${reqUrl.origin}/qrcode/${encodedData}>подивитись qr-code</a>`
    const isSentEmail = await sendMail({ subject: 'Спільно. Unicef. QR-code', toEmail: body.parentEmail, html })

    return NextResponse.json({ data: transaction.data, isSentEmail, success: true })
  } catch(error) {
    console.log('signup route error:', error)
    const message = (error as Error).message
    if (message.includes('Parent_phone_key')) {
        return NextResponse.json({ error: { message: 'Даний телефон вже зареєстрований', type: 'info' }, success: false })
    }
    if (message.includes('Account_email_key')) {
        return NextResponse.json({ error: { message: 'Даний емейл вже зареєстрований з іншим номером телефону', type: 'info' }, success: false })
    }
    return NextResponse.json({ error, success: false })
  }
}
