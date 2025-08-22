/**
 * @swagger
 * tags:
 *   name: MailAlerts
 *   description: Gestion des alertes email liées à un événement
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/utils/api-error";


/**
 * @swagger
 * /api/mail-alerts:
 *   post:
 *     summary: Créer une alerte email pour un événement
 *     tags: [MailAlerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - eventId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               eventId:
 *                 type: string
 *                 example: "evt_12345"
 *     responses:
 *       200:
 *         description: Alerte créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 eventId:
 *                   type: string
 *       404:
 *         description: Événement non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, eventId } = body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

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


/**
 * @swagger
 * /api/mail-alerts:
 *   delete:
 *     summary: Supprimer une alerte email liée à un événement
 *     tags: [MailAlerts]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’événement
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email associé à l’alerte
 *     responses:
 *       200:
 *         description: Alerte supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Paramètres manquants
 *       500:
 *         description: Erreur serveur
 */
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
