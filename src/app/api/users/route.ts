import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"

// GET all users
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

// CREATE user
export async function POST(req: Request) {
    try {
        const body = await req.json()

        const user = await prisma.user.create({
            data: {
                email: body.email,
                name: body.name,
                firstname: body.firstname,
                roles: body.roles ?? [],
                emailVerified: body.emailVerified ?? false,
                image: body.image,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        return handleError(error, "POST /api/users")
    }
}
