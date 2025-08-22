
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   firstname:
 *                     type: string
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                   emailVerified:
 *                     type: boolean
 *                   image:
 *                     type: string
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erreur serveur
 */
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { created_at: "desc" },
            include: {
                sessions: true,
                accounts: true,
            },
        })
        return NextResponse.json(users)
    } catch (error) {
        return handleError(error, "GET /api/users")
    }
}
