import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const areas = await prisma.area.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(areas);
  } catch (error) {
    console.error("Erreur lors de la récupération des areas:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des areas" },
      { status: 500 }
    );
  }
}
