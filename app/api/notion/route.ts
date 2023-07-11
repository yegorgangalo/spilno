const { Client } = require("@notionhq/client")
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJwtAuth } from '@/lib/jwt'

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// const listUsersResponse = await notion.users.list({})
// export const GET = (req: Request) => verifyJwtAuth(req, async () => {
export const GET = async (req: Request) => {
    try {
        const listUsersResponse = await notion.users.list({})
        // const { searchParams } = new URL(req.url)
        // const firstName = searchParams.get('firstName') as string
        // const lastName = searchParams.get('lastName')  as string

        // const result = await prisma.child.findFirst({
        //     where: { firstName, lastName }
        // })
        console.log('NOTION =>>> listUsersResponse:', listUsersResponse)
        return NextResponse.json({ data: listUsersResponse, success: true })
    } catch (error) {
        console.log('Find child error:', error)
        return NextResponse.json({ error, success: false })
    }
}
