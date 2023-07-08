import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJwtAuth } from '@/lib/jwt'

export async function POST(req: Request) {
    try {
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

        return NextResponse.json({ data: course, success: true })
    } catch (error) {
        const message = (error as Error).message
        if (message.includes('Course_title_key')) {
            return NextResponse.json({ error: { message: 'Курс з такою назвою вже існує', type: 'info' }, success: false })
        }
        return NextResponse.json({ error, success: false })
    }
}

export const GET = (req: Request) => verifyJwtAuth(req, async () => {
    try {
        const courses = await prisma.course.findMany()
        return NextResponse.json({ data: courses, success: true })
    } catch (error) {
        return NextResponse.json({ error, success: false })
    }
})
