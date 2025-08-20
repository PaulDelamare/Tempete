import { Prisma } from "@/generated/prisma"
import { NextResponse } from "next/server"

export function handleError(error: unknown, context: string) {
    console.error(`[${context}]`, error)

    // Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json(
            {
                error: {
                    type: "PrismaClientKnownRequestError",
                    code: error.code,
                    message: error.message,
                    meta: error.meta,
                    context,
                },
            },
            { status: 400 }
        )
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return NextResponse.json(
            {
                error: {
                    type: "PrismaClientValidationError",
                    message: error.message,
                    context,
                },
            },
            { status: 422 }
        )
    }

    // Generic error
    return NextResponse.json(
        {
            error: {
                type: "UnknownError",
                message: error instanceof Error ? error.message : "Unexpected error",
                context,
            },
        },
        { status: 500 }
    )
}
