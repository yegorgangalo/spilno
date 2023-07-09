import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJwtAuth } from '@/lib/jwt'

export const POST = (req: Request) => verifyJwtAuth(req, async () => {
    try {
        const body = await req.json()
        console.log('POST assign-child-course body:', body)

        const result = await prisma.courseChildRelation.create({
            data: {
                courseId: body.courseId,
                childId: body.childId,
                visitTime: body.visitTime,
            }
        })
        console.log('Assign child course result:', result)
        return NextResponse.json({ data: result, success: true })
    } catch (error) {
        console.log('Assign child course error:', error)
        return NextResponse.json({ error, success: false })
    }
})

