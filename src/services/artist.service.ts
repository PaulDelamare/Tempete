import { prisma } from "@/lib/prisma";
import { attachTagsToArtist } from "./tag.service";
import { CreateArtistApiSchemaType } from "@/helpers/zod/artist/create-artist-schema";

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
