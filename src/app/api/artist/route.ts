/**
 * @openapi
 * components:
 *   schemas:
 *     Artist:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         nickname:
 *           type: string
 *         bio:
 *           type: string
 *         imgurl:
 *           type: string
 *         links:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *         tagIds:
 *           type: array
 *           items:
 *             type: string
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArtistSchema } from "@/helpers/zod/artist/create-artist-schema";
import { createArtist } from "@/services/artist.service";
import { validateBody } from "@/lib/validation";
import { handleApiError } from "@/lib/errors";


export async function GET() {
    const artists = await prisma.artist.findMany();
    return NextResponse.json(artists);
}

/**
 * @openapi
 * /api/artist:
 *   post:
 *     summary: Crée un nouvel artiste
 *     tags:
 *       - Artist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de l'artiste
 *                 example: "Metallica"
 *               nickname:
 *                 type: string
 *                 description: Surnom de l'artiste
 *                 example: "Hetfield"
 *               bio:
 *                 type: string
 *                 description: Biographie
 *                 example: "Groupe de heavy metal américain"
 *               links:
 *                 type: array
 *                 description: Liste de liens de l'artiste
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: "Nom du lien (ex: Instagram)"
 *                       example: "instagram"
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: "URL du lien"
 *                       example: "https://instagram.com/metallica"
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Liste des IDs de tags associés"
 *                 example: ["cld9xyzabc123", "cld9xyzabc456"]
 *               imgurl:
 *                 type: string
 *                 description: "Image en Base64 (PNG/JPG/WEBP)"
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANS..."
 *     responses:
 *       201:
 *         description: Artiste créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation failed"
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const data = validateBody(ArtistSchema, body);

        const artist = await createArtist(data);

        return NextResponse.json(artist, { status: 201 });
    } catch (error) {

        return handleApiError(error);
    }
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
