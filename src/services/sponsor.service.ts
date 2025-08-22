import { CreateSponsorApiSchemaType, MergedSponsorPutSchemaType } from "@/helpers/zod/sponsor/create-sponsor-schema";
import { prisma } from "@/lib/prisma";

/**
 * Retrieves all sponsors from the database, ordered by their creation date in descending order.
 *
 * @returns A promise that resolves to an array of sponsor records.
 */
export function findAllSponsors() {
    return prisma.sponsor.findMany({
        orderBy: { created_at: "desc" },
    })
}

/**
 * Retrieves a single sponsor by its unique identifier.
 * Throws an error if no sponsor is found.
 *
 * @param id - The unique identifier of the sponsor.
 * @returns A promise that resolves to the sponsor record.
 * @throws Error if sponsor is not found.
 */
export async function findSponsorOrThrow(id: string) {
    const sponsor = await prisma.sponsor.findUnique({
        where: { id },
    });
    if (!sponsor) {
        throw new Error(`Sponsor with id ${id} not found`);
    }
    return sponsor;
}

/**
 * Creates a new sponsor record in the database.
 *
 * @param data - The sponsor data conforming to `CreateSponsorApiSchemaType`.
 *   - `name`: The name of the sponsor.
 *   - `imgurl`: (Optional) The image URL of the sponsor.
 *   - `website_url`: (Optional) The website URL of the sponsor.
 * @returns A promise that resolves to the created sponsor object.
 */
export function createSponsor(data: CreateSponsorApiSchemaType) {
    return prisma.sponsor.create({
        data: {
            name: data.name,
            imgurl: data.imgurl ?? null,
            website_url: data.website_url ?? null,
        },
    })
}

/**
 * Updates an existing sponsor in the database with the provided data.
 *
 * @param data - An object containing the sponsor's updated information, including `id`, `name`, `imgurl`, and `website_url`.
 * @returns A promise that resolves to the updated sponsor record.
 */
export function updateSponsor(data: MergedSponsorPutSchemaType) {
    return prisma.sponsor.update({
        where: { id: data.id },
        data: {
            name: data.name,
            imgurl: data.imgurl ?? null,
            website_url: data.website_url ?? null,
        },
    })
}

/**
 * Deletes a sponsor from the database by its unique identifier.
 *
 * @param id - The unique identifier of the sponsor to delete.
 * @returns A promise that resolves to the deleted sponsor record.
 */
export function deleteSponsor(id: string) {
    return prisma.sponsor.delete({
        where: { id },
    });
}