import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { sendEmail } from "./email/sendEmail";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data, request) {
            // Send an email to the user with a link to reset their password
            await sendEmail(
                data.user.email,
                "tempete@russe.ru",
                "Réinitialisation du mot de passe",
                "resetPassword/resetPassword",
                {
                    url: data.url
                },
            )
        },
    },
});