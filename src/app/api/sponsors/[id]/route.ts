import { NextResponse } from "next/server"
import { deleteSponsor, findSponsorOrThrow } from "@/services/sponsor.service"
import { handleApiError } from "@/lib/errors"

type Params = { params: { id: string } }

/**
 * @openapi
 * /api/sponsor/{id}:
 *   get:
 *     summary: Récupère un sponsor par son ID
 *     tags:
 *       - Sponsor
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sponsor trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sponsor'
 *       404:
 *         description: Sponsor non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function GET(_req: Request, { params }: Params) {
    try {
        const paramsData = await Promise.resolve(params);

        const sponsor = await findSponsorOrThrow(paramsData.id);

        return NextResponse.json(sponsor, { status: 200 })
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * @openapi
 * /api/sponsor/{id}:
 *   delete:
 *     summary: Supprime un sponsor par son ID
 *     tags:
 *       - Sponsor
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sponsor supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Sponsor non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
export async function DELETE(_req: Request, { params }: Params) {
    try {
        const paramsData = await Promise.resolve(params);

        await deleteSponsor(paramsData.id);
        return NextResponse.json({ success: true })
    } catch (error) {
        return handleApiError(error);
    }
}
