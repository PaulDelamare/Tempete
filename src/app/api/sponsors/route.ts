import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

export async function GET() {
    try {
        const sponsors = await prisma.sponsor.findMany({
            orderBy: { created_at: "desc" },
        })
        return NextResponse.json(sponsors)
    } catch (error) {
        return handleError(error, "GET /api/sponsors")
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const sponsor = await prisma.sponsor.create({
            data: {
                name: body.name,
                imgurl: body.imgurl ?? null,
                website_url: body.website_url ?? null,
            },
        })
        return NextResponse.json(sponsor)
    } catch (error) {
        return handleError(error, "POST /api/sponsors")
    }
}
