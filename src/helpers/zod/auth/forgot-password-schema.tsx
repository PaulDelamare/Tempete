import { z } from "zod";

export const ForgotPasswordSchema = z.object({
    email: z
        .email({ message: "Vous devez entrer une adresse e-mail valide." })
});
