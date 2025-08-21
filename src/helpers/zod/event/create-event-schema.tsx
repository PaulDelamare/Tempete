import { z } from "zod";
import { Area, EventStatus } from "@/generated/prisma";

export const CreateEventSchema = (areas: Area[]) => z.object({
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
     capacity: z.number({ error: "La capacité est obligatoire" })
          .int({ error: "La capacité doit être un nombre entier" })
          .positive({ message: "La capacité doit être un nombre positif" }),
     status: z.enum(["draft", "published", "cancelled", "soldout", "hidden"]),
     artists: z.array(z.string()).min(1, "Un artiste est obligatoire"),
     tagsJoin: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
     if (data.areaId && data.capacity) {

          const area = areas.find(a => a.id === data.areaId);
          if (area && data.capacity > area.capacity!) {
               ctx.addIssue({
                    code: "custom",
                    message: `La capacité ne peut pas dépasser la capacité maximale de la zone (${area.capacity})`,
                    path: ["capacity"],
               });
          }
     }
}).superRefine((data, ctx) => {
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
               message: "La date de fin ne peut pas être avant la date de début",
               path: ["dateend"],
          });
     }
});