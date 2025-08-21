import { NextResponse } from "next/server"
import { validateBody } from "@/lib/validation"
import { idSchema } from "@/helpers/zod/id-schema"
import { handleApiError } from "@/lib/errors"
import { deleteArea, findOneArea } from "@/services/area.service"

type Params = { params: { id: string } }

/**
 * @openapi
 * /api/areas/{id}:
 *   get:
 *     summary: Récupère une zone par ID
 *     tags:
 *       - Area
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la zone
 *     responses:
 *       200:
 *         description: Zone trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       404:
 *         description: Zone non trouvée
 */
export async function GET(_req: Request, { params }: Params) {
    try {

        const paramsData = await Promise.resolve(params);

        const validatedData = validateBody(idSchema, paramsData);

        const area = await findOneArea(validatedData.id);

        return NextResponse.json(area, { status: 200 })
    } catch (error) {

        return handleApiError(error);
    }
}

/**
 * @openapi
 * /api/areas/{id}:
 *   delete:
 *     summary: Supprime une zone par ID
 *     tags:
 *       - Area
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la zone à supprimer
 *     responses:
 *       200:
 *         description: Zone supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Area deleted successfully
 *       404:
 *         description: Zone non trouvée
 */
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const paramsData = await Promise.resolve(params);

        const validatedData = validateBody(idSchema, paramsData);

        await deleteArea(validatedData.id);

        return NextResponse.json({ message: 'Area deleted successfully' }, { status: 200 });
    } catch (error) {

        return handleApiError(error);
    }
}