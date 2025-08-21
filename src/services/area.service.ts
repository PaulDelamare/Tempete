import { prisma } from "@/lib/prisma";
import { CreateAreaApiSchemaType, MergedAreaPutSchemaType } from "@/helpers/zod/area/create-area-schema";
import { throwError } from "@/lib/errors";


/**
 * Retrieves all artists from the database.
 *
 * @returns A promise that resolves to an array of area objects.
 */
export async function findAllArea() {
     return prisma.area.findMany({
          include: {
               events: {
                    include: {
                         artists: {
                              include: {
                                   artist: { include: { tagsJoin: { include: { tag: true } } } },
                              },
                         },
                    },
               },
               products: true,
          },
          orderBy: { created_at: "desc" },
     });
}

/**
 * Retrieves a single area by its ID from the database.
 *
 * @param id - The ID of the area to retrieve.
 * @returns A promise that resolves to the area object, or null if not found.
 */
export async function findOneArea(id: string) {
     const area = await prisma.area.findUnique({
          where: { id },
          include: {
               events: {
                    include: {
                         artists: {
                              include: {
                                   artist: { include: { tagsJoin: { include: { tag: true } } } },
                              },
                         },
                    },
               },
               products: true,
          },
     });

     if (!area) {
          throw throwError(404, "Area not found");
     }

     return area;
}

/**
 * Creates a new area in the database.
 *
 * @param data - The validated area data.
 * @returns A promise that resolves to the created area object.
 */
export async function createArea(data: CreateAreaApiSchemaType) {
     return prisma.area.create({
          data: {
               name: data.name,
               description: data.description,
               type: data.type,
               latitude: data.latitude,
               longitude: data.longitude,
               capacity: parseInt(data.capacity, 10),
               imgurl: data.imgurl,
          },
     });
}

/**
 * Updates an existing area in the database.
 *
 * @param id - The ID of the area to update.
 * @param data - The validated area data to update.
 * @returns A promise that resolves to the updated area object.
 */
export async function updateArea(data: MergedAreaPutSchemaType) {
     return prisma.area.update({
          where: { id: data.id },
          data: {
               name: data.name,
               description: data.description,
               type: data.type,
               latitude: data.latitude,
               longitude: data.longitude,
               capacity: data.capacity ? parseInt(data.capacity as string, 10) : undefined,
               imgurl: data.imgurl,
          },
     });
}

/**
 * Deletes an area from the database.
 *
 * @param id - The ID of the area to delete.
 * @returns A promise that resolves to the deleted area object.
 */
export async function deleteArea(id: string) {
     return prisma.area.delete({
          where: { id },
     });
}