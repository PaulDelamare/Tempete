import { z } from "zod";
import { idSchema } from "../id-schema";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_TAGS = 10;
const MIN_TAGS = 0;

export const CreateArtistSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Nom trop court" })
        .max(100, { message: "Nom trop long" }),
    nickname: z
        .string()
        .max(100, { message: "Surnom trop long" })
        .optional()
        .nullable(),
    links: z
        .array(
            z.object({
                name: z
                    .string()
                    .min(1, { message: "Nom du lien requis" })
                    .max(100, { message: "Nom trop long" }),
                url: z
                    .string()
                    .url({ message: "URL invalide (ex: https://...)" }),
            })
        )
        .optional()
        .nullable(),
    bio: z
        .string()
        .max(1000, { message: "Bio trop longue" })
        .optional()
        .nullable(),

    image: z
        .any()
        .optional()
        .nullable()
        .refine((v) => v === undefined || v === null || v instanceof File, {
            message: "Fichier invalide",
        })
        .refine(
            (v) =>
                !v || (typeof v.size === "number" && v.size <= MAX_FILE_SIZE),
            {
                message: `Taille max ${MAX_FILE_SIZE / 1024 / 1024}MB`,
            }
        )
        .refine((v) => !v || ACCEPTED_IMAGE_TYPES.includes(v.type), {
            message: "Formats autorisés : jpg, png, webp",
        }),

    tagIds: z
        .array(z.cuid({ message: "Id doit être un CUID valide" }))
        .optional()
        .nullable()
        .superRefine((arr, ctx) => {
            if (!Array.isArray(arr)) return;
            if (arr.length < MIN_TAGS) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    minimum: MIN_TAGS,
                    type: "array",
                    inclusive: true,
                    origin: "array",
                    message: `Au moins ${MIN_TAGS} tag(s) requis`,
                });
            }
            if (arr.length > MAX_TAGS) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    maximum: MAX_TAGS,
                    type: "array",
                    inclusive: true,
                    origin: "array",
                    message: `Au plus ${MAX_TAGS} tags autorisés`,
                });
            }
            const dupes = arr.filter((v, i) => arr.indexOf(v) !== i);
            if (dupes.length > 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    origin: "array",
                    message: `Identifiants de tags dupliqués : ${[
                        ...new Set(dupes),
                    ].join(", ")}`,
                });
            }
        }),
});

export const ArtistSchema = z.object({
    name: z.string().min(1),
    nickname: z.string().nullable(),
    links: z
        .array(
            z.object({
                name: z.string().min(1, "Nom du lien requis"),
                url: z.url("URL invalide"),
            })
        )
        .optional(),
    bio: z.string().nullable(),
    tagIds: z.array(z.string().cuid()).optional(),
    imgurl: z
        .string()
        .regex(/^data:image\/(png|jpg|jpeg|webp);base64,.+/, {
            message: "L’image doit être un base64 PNG/JPG/WEBP",
        })
        .nullable(),
});

export const MergedArtistPutSchema = idSchema.extend(ArtistSchema.shape);

export type CreateArtistApiSchemaType = z.infer<typeof ArtistSchema>;

export type MergedArtistPutSchemaType = z.infer<typeof MergedArtistPutSchema>;

export type CreateArtistSchemaType = z.infer<typeof CreateArtistSchema>;
