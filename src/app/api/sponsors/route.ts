/**
 * @openapi
 * components:
 *   schemas:
 *     Sponsor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *         website:
 *           type: string
 *         description:
 *           type: string
 */
import { NextResponse } from "next/server"
import { createSponsor, findAllSponsors, updateSponsor } from "@/services/sponsor.service"
import { handleApiError } from "@/lib/errors";
import { validateBody } from "@/lib/validation";
import { MergedSponsorPutSchema, SponsorSchema } from "@/helpers/zod/sponsor/create-sponsor-schema";


/**
 * @openapi
 * /api/sponsor:
 *   get:
 *     summary: Récupère la liste des sponsors
 *     tags:
 *       - Sponsor
 *     responses:
 *       200:
 *         description: Liste des sponsors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sponsor'
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET() {
    try {
        const sponsors = await findAllSponsors();

        return NextResponse.json(sponsors, { status: 200 });
    } catch (error) {

        return handleApiError(error);
    }
}

/**
 * @openapi
 * /api/sponsor:
 *   post:
 *     summary: Crée un nouveau sponsor
 *     tags:
 *       - Sponsor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sponsor'
 *     responses:
 *       201:
 *         description: Sponsor créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sponsor'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validatedData = validateBody(SponsorSchema, body);

        const sponsor = await createSponsor(validatedData);

        return NextResponse.json(sponsor, { status: 201 })
    } catch (error) {

        return handleApiError(error);
    }
}

/**
 * @openapi
 * /api/sponsor:
 *   put:
 *     summary: Met à jour un sponsor existant
 *     tags:
 *       - Sponsor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sponsor'
 *     responses:
 *       200:
 *         description: Sponsor mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sponsor'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur interne du serveur
 */
export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const validatedData = validateBody(MergedSponsorPutSchema, body);

        const sponsor = await updateSponsor(validatedData);

        return NextResponse.json(sponsor, { status: 200 })
    } catch (error) {

        return handleApiError(error);
    }
}

