import { prisma } from "@/lib/prisma";

/**
 * Retrieves all tags from the database, including their associated events and artists.
 *
 * @returns A promise that resolves to an array of tag objects, each with related events and artists,
 *          ordered by creation date in descending order.
 */
export async function findAllTags() {
     return await prisma.tag.findMany({
          include: { events: true, artists: true },
          orderBy: { created_at: "desc" },
     });
}

/**
 * Creates a new tag in the database.
 *
 * @param name - The name of the tag to create.
 * @returns A promise that resolves to the created tag object.
 */
export async function createTag(data: { name: string, description: string | null }) {
     return await prisma.tag.create({
          data: { name: data.name, description: data.description ?? null },
     });
}

/**
 * Updates an existing tag in the database.
 *
 * @param id - The unique identifier of the tag to update.
 * @param data - An object containing the fields to update (name and/or description).
 * @returns A promise that resolves to the updated tag object.
 */
export async function updateTag(id: string, data: { name?: string; description?: string | null }) {
     return await prisma.tag.update({
          where: { id },
          data: {
               ...(data.name !== undefined && { name: data.name }),
               ...(data.description !== undefined && { description: data.description }),
          },
     });
}

/**
 * Attaches multiple tags to a specified artist by creating entries in the artistTag table.
 *
 * @param artistId - The unique identifier of the artist to which tags will be attached.
 * @param tagIds - An array of tag identifiers to associate with the artist.
 * @returns A promise that resolves when the tags have been attached. If no tags are provided, the function returns early.
 *
 * @remarks
 * - Uses `prisma.artistTag.createMany` to efficiently create multiple associations.
 * - The `skipDuplicates` option ensures that duplicate associations are not created.
 */
export async function attachTagsToArtist(artistId: string, tagIds: string[]) {

     if (!tagIds.length) return;

     await prisma.artistTag.createMany({
          data: tagIds.map((tagId) => ({ artistId, tagId })),
          skipDuplicates: true,
     });
}


/**
 * Removes all tags associated with a given artist.
 *
 * @param artistId - The unique identifier of the artist whose tags should be removed.
 * @returns A promise that resolves when all tags have been deleted from the artist.
 */
export async function removeAllTagsFromArtist(artistId: string) {
     await prisma.artistTag.deleteMany({
          where: { artistId }
     });
}

/**
 * Updates the tags associated with a specific artist.
 *
 * This function first removes all existing tags from the artist,
 * then attaches the provided list of tag IDs to the artist if any are specified.
 *
 * @param artistId - The unique identifier of the artist whose tags are to be updated.
 * @param tagIds - An array of tag IDs to associate with the artist.
 * @returns A promise that resolves when the update operation is complete.
 */
export async function updateTagsForArtist(artistId: string, tagIds: string[]) {
     await removeAllTagsFromArtist(artistId);

     if (tagIds.length) {
          await attachTagsToArtist(artistId, tagIds);
     }
}

/**
 * Deletes a tag from the database by its unique identifier.
 *
 * @param id - The unique identifier of the tag to delete.
 * @returns A promise that resolves to the deleted tag object.
 */
export async function deleteTag(id: string) {
     return await prisma.tag.delete({
          where: { id },
     });
}

/**
 * Attaches multiple tags to a specified event by creating entries in the eventTag table.
 *
 * @param eventId - The unique identifier of the event to which tags will be attached.
 * @param tags - An array of tag IDs to associate with the event.
 * @returns A promise that resolves when the tags have been attached.
 */
export async function attachTagsToEvent(eventId: string, tags: string[]) {
     if (tags.length === 0) return;

     await prisma.eventTag.createMany({
          data: tags.map((tagId) => ({
               eventId,
               tagId,
          })),
     });
}

/**
 * Replaces all tags associated with a specific event.
 *
 * This function first removes all existing tag associations for the given event,
 * then adds new associations for the provided list of tag IDs.
 *
 * @param eventId - The unique identifier of the event whose tags are to be replaced.
 * @param tags - An array of tag IDs to associate with the event. If empty, all tags are removed.
 * @returns A promise that resolves when the operation is complete.
 */
export async function replaceTagsForEvent(eventId: string, tags: string[]) {
     await prisma.eventTag.deleteMany({ where: { eventId } });

     if (tags.length === 0) return;

     await prisma.eventTag.createMany({
          data: tags.map((tagId) => ({
               eventId,
               tagId,
          })),
     });
}
