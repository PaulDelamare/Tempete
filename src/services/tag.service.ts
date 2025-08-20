import { prisma } from "@/lib/prisma";

export async function attachTagsToArtist(artistId: string, tagIds: string[]) {

     if (!tagIds.length) return;

     await prisma.artistTag.createMany({
          data: tagIds.map((tagId) => ({ artistId, tagId })),
          skipDuplicates: true,
     });
}


export async function removeAllTagsFromArtist(artistId: string) {
     await prisma.artistTag.deleteMany({
          where: { artistId }
     });
}

export async function updateTagsForArtist(artistId: string, tagIds: string[]) {
     await removeAllTagsFromArtist(artistId);

     if (tagIds.length) {
          await attachTagsToArtist(artistId, tagIds);
     }
}