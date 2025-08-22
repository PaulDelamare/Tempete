import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/utils/api-error";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, eventId } = body;

    // Vérifier que l'événement existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    // Créer l'alerte mail
    const mailAlert = await prisma.mailAlert.create({
      data: {
        email,
        eventId,
      },
    });

    return NextResponse.json(mailAlert);
  } catch (error) {
    return handleError(error, "POST /api/mail-alerts");
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const email = searchParams.get("email");

    if (!eventId || !email) {
      return NextResponse.json(
        { error: "eventId et email sont requis" },
        { status: 400 }
      );
    }

    // Supprimer l'alerte mail
    const deletedAlert = await prisma.mailAlert.deleteMany({
      where: {
        eventId,
        email,
      },
    });

    return NextResponse.json({
      message: "Alerte supprimée avec succès",
      deletedCount: deletedAlert.count,
    });
  } catch (error) {
    return handleError(error, "DELETE /api/mail-alerts");
  }
}
