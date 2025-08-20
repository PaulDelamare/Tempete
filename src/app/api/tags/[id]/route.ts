import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
    try {
        const tag = await prisma.tag.findUnique({
            where: { id: params.id },
            include: { events: true, artists: true },
        })
        if (!tag) return NextResponse.json({ error: "Tag not found" }, { status: 404 })
        return NextResponse.json(tag)
    } catch (error) {
        return handleError(error, "GET /api/tags/[id]")
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const body = await req.json()
        const tag = await prisma.tag.update({
            where: { id: params.id },
            data: {
                name: body.name ?? undefined,
                description: body.description ?? undefined,
            },
        })
        return NextResponse.json(tag)
    } catch (error) {
        return handleError(error, "PUT /api/tags/[id]")
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        await prisma.tag.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return handleError(error, "DELETE /api/tags/[id]")
    }
}
