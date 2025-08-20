import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils/api-error"
import { Prisma } from "@/generated/prisma"

type Params = { params: { id: string } }
const toDecimal = (v: unknown) =>
    v === null || v === undefined || v === "" ? undefined : new Prisma.Decimal(v as any)

export async function GET(_req: Request, { params }: Params) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: { area: true },
        })
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })
        return NextResponse.json(product)
    } catch (error) {
        return handleError(error, "GET /api/products/[id]")
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const body = await req.json()
        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                name: body.name ?? undefined,
                description: body.description ?? undefined,
                imgurl: body.imgurl ?? undefined,
                price: toDecimal(body.price),
                areaId: body.areaId ?? undefined,
            },
        })
        return NextResponse.json(product)
    } catch (error) {
        return handleError(error, "PUT /api/products/[id]")
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        await prisma.product.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return handleError(error, "DELETE /api/products/[id]")
    }
}
