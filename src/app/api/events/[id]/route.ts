import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: params.id },
            include: { area: true, artists: true, tagsJoin: true },
        })
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 })
        return NextResponse.json(event)
    } catch (error) {
        return handleError(error, "GET /api/events/[id]")
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const body = await req.json()
        const event = await prisma.event.update({
            where: { id: params.id },
            data: {
                name: body.name,
                imgurl: body.imgurl,
                description: body.description,
                datestart: new Date(body.datestart),
                dateend: new Date(body.dateend),
                capacity: body.capacity,
                status: body.status,
                areaId: body.areaId,
            },
        })
        return NextResponse.json(event)
    } catch (error) {
        return handleError(error, "PUT /api/events/[id]")
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        await prisma.event.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return handleError(error, "DELETE /api/events/[id]")
    }
}
