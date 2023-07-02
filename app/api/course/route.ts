import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJwtAuth } from '@/lib/jwt'

export async function POST(req: Request) {
    const body = await req.json()
    console.log('POST course body:', body);

    const course = await prisma.course.create({
        data: {
            title: body.title,
            content: body.content,
            lowerAgeLimit: body.lowerAgeLimit,
            upperAgeLimit: body.upperAgeLimit,
        }
    })

    return NextResponse.json({ data: course })
}

export const GET = (req: Request) => verifyJwtAuth(req, async () => {
    const courses = await prisma.course.findMany()
    return NextResponse.json({ data: courses })
})
