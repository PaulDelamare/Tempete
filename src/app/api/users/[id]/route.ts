import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

// GET user by ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                sessions: true,
                accounts: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        return handleError(error, "GET /api/users/[id]")
    }
}

// UPDATE user
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json()

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: {
                email: body.email,
                name: body.name,
                firstname: body.firstname,
                roles: body.roles,
                emailVerified: body.emailVerified,
                image: body.image,
                updatedAt: new Date(),
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        return handleError(error, "PUT /api/users/[id]")
    }
}

// DELETE user
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.user.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: "User deleted successfully" })
    } catch (error) {
        return handleError(error, "DELETE /api/users/[id]")
    }
}
