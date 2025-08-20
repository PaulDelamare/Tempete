import { z } from "zod";

export const SignInSchema = z
     .object({
          email: z
               .email({ message: "Email invalide" }),

          password: z
               .string()
               .regex(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/,
                    {
                         message:
                              "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (#?!@$%^&*-)",
                    }
               ),
     });
