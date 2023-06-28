import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

export async function GET(req: Request) {
    console.log('get courses start');

    const courses = await prisma.course.findMany()
    console.log('get courses result:', courses);
    return NextResponse.json({ data: courses })
}
