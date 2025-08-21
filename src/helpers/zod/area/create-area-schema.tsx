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

const decimalRegex = /^-?\d{1,3}(?:\.\d{1,20})?$/;

export const CreateAreaSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(1000).optional().nullable(),
    type: AreaTypeEnum,
    latitude: z.regex(decimalRegex, "Latitude invalide, 20 décimales max"),

    longitude: z.regex(decimalRegex, "Longitude invalide, 20 décimales max"),

    capacity: z
        .string({ error: "Capacité est requise" })
        .regex(/^\d+$/, "Capacité doit être un entier positif")
        .optional()
        .nullable(),

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

export const AreaSchema = z.object({
    name: z.string().min(1),
    type: AreaTypeEnum,
    description: z.string().nullable(),
    imgurl: z
        .string()
        .regex(/^data:image\/(png|jpg|jpeg|webp);base64,.+/, {
            message: "L’image doit être un base64 PNG/JPG/WEBP",
        })
        .nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    capacity: z.number().int().positive().nullable(),
});

export const AreaIdSchema = z.object({
    id: z.cuid({ message: "Id doit être un CUID valide" }),
});

export const MergedAreaPutSchema = AreaIdSchema.extend(AreaSchema.shape);

export type CreateAreaApiSchemaType = z.infer<typeof AreaSchema>;

export type MergedAreaPutSchemaType = z.infer<typeof MergedAreaPutSchema>;

export type CreateAreaSchemaType = z.infer<typeof CreateAreaSchema>;

