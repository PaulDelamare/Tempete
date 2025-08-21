import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/errors';
import { validateBody } from '@/lib/validation';
import { deleteArtist } from '@/services/artist.service';
import { idSchema } from '@/helpers/zod/id-schema';

/**
 * @openapi
 * /api/artist/{idArtist}:
 *   delete:
 *     summary: Supprime un artiste existant
 *     tags:
 *       - Artist
 *     parameters:
 *       - in: path
 *         name: idArtist
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de l'artiste à supprimer"
 *         example: "cmekc9882000j4xlwl8vugy5v"
 *     responses:
 *       200:
 *         description: Artiste supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Artist deleted successfully"
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
 *       404:
 *         description: Artiste non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Artist not found"
 */
export async function DELETE(
     request: Request,
     { params }: { params: { id: string } }
) {
     try {
          const paramsData = await Promise.resolve(params);

          const validatedData = validateBody(idSchema, paramsData);

          await deleteArtist(validatedData.id);

          return NextResponse.json({ message: 'Artist deleted successfully' }, { status: 200 });
     } catch (error) {

          return handleApiError(error);
     }
}