import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
    try {
        const artist = await prisma.artist.findUnique({
            where: { id: params.id },
            include: { tagsJoin: { include: { tag: true } }, events: true },
        })
        if (!artist) return NextResponse.json({ error: "Artist not found" }, { status: 404 })
        return NextResponse.json(artist)
    } catch (error) {
        return handleError(error, "GET /api/artists/[id]")
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const body = await req.json()
        const artist = await prisma.artist.update({
            where: { id: params.id },
            data: {
                name: body.name,
                nickname: body.nickname,
                links: body.links,
                bio: body.bio,
                imgurl: body.imgurl,
            },
        })
        return NextResponse.json(artist)
    } catch (error) {
        return handleError(error, "PUT /api/artists/[id]")
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        await prisma.artist.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return handleError(error, "DELETE /api/artists/[id]")
    }
}
