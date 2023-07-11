import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJwtAuth } from '@/lib/jwt'

export const GET = (req: Request) => verifyJwtAuth(req, async () => {
    try {
        const { searchParams } = new URL(req.url)
        const firstName = searchParams.get('firstName') as string
        const lastName = searchParams.get('lastName')  as string

        const result = await prisma.child.findFirst({
            where: { firstName, lastName }
        })
        console.log('Find child result:', result)
        return NextResponse.json({ data: result, success: true })
    } catch (error) {
        console.log('Find child error:', error)
        return NextResponse.json({ error, success: false })
    }
})

