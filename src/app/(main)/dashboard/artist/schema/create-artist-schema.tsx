import { z } from "zod";

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
    links: z.any().optional().nullable(),
    bio: z
        .string()
        .max(1000, { message: "Bio trop longue" })
        .optional()
        .nullable(),
    imgurl: z
        .string()
        .url({ message: "URL d'image invalide" })
        .optional()
        .nullable(),
    image: z
        .instanceof(File)
        .refine(
            (file) => {
                if (!file) return true;
                const isPngMime = file.type === "image/png";
                const isPngExt = file.name?.toLowerCase().endsWith(".png");
                return isPngMime && isPngExt;
            },
            {
                message:
                    "Le fichier doit être un PNG authentique (vérification du type et de l'extension)",
            }
        )
        .optional()
        .nullable(),
});
