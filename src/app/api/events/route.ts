import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/utils/api-error";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        artists: {
          include: {
            artist: true,
          },
        },
        area: true,
      },
      orderBy: { datestart: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    return handleError(error, "GET /api/events");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = await prisma.event.create({
      data: {
        name: body.name,
        imgurl: body.imgurl ?? null,
        description: body.description ?? null,
        datestart: new Date(body.datestart),
        dateend: new Date(body.dateend),
        capacity: body.capacity ?? null,
        status: body.status ?? "draft",
        areaId: body.areaId ?? null,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    return handleError(error, "POST /api/events");
  }
}
