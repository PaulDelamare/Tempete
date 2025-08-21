import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            include: { events: true, artists: true },
            orderBy: { created_at: "desc" },
        })
        return NextResponse.json(tags)
    } catch (error) {
        return handleError(error, "GET /api/tags")
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const tag = await prisma.tag.create({
            data: {
                name: body.name,
                description: body.description ?? null,
            },
        })
        return NextResponse.json(tag)
    } catch (error) {
        return handleError(error, "POST /api/tags")
    }
}
