"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from "@/components/ui/form";
import FormError from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import CardWrapper from "@/components/auth/card-wrapper";
import { CreateArtistSchema } from "../schema/create-artist-schema";
import { Artist, Tag } from "@/generated/prisma";
import { useAuthState } from "@/hooks/useAuthState";

export default function ArtistForm({
    artist,
}: {
    artist: Artist & { tagsJoin: { tag: Tag }[] };
}) {
    const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>(
        artist?.tagsJoin?.map((t) => t.tag.id) || []
    );

    const {
        success,
        loading,
        error,
        setError,
        setLoading,
        setSuccess,
        resetState,
    } = useAuthState();

    const form = useForm<z.infer<typeof CreateArtistSchema>>({
        // resolver: zodResolver(CreateArtistSchema),
        defaultValues: {
            name: artist?.name || "",
            nickname: artist?.nickname || "",
            bio: artist?.bio || "",
            imgurl: artist?.imgurl || "",
            image: undefined,
        },
    });

    const fields = [
        {
            name: "name",
            label: "Nom",
            placeholder: "Nom de l'artiste",
            type: "text",
        },
        {
            name: "nickname",
            label: "Surnom",
            placeholder: "Surnom (optionnel)",
            type: "text",
        },
        {
            name: "bio",
            label: "Biographie",
            placeholder: "Biographie de l'artiste",
            type: "textarea",
        },
        {
            name: "links",
            label: "Liens (JSON)",
            placeholder: '{"instagram": "...", "site": "..."}',
            type: "textarea",
        },
    ];

    // Initialisation des liens sous forme [{ name, url }]
    const initialLinks =
        artist?.links && typeof artist.links === "object"
            ? Object.entries(artist.links).map(([name, url]) => ({
                  name,
                  url: String(url),
              }))
            : [{ name: "", url: "" }];

    const [links, setLinks] =
        useState<{ name: string; url: string }[]>(initialLinks);

    const handleSubmit = async (values: z.infer<typeof CreateArtistSchema>) => {
        // Log des erreurs Zod à chaque submit
        if (Object.values(form.formState.errors).length > 0) {
            console.log('Erreurs Zod:', form.formState.errors);
        }
        console.log('Erreurs Zod:', form.clearErrors("image"));
        resetState();
        setLoading(true);

        // Debug : log les valeurs validées et brutes
        console.log("values validés Zod:", values);
        console.log("valeurs brutes:", form.getValues());
        console.log("image avant conversion:", values.image);

        try {
            // Conversion des liens en objet {name: url}
            const linksObj: Record<string, string> = {};
            links.forEach((l) => {
                if (l.name && l.url) linksObj[l.name] = l.url;
            });

            let imageBase64 = null;
            if (values.image instanceof File) {
                imageBase64 = await convertImageToBase64(values.image);
                console.log("image après conversion base64:", imageBase64);
            }

            const response = await fetch(
                artist?.id ? `/api/artist/${artist.id}` : "/api/artist",
                {
                    method: artist?.id ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...values,
                        links: linksObj,
                        tagIds: selectedTags,
                        image: imageBase64,
                    }),
                }
            );

            setLoading(false);
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                setError(data?.message || "Erreur lors de l'enregistrement.");
                form.setError("name", {
                    message:
                        data?.message || "Erreur lors de l'enregistrement.",
                });
                return;
            }

            setSuccess(
                artist?.id
                    ? "Artiste modifié avec succès."
                    : "Artiste créé avec succès."
            );
            // onSuccess
        } catch (err: unknown) {
            setLoading(false);
            setError("Erreur inattendue");
        }
    };

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <CardWrapper
            cardTitle={artist ? "Modifier l'artiste" : "Créer un artiste"}
            maxWidth="max-w-6xl"
            className="px-4 mx-auto"
            cardDescription={
                artist
                    ? "Modifiez les informations de l'artiste"
                    : "Ajoutez un nouvel artiste"
            }
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    {fields
                        .filter((field) => field.name !== "links")
                        .map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={
                                    field.name as keyof z.infer<
                                        typeof CreateArtistSchema
                                    >
                                }
                                render={({ field: hookField }) => (
                                    <FormItem>
                                        <FormLabel>{field.label}</FormLabel>
                                        <FormControl>
                                            {field.type === "textarea" ? (
                                                <textarea
                                                    {...hookField}
                                                    value={
                                                        typeof hookField.value ===
                                                        "string"
                                                            ? hookField.value
                                                            : JSON.stringify(
                                                                  hookField.value,
                                                                  null,
                                                                  2
                                                              )
                                                    }
                                                    rows={
                                                        field.name === "bio"
                                                            ? 4
                                                            : 3
                                                    }
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    className="w-full border rounded p-2 font-mono"
                                                    disabled={loading}
                                                />
                                            ) : (
                                                <Input
                                                    {...hookField}
                                                    type={field.type}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    disabled={loading}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    {/* Liens dynamiques */}
                    <div className="space-y-2">
                        <FormLabel>Liens</FormLabel>
                        {links.map((link, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <Input
                                    type="text"
                                    placeholder="Nom du lien (ex: instagram)"
                                    value={link.name}
                                    onChange={(e) => {
                                        const newLinks = [...links];
                                        newLinks[idx].name = e.target.value;
                                        setLinks(newLinks);
                                    }}
                                    className="w-1/3"
                                    disabled={loading}
                                />
                                <Input
                                    type="url"
                                    placeholder="URL du lien"
                                    value={link.url}
                                    onChange={(e) => {
                                        const newLinks = [...links];
                                        newLinks[idx].url = e.target.value;
                                        setLinks(newLinks);
                                    }}
                                    className="w-2/3"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="text-red-500 ml-2"
                                    onClick={() => {
                                        setLinks((prev) =>
                                            prev.filter((_, i) => i !== idx)
                                        );
                                    }}
                                    disabled={loading}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="text-blue-500 mt-2"
                            onClick={() =>
                                setLinks((prev) => [
                                    ...prev,
                                    { name: "", url: "" },
                                ])
                            }
                            disabled={loading}
                        >
                            + Ajouter un lien
                        </button>
                    </div>
                    {/* Champ image upload avec preview, suppression et validation Zod */}
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="image">
                                    Image de profil (optionnelle)
                                </FormLabel>
                                <div className="flex items-end gap-4">
                                    {(imagePreview || artist?.imgurl) && (
                                        <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                            <img
                                                src={
                                                    imagePreview
                                                        ? imagePreview
                                                        : artist?.imgurl
                                                        ? artist.imgurl
                                                        : ""
                                                }
                                                alt="Profile preview"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 w-full">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    field.onChange(file);
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setImagePreview(reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                } else {
                                                    field.onChange(undefined);
                                                    setImagePreview(null);
                                                }
                                            }}
                                            className="w-full"
                                            disabled={loading}
                                        />
                                        {(imagePreview || artist?.imgurl) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    field.onChange(undefined);
                                                    setImagePreview(null);
                                                }}
                                                className="ml-2 text-red-500"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Multi-select tags */}
                    <div>
                        <FormLabel>Tags</FormLabel>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <label
                                    key={tag.id}
                                    className="flex items-center gap-1 border rounded px-2 py-1 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={() => {
                                            setSelectedTags((prev) =>
                                                prev.includes(tag.id)
                                                    ? prev.filter(
                                                          (id) => id !== tag.id
                                                      )
                                                    : [...prev, tag.id]
                                            );
                                        }}
                                        disabled={loading}
                                    />
                                    <span>{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(handleSubmit)}
                        className="w-full"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <p>{artist ? "Modifier" : "Créer"}</p>
                        )}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
