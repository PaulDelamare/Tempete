import { NextResponse } from "next/server"
import { deleteEvent, findOneEvent } from "@/services/event.service"
import { handleApiError } from "@/lib/errors"

type Params = { params: { id: string } }

/**
 * @openapi
 * /api/event/{id}:
 *   get:
 *     summary: Récupère un événement par son ID
 *     tags:
 *       - Event
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'événement
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Événement trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Événement non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(_req: Request, { params }: Params) {
    try {
        const paramsData = await Promise.resolve(params);
        const event = await findOneEvent(paramsData.id);
        return NextResponse.json(event);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * @openapi
 * /api/event/{id}:
 *   delete:
 *     summary: Supprime un événement par son ID
 *     tags:
 *       - Event
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'événement à supprimer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Événement supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Événement non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function DELETE(_req: Request, { params }: Params) {
    try {
        const paramsData = await Promise.resolve(params);
        await deleteEvent(paramsData.id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
