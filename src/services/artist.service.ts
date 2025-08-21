import { prisma } from "@/lib/prisma";
import { attachTagsToArtist, removeAllTagsFromArtist, updateTagsForArtist } from "./tag.service";
import { CreateArtistApiSchemaType, MergedArtistPutSchemaType } from "@/helpers/zod/artist/create-artist-schema";


/**
 * Retrieves all artists from the database.
 *
 * @returns A promise that resolves to an array of artist objects.
 */
export async function findAllArtists() {
     return prisma.artist.findMany();
}

/**
 * Creates a new artist in the database and optionally attaches tags to the artist.
 *
 * This function performs the creation within a database transaction to ensure atomicity.
 * If `tagIds` are provided, the corresponding tags are attached to the newly created artist.
 *
 * @param data - The artist data, including optional tag IDs, conforming to `CreateArtistApiSchemaType`.
 * @returns The newly created artist object.
 */
export async function createArtist(data: CreateArtistApiSchemaType) {

     return prisma.$transaction(async (tx) => {
          const { tagIds, ...artistData } = data;

          const createdArtist = await tx.artist.create({ data: artistData });

          if (tagIds?.length) {

               await attachTagsToArtist(createdArtist.id, tagIds);
          }

          return createdArtist;
     });
}

/**
 * Updates an artist record in the database with the provided data.
 * Performs the update operation within a transaction to ensure atomicity.
 * If tag IDs are provided, updates the tags associated with the artist.
 *
 * @param data - The data used to update the artist, including optional tag IDs.
 * @returns The updated artist object.
 *
 * @throws Will throw an error if the update operation fails.
 */
export async function updateArtist(data: MergedArtistPutSchemaType) {

     return prisma.$transaction(async (tx) => {
          const { tagIds, ...artistData } = data;

          const updatedArtist = await tx.artist.update({
               where: { id: data.id },
               data: artistData,
          });

          if (tagIds) {
               await updateTagsForArtist(updatedArtist.id, tagIds);
          }

          return updatedArtist;
     });
}

/**
 * Deletes an artist by their unique identifier.
 *
 * This function first removes all tags associated with the artist,
 * then deletes the artist record from the database.
 *
 * @param id - The unique identifier of the artist to delete.
 * @returns A promise that resolves to the deleted artist record.
 */
export async function deleteArtist(id: string) {

     await removeAllTagsFromArtist(id);

     return prisma.artist.delete({ where: { id } });
}
