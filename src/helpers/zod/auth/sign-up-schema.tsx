import { z } from "zod";

export const SignUpSchema = z
     .object({
          firstName: z
               .string()
               .min(2, { message: "Prénom trop court" })
               .max(100, { message: "Prénom trop long" }),
          lastName: z
               .string()
               .min(2, { message: "Nom de famille trop court" })
               .max(100, { message: "Nom de famille trop long" }),

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
          confirmPassword: z
               .string()
               .regex(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/,
                    {
                         message:
                              "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (#?!@$%^&*-)",
                    }
               )

     }).refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
     });
