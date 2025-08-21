import { z } from "zod";

export const idSchema = z.object({
    id: z.cuid({ error: "Id doit être un CUID valide" }),
});
