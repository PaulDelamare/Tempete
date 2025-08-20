import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
    try {
        const sponsor = await prisma.sponsor.findUnique({ where: { id: params.id } })
        if (!sponsor) return NextResponse.json({ error: "Sponsor not found" }, { status: 404 })
        return NextResponse.json(sponsor)
    } catch (error) {
        return handleError(error, "GET /api/sponsors/[id]")
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const body = await req.json()
        const sponsor = await prisma.sponsor.update({
            where: { id: params.id },
            data: {
                name: body.name ?? undefined,
                imgurl: body.imgurl ?? undefined,
                website_url: body.website_url ?? undefined,
            },
        })
        return NextResponse.json(sponsor)
    } catch (error) {
        return handleError(error, "PUT /api/sponsors/[id]")
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        await prisma.sponsor.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return handleError(error, "DELETE /api/sponsors/[id]")
    }
}
