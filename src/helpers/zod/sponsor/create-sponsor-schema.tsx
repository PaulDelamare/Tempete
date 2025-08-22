import { z } from "zod";
import { idSchema } from "../id-schema";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const WebUrlSchema = z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
    normalize: true,
});

export const CreateSponsorSchema = z.object({
    name: z.string().min(2).max(100),
    website_url: WebUrlSchema.nullable().optional(),
    image: z
        .any()
        .optional()
        .nullable()
        .refine((v) => !v || v instanceof File, "Fichier invalide")
        .refine(
            (v) => !v || v.size <= MAX_FILE_SIZE,
            `Taille max ${MAX_FILE_SIZE / 1024 / 1024}MB`
        )
        .refine(
            (v) => !v || ACCEPTED_IMAGE_TYPES.includes(v.type),
            "Formats autorisés : jpg, png, webp"
        ),
});

export const SponsorSchema = z.object({
    name: z.string().min(2).max(100),
    imgurl: z
        .string()
        .regex(/^data:image\/(png|jpg|jpeg|webp);base64,.+/, {
            message: "L’image doit être un base64 PNG/JPG/WEBP",
        })
        .nullable(),
    website_url: WebUrlSchema.nullable(),
});

export const MergedSponsorPutSchema = idSchema.extend(SponsorSchema.shape);

export type CreateSponsorApiSchemaType = z.infer<typeof SponsorSchema>;

export type MergedSponsorPutSchemaType = z.infer<typeof MergedSponsorPutSchema>;

export type CreateSponsorSchemaType = z.infer<typeof CreateSponsorSchema>;
