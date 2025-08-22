import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { sendEmail } from "./email/sendEmail";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data, request) {

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
        requireEmailVerification: true
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {

            await sendEmail(
                user.email,
                "tempete@russe.ru",
                "Vérification de votre adresse e-mail",
                "verifyEmail/verifyEmail",
                {
                    url
                },
            )
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true

    },
    plugins: [
        nextCookies()
    ]
});