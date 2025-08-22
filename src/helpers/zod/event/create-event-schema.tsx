import { z } from "zod";
import { Area, EventStatus } from "@/generated/prisma";
import { idSchema } from "../id-schema";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_TAGS = 10;
const MIN_TAGS = 0;

export const CreateEventSchema = (areas: Area[]) =>
    z
        .object({
            name: z.string().min(1, "Le nom est obligatoire"),
            description: z.string().optional(),
            datestart: z
                .string()
                .min(1, "La date de début est obligatoire")
                .refine((val) => !isNaN(Date.parse(val)), {
                    message: "Date de début invalide",
                }),
            dateend: z
                .string()
                .min(1, "La date de fin est obligatoire")
                .refine((val) => !isNaN(Date.parse(val)), {
                    message: "Date de fin invalide",
                }),

            areaId: z.string().min(1, "La zone est obligatoire"),
            capacity: z
                .number({ error: "La capacité est obligatoire" })
                .int({ error: "La capacité doit être un nombre entier" })
                .positive({
                    message: "La capacité doit être un nombre positif",
                }),
            status: z.enum([
                "draft",
                "published",
                "cancelled",
                "soldout",
                "hidden",
            ]),
            artists: z.array(z.string()).min(1, "Un artiste est obligatoire"),
            tagsJoin: z.array(z.string()).optional(),
            image: z
                .any()
                .optional()
                .nullable()
                .refine(
                    (v) => v === undefined || v === null || v instanceof File,
                    {
                        message: "Fichier invalide",
                    }
                )
                .refine(
                    (v) =>
                        !v ||
                        (typeof v.size === "number" && v.size <= MAX_FILE_SIZE),
                    {
                        message: `Taille max ${MAX_FILE_SIZE / 1024 / 1024}MB`,
                    }
                )
                .refine((v) => !v || ACCEPTED_IMAGE_TYPES.includes(v.type), {
                    message: "Formats autorisés : jpg, png, webp",
                }),
        })
        .superRefine((data, ctx) => {
            if (data.areaId && data.capacity) {
                const area = areas.find((a) => a.id === data.areaId);
                if (area && data.capacity > area.capacity!) {
                    ctx.addIssue({
                        code: "custom",
                        message: `La capacité ne peut pas dépasser la capacité maximale de la zone (${area.capacity})`,
                        path: ["capacity"],
                    });
                }
            }
        })
        .superRefine((data, ctx) => {
            const start = new Date(data.datestart);
            const end = new Date(data.dateend);
            const now = new Date();

            if (start < now) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        "La date de début doit être supérieure à aujourd'hui",
                    path: ["datestart"],
                });
            }

            if (end < now) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        "La date de fin doit être supérieure à aujourd'hui",
                    path: ["dateend"],
                });
            }

            if (end < start) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        "La date de fin ne peut pas être avant la date de début",
                    path: ["dateend"],
                });
            }
        });

export const CreateEventApiSchema = z
    .object({
        name: z.string().min(1, "Le nom est obligatoire"),
        description: z.string().optional(),
        datestart: z
            .string()
            .min(1, "La date de début est obligatoire")
            .refine((val) => !isNaN(Date.parse(val)), {
                message: "Date de début invalide",
            }),
        dateend: z
            .string()
            .min(1, "La date de fin est obligatoire")
            .refine((val) => !isNaN(Date.parse(val)), {
                message: "Date de fin invalide",
            }),

        areaId: z.string().min(1, "La zone est obligatoire"),

        capacity: z
            .number({
                message: "La capacité est obligatoire",
            })
            .int({ message: "La capacité doit être un nombre entier" })
            .positive({ message: "La capacité doit être un nombre positif" }),

        status: z.enum([
            "draft",
            "published",
            "cancelled",
            "soldout",
            "hidden",
        ]),
        artists: z.array(z.string()).min(1, "Un artiste est obligatoire"),
        tagsJoin: z.array(z.string()).optional(),
        imgurl: z
            .string()
            .regex(/^data:image\/(png|jpg|jpeg|webp);base64,.+/, {
                message: "L’image doit être un base64 PNG/JPG/WEBP",
            })
            .nullable(),
    })
    .superRefine((data, ctx) => {
        const start = new Date(data.datestart);
        const end = new Date(data.dateend);
        const now = new Date();

        if (start < now) {
            ctx.addIssue({
                code: "custom",
                message: "La date de début doit être supérieure à aujourd'hui",
                path: ["datestart"],
            });
        }

        if (end < now) {
            ctx.addIssue({
                code: "custom",
                message: "La date de fin doit être supérieure à aujourd'hui",
                path: ["dateend"],
            });
        }

        if (end < start) {
            ctx.addIssue({
                code: "custom",
                message:
                    "La date de fin ne peut pas être avant la date de début",
                path: ["dateend"],
            });
        }
    });

export const MergedEventPutSchema = idSchema.extend(CreateEventApiSchema.shape);

export type CreateEventApiSchemaType = z.infer<typeof CreateEventApiSchema>;

export type MergedEventPutSchemaType = z.infer<typeof MergedEventPutSchema>;

export type CreateEventSchemaType = z.infer<typeof CreateEventSchema>;
