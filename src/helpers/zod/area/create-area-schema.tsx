import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const AreaTypeEnum = z.enum([
    "stage",
    "food",
    "merch",
    "chill",
    "service",
    "info",
    "medical",
]);

export const CreateAreaSchema = z.object({
    name: z.string().min(2, { message: "Nom trop court" }).max(100, { message: "Nom trop long" }),
    imgurl: z
        .string()
        .regex(/^data:image\/(png|jpg|jpeg|webp);base64,.+/, {
            message: "L’image doit être un base64 PNG/JPG/WEBP",
        })
        .optional()
        .nullable(),
    description: z.string().max(1000, { message: "Bio trop longue" }).optional().nullable(),
    type: AreaTypeEnum,
    latitude: z
        .number()
        .refine((val) => val >= -90 && val <= 90, { message: "Latitude invalide" })
        .optional()
        .nullable(),
    longitude: z
        .number()
        .refine((val) => val >= -180 && val <= 180, { message: "Longitude invalide" })
        .optional()
        .nullable(),
    capacity: z.number().int().positive().optional().nullable(),
    image: z
        .any()
        .optional()
        .nullable()
        .refine((v) => v === undefined || v === null || v instanceof File, { message: "Fichier invalide" })
        .refine((v) => !v || (typeof v.size === "number" && v.size <= MAX_FILE_SIZE), {
            message: `Taille max ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        })
        .refine((v) => !v || ACCEPTED_IMAGE_TYPES.includes(v.type), {
            message: "Formats autorisés : jpg, png, webp",
        }),
});

export const AreaSchema = z.object({
    name: z.string().min(1),
    nickname: z.string().nullable(),
    links: z.array(
        z.object({
            name: z.string().min(1, "Nom du lien requis"),
            url: z.url("URL invalide"),
        })
    ).optional(),
    bio: z.string().nullable(),
    tagIds: z.array(z.string().cuid()).optional(),
    imgurl: z
        .string()
        .regex(/^data:image\/(png|jpg|jpeg|webp);base64,.+/, {
            message: "L’image doit être un base64 PNG/JPG/WEBP",
        })
        .nullable(),
});

export const AreaIdSchema = z.object({
    id: z.cuid({ message: "Id doit être un CUID valide" }),
});

export const MergedAreaPutSchema = AreaIdSchema.extend(AreaSchema.shape);

export type CreateAreaApiSchemaType = z.infer<typeof AreaSchema>;

export type MergedAreaPutSchemaType = z.infer<typeof MergedAreaPutSchema>;

export type CreateAreaSchemaType = z.infer<typeof CreateAreaSchema>;