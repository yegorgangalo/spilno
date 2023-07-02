import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateFakeEmail, createPassword } from '@/services/common'
import { ROLE } from '@/services/const'

interface Parent {
    id: number,
    firstName: string,
    lastName : string,
    phone    : string,
    messenger: string,
    terms    : boolean,
    accountId: number,
    createdAt: Date,
}

interface Child {
    id: number,
    firstName: string,
    lastName : string,
    dob      : string,
    gender   : string,
    city     : string,
    allowPhoto: boolean,
    accountId: number,
    createdAt: Date,
}

export async function POST(req: Request) {
    const body = await req.json()
    console.log(body);

    const transaction = await prisma.$transaction(async (ctx) => {
    let parentAccount = null
    let parent: Parent | null = null
    let childAccount = null
    let child: Child | null = null

    const childFakeEmail = generateFakeEmail(`${body.childFirstName} ${body.childLastName}`)

    parentAccount = await ctx.account.findFirst({
        where: {
            email: body.parentEmail,
            role: ROLE.PARENT,
        }
    })

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
              allowPhoto: !!body.childAllowPhoto,
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
              messenger: 'any',
              terms: !!body.terms as boolean,
              accountId: parentAccount.id,
            },
          })
    } else {
        parent = await ctx.parent.findFirst({
            where: {
                accountId: parentAccount.id,
            }
        })
    }

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
  return NextResponse.json({ data: transaction.data })
}
