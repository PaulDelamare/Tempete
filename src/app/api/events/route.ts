/**
 * @openapi
 * components:
 *   schemas:
 *     EventArtist:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         artistId:
 *           type: string
 *         name:
 *           type: string
 *     EventTag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tagId:
 *           type: string
 *         name:
 *           type: string
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         datestart:
 *           type: string
 *           format: date-time
 *         dateend:
 *           type: string
 *           format: date-time
 *         capacity:
 *           type: integer
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - draft
 *             - published
 *             - cancelled
 *             - soldout
 *             - hidden
 *         areaId:
 *           type: string
 *           nullable: true
 *         artists:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EventArtist'
 *         tagsJoin:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EventTag'
 *         created_at:
 *           type: string
 *           format: date-time
 *         modified_at:
 *           type: string
 *           format: date-time
 */
import { NextResponse } from "next/server";
import { validateBody } from "@/lib/validation";
import { handleApiError } from "@/lib/errors";
import { CreateEventApiSchema, MergedEventPutSchema } from "@/helpers/zod/event/create-event-schema";
import { createEvent, findAllEvent, updateEvent } from "@/services/event.service";

/**
 * @openapi
 * /api/event:
 *   get:
 *     summary: Récupère la liste des événements
 *     tags:
 *       - Event
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET() {
  try {
    const events = await findAllEvent();

    return NextResponse.json(events, { status: 200 });
  } catch (error) {

    return handleApiError(error);
  }
}

/**
 * @openapi
 * /api/event:
 *   post:
 *     summary: Crée un nouvel événement
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventApiSchema'
 *     responses:
 *       201:
 *         description: Événement créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = validateBody(CreateEventApiSchema, body);

    const event = await createEvent(validatedData);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {

    return handleApiError(error);
  }
}

/**
 * @openapi
 * /api/event:
 *   put:
 *     summary: Met à jour un événement existant
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MergedEventPutSchema'
 *     responses:
 *       200:
 *         description: Événement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Événement non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const validatedData = validateBody(MergedEventPutSchema, body);

    const event = await updateEvent(validatedData);

    return NextResponse.json(event, { status: 200 });
  } catch (error) {

    return handleApiError(error);
  }
}