import { prisma } from "@/lib/prisma";
import { attachTagsToArtist, removeAllTagsFromArtist, updateTagsForArtist } from "./tag.service";
import { CreateArtistApiSchemaType, MergedArtistPutSchemaType } from "@/helpers/zod/artist/create-artist-schema";


/**
 * Retrieves all artists from the database.
 *
 * @returns A promise that resolves to an array of artist objects.
 */
export async function findAllArtists() {
     return prisma.artist.findMany({
          include: {
               tagsJoin: {
                    include: {
                         tag: true
                    }
               },
               events: true
          },

          orderBy: {
               name: "asc",
          },
     });
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
     const { tagIds, ...artistData } = data;

     const createdArtist = await prisma.artist.create({ data: artistData });

     if (tagIds?.length) {
          await attachTagsToArtist(createdArtist.id, tagIds);
     }

     return createdArtist;
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


/**
 * Attaches multiple artists to a specified event by creating entries in the eventArtist table.
 *
 * @param eventId - The unique identifier of the event to which artists will be attached.
 * @param artists - An array of artist IDs to associate with the event.
 * @returns A promise that resolves when the artists have been attached to the event.
 */
export async function attachArtistsToEvent(eventId: string, artists: string[]) {
     if (artists.length === 0) return;

     await prisma.eventArtist.createMany({
          data: artists.map((artistId) => ({
               eventId,
               artistId,
          })),
     });
}

/**
 * Replaces the list of artists associated with a specific event.
 *
 * This function first removes all existing artist associations for the given event,
 * then adds new associations for the provided list of artist IDs.
 * If the list of artists is empty, all associations are simply removed.
 *
 * @param eventId - The unique identifier of the event.
 * @param artists - An array of artist IDs to associate with the event.
 * @returns A promise that resolves when the operation is complete.
 */
export async function replaceArtistsForEvent(eventId: string, artists: string[]) {
     await prisma.eventArtist.deleteMany({ where: { eventId } });

     if (artists.length === 0) return;

     await prisma.eventArtist.createMany({
          data: artists.map((artistId) => ({
               eventId,
               artistId,
          })),
     });
}
