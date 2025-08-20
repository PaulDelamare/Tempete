import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

export async function GET() {
    try {
        const artists = await prisma.artist.findMany({
            include: { tagsJoin: true, events: true },
        })
        return NextResponse.json(artists)
    } catch (error) {
        return handleError(error, "GET /api/artists")
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const artist = await prisma.artist.create({
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
        return handleError(error, "POST /api/artists")
    }
}
