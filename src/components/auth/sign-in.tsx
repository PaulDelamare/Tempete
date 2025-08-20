"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient, signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/helpers/zod/auth/sign-in-schema";
import z from "zod";
import CardWrapper from "./card-wrapper";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from "../ui/form";
import FormError from "./form-error";
import { FormSuccess } from "./form-success";
import { useAuthState } from "@/hooks/useAuthState";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const router = useRouter();

    const [rememberMe, setRememberMe] = useState(false);

    const {
        error,
        success,
        loading,
        setError,
        setLoading,
        setSuccess,
        resetState,
    } = useAuthState();

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
        await signIn.email(
            {
                email: values.email,
                password: values.password,
                rememberMe: rememberMe,
            },
            {
                onRequest: () => {
                    resetState();
                    setLoading(true);
                },
                onResponse: () => {
                    setLoading(false);
                },
                onError: async (ctx) => {
                    if (ctx.error.status === 403) {
                        toastError(
                            "Erreur de connexion",
                            "Votre compte n'est pas encore vérifié."
                        );

                        setError("Votre compte n'est pas encore vérifié.");

                        await authClient.sendVerificationEmail({
                            email: values.email,
                            callbackURL: "/sign-in",
                        });
                    } else {
                        toastError(
                            "Erreur de connexion",
                            ctx.error.message === "Invalid email or password"
                                ? "Identifiants invalides"
                                : "Une erreur est survenue"
                        );

                        setError(
                            ctx.error.message === "Invalid email or password"
                                ? "Identifiants invalides"
                                : "Une erreur est survenue"
                        );
                    }
                },

                onSuccess: () => {
                    toastSuccess(
                        "Connexion réussie",
                        "Vous êtes maintenant connecté."
                    );
                    setSuccess("Vous êtes maintenant connecté.");
                    router.push("/dashboard/default");
                },
            }
        );
    };

    const fields = [
        {
            name: "email",
            label: "Email",
            placeholder: "john@example.com",
            type: "email",
            col: 2,
        },
        {
            name: "password",
            label: "Mot de passe",
            placeholder: "************",
            type: "password",
            col: 2,
        },
    ];
    return (
        <CardWrapper
            cardTitle="Connexion"
            cardDescription="Connectez-vous à votre compte"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {fields
                        .filter((f) => f.col === 2)
                        .map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={
                                    field.name as keyof z.infer<
                                        typeof SignInSchema
                                    >
                                }
                                render={({ field: hookField }) => (
                                    <FormItem>
                                        <FormLabel>{field.label}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...hookField}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                    <Link
                        href="/forgot-password"
                        className="ml-auto text-end w-full inline-block text-sm underline"
                    >
                        Mot de passe oublié ?
                    </Link>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="remember"
                            onClick={() => {
                                setRememberMe(!rememberMe);
                            }}
                        />
                        <Label htmlFor="remember">Se souvenir de moi</Label>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <p> Connexion </p>
                        )}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
