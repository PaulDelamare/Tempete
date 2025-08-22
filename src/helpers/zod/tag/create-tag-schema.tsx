import z from "zod";
import { idSchema } from "../id-schema";

export const CreateTagSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().nullable(),
});

export const MergeTagPutSchema = idSchema.extend(CreateTagSchema.shape);

export type CreateArtistApiSchemaType = z.infer<typeof CreateTagSchema>;

export type MergeTagPutSchemaType = z.infer<typeof MergeTagPutSchema>;
