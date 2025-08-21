import { NextResponse } from "next/server"
import { validateBody } from "@/lib/validation";
import { idSchema } from "@/helpers/zod/id-schema";
import { deleteTag } from "@/services/tag.service";
import { handleApiError } from "@/lib/errors";

type Params = { params: { id: string } }

/**
 * @openapi
 * /api/tags/{id}:
 *   delete:
 *     summary: Supprime un tag par son ID
 *     tags:
 *       - Tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag à supprimer
 *     responses:
 *       200:
 *         description: Tag supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tag deleted successfully
 *       400:
 *         description: Erreur de validation (ID invalide)
 *       404:
 *         description: Tag introuvable
 *       500:
 *         description: Erreur interne du serveur
 */

export async function DELETE(_req: Request, { params }: Params) {
    try {
        const paramsData = await Promise.resolve(params);

        const validatedData = validateBody(idSchema, paramsData);

        await deleteTag(validatedData.id);

        return NextResponse.json({ message: 'Tag deleted successfully' }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}
