import { z } from "zod";

export const ArtistSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  nickname: z.string().optional(),
  bio: z.string().optional(),
  imgurl: z.string().url().optional(),
  links: z.record(z.string(), z.string()).optional(),
});

export type ArtistInput = z.infer<typeof ArtistSchema>;
