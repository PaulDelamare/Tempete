import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArtistSchema } from "./schema/artist-schema";

export async function GET() {
  const artists = await prisma.artist.findMany();
  return NextResponse.json(artists);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parse = ArtistSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error }, { status: 400 });
  }
  const artist = await prisma.artist.create({ data: parse.data });
  return NextResponse.json(artist);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;
  const parse = ArtistSchema.safeParse(data);
  if (!parse.success || !id) {
    return NextResponse.json({ error: parse.error || "ID manquant" }, { status: 400 });
  }
  const artist = await prisma.artist.update({ where: { id }, data: parse.data });
  return NextResponse.json(artist);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }
  await prisma.artist.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
