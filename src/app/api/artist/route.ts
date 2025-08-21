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
import { ArtistSchema, MergedArtistPutSchema } from "@/helpers/zod/artist/create-artist-schema";
import { createArtist, findAllArtists, updateArtist } from "@/services/artist.service";
import { validateBody } from "@/lib/validation";
import { handleApiError } from "@/lib/errors";


/**
 * @openapi
 * /api/artist:
 *   get:
 *     summary: Récupère la liste des artistes
 *     tags:
 *       - Artist
 *     responses:
 *       200:
 *         description: Liste des artistes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artist'
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET() {
    try {
        const artists = await findAllArtists();

        return NextResponse.json(artists, { status: 200 });

    } catch (error) {

        return handleApiError(error);
    }
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

        console.log(body)
        const validatedData = validateBody(ArtistSchema, body);

        const artist = await createArtist(validatedData);

        return NextResponse.json(artist, { status: 201 });
    } catch (error) {

        return handleApiError(error);
    }
}

/**
 * @openapi
 * /api/artist:
 *   put:
 *     summary: Met à jour un artiste existant
 *     tags:
 *       - Artist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: "ID de l'artiste à mettre à jour"
 *                 example: "cmekc9882000j4xlwl8vugy5v"
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
 *       200:
 *         description: Artiste mis à jour avec succès
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
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const validatedData = validateBody(MergedArtistPutSchema, body);

        const artist = await updateArtist(validatedData);

        return NextResponse.json(artist);
    } catch (error) {
        return handleApiError(error);
    }
}
