import { prisma } from "@/lib/prisma";

export async function attachTagsToArtist(artistId: string, tagIds: string[]) {

     if (!tagIds.length) return;

     await prisma.artistTag.createMany({
          data: tagIds.map((tagId) => ({ artistId, tagId })),
          skipDuplicates: true,
     });
}
