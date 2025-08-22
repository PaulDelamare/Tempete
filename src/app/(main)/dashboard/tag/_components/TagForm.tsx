"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { CreateTagSchema } from "@/helpers/zod/tag/create-tag-schema";
import z from "zod";
import CardWrapper from "@/components/auth/card-wrapper";

export type TagFormValues = z.infer<typeof CreateTagSchema> & { id?: string };

export type TagFormProps = {
    tag?: TagFormValues;
    onSave?: (tag: TagFormValues) => void;
};

export default function TagForm({ tag, onSave }: TagFormProps) {
    const form = useForm<TagFormValues>({
        resolver: zodResolver(CreateTagSchema),
        defaultValues: {
            id: tag?.id,
            name: tag?.name ?? "",
            description: tag?.description ?? "",
        },
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onValid = async (values: TagFormValues) => {
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const res = await fetch("/api/tags", {
                method: tag?.id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, id: tag?.id }),
                cache: "no-store",
            });

            setLoading(false);

            if (!res.ok) {
                const data: { message?: string } = await res
                    .json()
                    .catch(() => ({}));
                setError(data?.message || "Erreur lors de l'enregistrement.");
                return;
            }

            setSuccess(
                values.id ? "Tag modifié avec succès." : "Tag créé avec succès."
            );
            onSave?.(values);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError("Erreur inattendue");
        }
    };

    return (
        <CardWrapper
            cardTitle={tag ? "Modifier le tag" : "Ajouter un tag"}
            cardDescription={
                tag
                    ? "Modifiez les informations du tag."
                    : "Créez un nouveau sponsor en remplissant le formulaire."
            }
            maxWidth="max-w-7xl"
            className="px-4 mx-auto"
        >
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(onValid)}
                    className="flex flex-col gap-4 pt-8"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Nom du tag"
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <textarea
                                        {...field}
                                        value={field.value ?? ""}
                                        rows={4}
                                        className="w-full border rounded p-2"
                                        placeholder="Description du tag (optionnel)"
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    {success && (
                        <div className="text-green-600 text-sm">{success}</div>
                    )}

                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <Loader2 className="animate-spin mr-2" size={16} />
                        ) : tag?.id ? (
                            "Modifier"
                        ) : (
                            "Créer"
                        )}
                    </Button>
                </form>
            </FormProvider>
        </CardWrapper>
    );
}
