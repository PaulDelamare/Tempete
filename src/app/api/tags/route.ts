/**
 * @openapi
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         modified_at:
 *           type: string
 *           format: date-time
 *
 *     TagUpdate:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 */

import { NextResponse } from "next/server"
import { createTag, findAllTags, updateTag } from "@/services/tag.service"
import { handleApiError } from "@/lib/errors";
import { CreateTagSchema, MergeTagPutSchema } from "@/helpers/zod/tag/create-tag-schema";
import { validateBody } from "@/lib/validation";

/**
 * @openapi
 * /api/tags:
 *   get:
 *     summary: Récupère la liste des tags
 *     tags:
 *       - Tag
 *     description: Récupère tous les tags avec leurs événements et artistes associés, triés par date de création décroissante.
 *     responses:
 *       200:
 *         description: Liste des tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Identifiant unique du tag
 *                   name:
 *                     type: string
 *                     description: Nom du tag
 *                   description:
 *                     type: string
 *                     nullable: true
 *                     description: Description du tag
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Date de création
 *                   modified_at:
 *                     type: string
 *                     format: date-time
 *                     description: Date de dernière modification
 *                   events:
 *                     type: array
 *                     description: Liste des événements associés au tag
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         event_id:
 *                           type: string
 *                         tag_id:
 *                           type: string
 *                   artists:
 *                     type: array
 *                     description: Liste des artistes associés au tag
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         artist_id:
 *                           type: string
 *                         tag_id:
 *                           type: string
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET() {
    try {

        const tags = await findAllTags();

        return NextResponse.json(tags, { status: 200 });

    } catch (error) {

        return handleApiError(error);
    }
}

/**
 * @openapi
 * /api/tags:
 *   post:
 *     summary: Crée un nouveau tag
 *     tags:
 *       - Tag
 *     description: Crée un tag en validant le corps de la requête avec le schéma `CreateTagSchema`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom unique du tag
 *                 example: Rock
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: Description optionnelle du tag
 *                 example: Musique rock et dérivés
 *     responses:
 *       201:
 *         description: Tag créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Identifiant unique généré pour le tag
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                   nullable: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 modified_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erreur de validation des données fournies
 *       500:
 *         description: Erreur interne du serveur
 */
export async function POST(req: Request) {
    try {

        const body = await req.json();

        const validatedData = validateBody(CreateTagSchema, body);

        const tag = await createTag(validatedData);

        return NextResponse.json(tag, { status: 201 });

    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * @openapi
 * /api/tags:
 *   put:
 *     summary: Met à jour un tag existant
 *     tags:
 *       - Tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagUpdate'
 *     responses:
 *       200:
 *         description: Tag mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Requête invalide (erreur de validation)
 *       404:
 *         description: Tag non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const validatedData = validateBody(MergeTagPutSchema, body);

        const tag = await updateTag(validatedData.id, validatedData);

        return NextResponse.json(tag, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}