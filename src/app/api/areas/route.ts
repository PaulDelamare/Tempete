/**
 * @openapi
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *           description: Nom de la zone
 *           example: "Grande Scène"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Description optionnelle
 *           example: "Zone principale des concerts"
 *         latitude:
 *           type: string
 *           description: Coordonnée latitude
 *           example: "49.4431"
 *         longitude:
 *           type: string
 *           description: Coordonnée longitude
 *           example: "1.0993"
 *         capacity:
 *           type: string
 *           description: Capacité max
 *           example: "5000"
 *         type:
 *           type: string
 *           enum: [stage, food, merch, chill, service, info, medical]
 *           description: Type de la zone
 *           example: "stage"
 *         imgurl:
 *           type: string
 *           nullable: true
 *           description: URL de l’image (base64 ou lien direct)
 *           example: "https://example.com/zone.jpg"
 */

import { NextResponse } from "next/server";
import { validateBody } from "@/lib/validation";
import { AreaSchema, MergedAreaPutSchema } from "@/helpers/zod/area/create-area-schema";
import { handleApiError } from "@/lib/errors";
import { createArea, findAllArea, updateArea } from "@/services/area.service";

/**
 * @openapi
 * /api/area:
 *   get:
 *     summary: Récupère la liste des zones
 *     tags:
 *       - Area
 *     responses:
 *       200:
 *         description: Liste des zones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 */
export async function GET() {

  try {
    const areas = await findAllArea()

    return NextResponse.json(areas, { status: 200 });

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * @openapi
 * /api/area:
 *   post:
 *     summary: Crée une nouvelle zone
 *     tags:
 *       - Area
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Area'
 *     responses:
 *       201:
 *         description: Zone créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = validateBody(AreaSchema, body);

    const area = await createArea(validatedData);

    return NextResponse.json(area, { status: 201 });

  } catch (error) {

    return handleApiError(error);
  }
}

/**
 * @openapi
 * /api/area:
 *   put:
 *     summary: Met à jour une zone
 *     tags:
 *       - Area
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Area'
 *     responses:
 *       200:
 *         description: Zone mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const validatedData = validateBody(MergedAreaPutSchema, body);

    const area = await updateArea(validatedData);

    return NextResponse.json(area, { status: 200 });

  } catch (error) {

    return handleApiError(error);
  }
}
