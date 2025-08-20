import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"
import { Area, Prisma } from "@/generated/prisma"

function toDecimal(v: unknown) {
    if (v === null || v === undefined || v === "") return null
    return new Prisma.Decimal(v as any)
}

export async function GET() {
    try {
        const areas = await prisma.area.findMany({
            include: { events: { include: { artists: { include: { artist: { include: { tagsJoin: { include: { tag: true } } } } } } } }, products: true },
            orderBy: { created_at: "desc" },
        })
        return NextResponse.json(areas)
    } catch (error) {
        return handleError(error, "GET /api/areas")
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const area = await prisma.area.create({
            data: {
                name: body.name,
                imgurl: body.imgurl ?? null,
                description: body.description ?? null,
                type: body.type, // AreaType
                latitude: toDecimal(body.latitude),
                longitude: toDecimal(body.longitude),
                capacity: body.capacity ?? null,
            },
        })
        return NextResponse.json(area)
    } catch (error) {
        return handleError(error, "POST /api/areas")
    }
}
