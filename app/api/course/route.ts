import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const body = await req.json()
    console.log(body);

    // const course = await prisma.course.create({
    //     data: {

    //     }
    // })

}