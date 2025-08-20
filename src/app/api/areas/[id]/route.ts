import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"
import { Prisma } from "@/generated/prisma"

type Params = { params: { id: string } }
const toDecimal = (v: unknown) =>
    v === null || v === undefined || v === "" ? undefined : new Prisma.Decimal(v as any)

export async function GET(_req: Request, { params }: Params) {
    try {
        const area = await prisma.area.findUnique({
            where: { id: params.id },
            include: { events: true, products: true },
        })
        if (!area) return NextResponse.json({ error: "Area not found" }, { status: 404 })
        return NextResponse.json(area)
    } catch (error) {
        return handleError(error, "GET /api/areas/[id]")
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const body = await req.json()
        const area = await prisma.area.update({
            where: { id: params.id },
            data: {
                name: body.name ?? undefined,
                imgurl: body.imgurl ?? undefined,
                description: body.description ?? undefined,
                type: body.type ?? undefined,
                latitude: toDecimal(body.latitude),
                longitude: toDecimal(body.longitude),
                capacity: body.capacity ?? undefined,
            },
        })
        return NextResponse.json(area)
    } catch (error) {
        return handleError(error, "PUT /api/areas/[id]")
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        await prisma.area.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return handleError(error, "DELETE /api/areas/[id]")
    }
}
