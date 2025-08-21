"use client";

import { FormProvider } from "react-hook-form";
import { Loader2 } from "lucide-react";

import CardWrapper from "@/components/auth/card-wrapper";
import LinksField from "@/components/form/artist/LinksField";
import ImageUploadField from "@/components/form/uploadFile";
import FormError from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";

import { Artist, Tag } from "@/generated/prisma";
import { z } from "zod";
import { CreateArtistSchema } from "@/helpers/zod/artist/create-artist-schema";
import { useTags } from "./useTags";
import { useArtistForm } from "./useArtistForm";

export default function ArtistForm({
    artist,
}: {
    artist: Artist & { tagsJoin: { tag: Tag }[] };
}) {

    const { form, onValid, onInvalid, loading, success, error } = useArtistForm({
        ...artist,
        links: Array.isArray(artist?.links)
            ? artist.links.map((link) => {
                if (typeof link === "object" && link !== null) {
                    const obj = link as Record<string, unknown>;
                    return {
                        name: typeof obj.name === "string" ? obj.name : "",
                        url: typeof obj.url === "string" ? obj.url : "",
                    };
                }
                return { name: "", url: "" };
            })
            : [],
        tagIds: artist?.tagsJoin?.map((t) => t.tag.id) ?? [],
    });

    const fields = [
        { name: "name", label: "Nom", placeholder: "Nom de l'artiste", type: "text" },
        { name: "nickname", label: "Surnom", placeholder: "Surnom (optionnel)", type: "text" },
        { name: "bio", label: "Biographie", placeholder: "Biographie de l'artiste", type: "textarea" },
    ] as const;

    const tagsOptions = useTags();

    return (
        <CardWrapper
            cardTitle={artist ? "Modifier l'artiste" : "Créer un artiste"}
            cardDescription={
                artist
                    ? "Modifiez les informations de l'artiste."
                    : "Créez un nouvel artiste en remplissant le formulaire."
            }
            maxWidth="max-w-7xl"
            className="px-4 mx-auto"
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onValid, onInvalid)} className="space-y-4">
                    {fields.map((field) => (
                        <FormField
                            key={field.name}
                            control={form.control}
                            name={field.name as keyof z.infer<typeof CreateArtistSchema>}
                            render={({ field: hookField }) => (
                                <FormItem>
                                    <FormLabel>{field.label}</FormLabel>
                                    <FormControl>
                                        {field.type === "textarea" ? (
                                            <textarea
                                                {...hookField}
                                                rows={4}
                                                className="w-full max-h-96 h-24 min-h-12 border rounded p-2"
                                                placeholder={field.placeholder}
                                                disabled={loading}
                                            />
                                        ) : (
                                            <Input
                                                {...hookField}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                disabled={loading}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <LinksField
                        links={form.getValues("links") ?? []}
                        updateLinkAt={(idx, partial) => {
                            const currentLinks = form.getValues("links") ?? [];
                            const copy = [...currentLinks];
                            copy[idx] = { ...copy[idx], ...partial };
                            form.setValue("links", copy, { shouldValidate: true, shouldDirty: true });
                        }}
                        removeLink={(idx) => {
                            const currentLinks = form.getValues("links") ?? [];
                            form.setValue(
                                "links",
                                currentLinks.filter((_, i) => i !== idx),
                                { shouldValidate: true, shouldDirty: true }
                            );
                        }}
                        addLink={() => {
                            const currentLinks = form.getValues("links") ?? [];
                            form.setValue(
                                "links",
                                [...currentLinks, { name: "", url: "" }],
                                { shouldValidate: true, shouldDirty: true }
                            );
                        }}
                        errors={form.formState.errors.links}
                        disabled={loading}
                    />

                    <ImageUploadField
                        value={form.getValues("image")}
                        setValue={(file) =>
                            form.setValue("image", file, { shouldValidate: true, shouldDirty: true })
                        }
                        disabled={loading}
                        existingUrl={artist?.imgurl ?? undefined}
                    />

                    <FormField
                        control={form.control}
                        name={"tagIds" as keyof z.infer<typeof CreateArtistSchema>}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={tagsOptions.map((t) => ({ value: t.id, label: t.name }))}
                                            value={field.value ?? []}
                                            onValueChange={field.onChange}
                                            placeholder="Sélectionner des tags..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : artist ? "Modifier" : "Créer"}
                    </Button>
                </form>
            </FormProvider>
        </CardWrapper>
    );
}
