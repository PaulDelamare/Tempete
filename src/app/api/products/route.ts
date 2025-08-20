import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"
import { Prisma } from "@/generated/prisma"

const toDecimal = (v: unknown) =>
    v === null || v === undefined || v === "" ? null : new Prisma.Decimal(v as any)

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: { area: true },
            orderBy: { created_at: "desc" },
        })
        return NextResponse.json(products)
    } catch (error) {
        return handleError(error, "GET /api/products")
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description ?? null,
                imgurl: body.imgurl ?? null,
                price: toDecimal(body.price)!,     // required
                areaId: body.areaId,              // required FK
            },
        })
        return NextResponse.json(product)
    } catch (error) {
        return handleError(error, "POST /api/products")
    }
}
