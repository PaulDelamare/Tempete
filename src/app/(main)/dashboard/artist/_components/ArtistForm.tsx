"use client";

import { FormProvider } from "react-hook-form";
import { Loader2 } from "lucide-react";

import CardWrapper from "@/components/auth/card-wrapper";
import LinksField from "@/components/form/artist/LinksField";
import ImageUploadField from "@/components/form/uploadFile";
import TagsField from "./TagsField";
import FormError from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useArtistForm } from "./userArtistForm";
import { Artist, Tag } from "@/generated/prisma";
import z from "zod";
import { CreateArtistSchema } from "@/helpers/zod/artist/create-artist-schema";

export default function ArtistForm({ artist }: { artist: Artist & { tagsJoin: { tag: Tag }[] } }) {

    const fields = [
        { name: "name", label: "Nom", placeholder: "Nom de l'artiste", type: "text" },
        { name: "nickname", label: "Surnom", placeholder: "Surnom (optionnel)", type: "text" },
        { name: "bio", label: "Biographie", placeholder: "Biographie de l'artiste", type: "textarea" },
    ];

    const { form, links, setLinks, selectedTags, setSelectedTags, onValid, onInvalid, success, loading, error } = useArtistForm({
        ...artist,
        links: artist?.links ? Object.entries(artist.links).map(([name, url]) => ({ name, url })) : [{ name: "", url: "" }],
        tagIds: artist?.tagsJoin?.map((t) => t.tag.id) ?? [],
    });

    return (
        <CardWrapper
            cardTitle={artist ? "Modifier l'artiste" : "Créer un artiste"}
            cardDescription={artist ? "Modifiez les informations de l'artiste." : "Créez un nouvel artiste en remplissant le formulaire."}
            maxWidth="max-w-6xl"
            className="px-4 mx-auto"
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onValid, onInvalid)} className="space-y-4">
                    {fields.map(field => (
                        <FormField key={field.name} control={form.control} name={field.name as keyof z.infer<
                            typeof CreateArtistSchema
                        >} render={({ field: hookField }) => (
                            <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                    {field.type === "textarea"
                                        ? <textarea {...hookField} rows={4} className="w-full border rounded p-2" disabled={loading} />
                                        : <Input {...hookField} type={field.type} placeholder={field.placeholder} disabled={loading} />}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    ))}

                    <LinksField
                        links={links}
                        updateLinkAt={(idx, partial) => {
                            const copy = [...links];
                            copy[idx] = { ...copy[idx], ...partial };
                            setLinks(copy);
                        }}
                        removeLink={idx => setLinks((links).filter((_: { name: string; url: string }, i: number) => i !== idx))}
                        addLink={() => setLinks([...(links), { name: "", url: "" }])}
                        errors={form.formState.errors.links}
                        disabled={loading}
                    />

                    <ImageUploadField
                        value={form.getValues("image")}
                        setValue={file => form.setValue("image", file, { shouldValidate: true, shouldDirty: true })}
                        disabled={loading}
                        existingUrl={artist?.imgurl ?? undefined}
                    />

                    <TagsField
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        tags={artist?.tagsJoin?.map((t) => t.tag) ?? []}
                        disabled={loading}
                        form={form}
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
