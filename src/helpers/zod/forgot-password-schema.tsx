import { z } from "zod";

export const ForgotPasswordSchema = z.object({
    email: z
        .string({ error: 'Vous devez entrer une adresse e-mail valide.' })
        .email({ message: "Vous devez entrer une adresse e-mail valide." })
});
