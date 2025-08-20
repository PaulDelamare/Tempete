import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

// GET all events
export async function GET() {
    try {
        const events = await prisma.event.findMany({
            include: { area: true, artists: true, tagsJoin: true },
            orderBy: { datestart: "asc" },
        })
        return NextResponse.json(events)
    } catch (error) {
        return handleError(error, "GET /api/events")
    }
}

// POST create event
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const event = await prisma.event.create({
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
        return handleError(error, "POST /api/events")
    }
}
