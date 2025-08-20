import { z } from "zod";

export const SignInSchema = z.object({
    email: z.email({ message: "Email invalide" }),

    password: z.string({ error: "Mot de passe invalide" }),
});
