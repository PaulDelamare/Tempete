"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { Loader2 } from "lucide-react";

import CardWrapper from "@/components/auth/card-wrapper";
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

import {Sponsor} from "@/generated/prisma";
import { z } from "zod";
import { CreateSponsorSchema } from "@/helpers/zod/sponsor/create-sponsor-schema";
import ImageUploadField from "@/components/form/uploadFile";

import {useSponsorForm} from "@/app/(main)/dashboard/sponsor/_components/useSponsorForm";

export default function SponsorForm({ sponsor }: { sponsor?: Sponsor }) {
    const initialData = sponsor
        ? {
            ...sponsor,
            image: undefined as unknown as File | null,
        }
        : {
            name: "",
            image: null,
            website_url: "",
        };

    const { form, onValid, onInvalid, success, loading, error } =
        useSponsorForm(initialData);

    const fields = [
        {
            name: "name",
            label: "Nom",
            placeholder: "Nom du sponsor",
            type: "text",
        },
        {
            name: "website_url",
            label: "Site Web",
            placeholder: "Site Web du sponsor",
            type: "text",
        },
    ];

    return (
        <CardWrapper
            cardTitle={sponsor ? "Modifier le sponsor" : "Ajouter un sponsor"}
            cardDescription={
                sponsor
                    ? "Modifiez les informations du sponsor."
                    : "Créez un nouveau sponsor en remplissant le formulaire."
            }
            maxWidth="max-w-7xl"
            className="px-4 mx-auto"
        >
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(onValid, onInvalid)}
                    className="space-y-4"
                >

                    {fields.map((fieldDef) => (
                        <FormField
                            key={fieldDef.name}
                            control={form.control}
                            name={
                                fieldDef.name as keyof z.infer<
                                    typeof CreateSponsorSchema
                                >
                            }
                            render={({ field: hookField }) => (
                                <FormItem>
                                    <FormLabel>{fieldDef.label}</FormLabel>
                                    <FormControl>
                                        {fieldDef.type === "textarea" ? (
                                            <textarea
                                                {...hookField}
                                                rows={4}
                                                className="w-full max-h-96 h-24 min-h-12 border rounded p-2"
                                                placeholder={fieldDef.placeholder}
                                                disabled={loading}
                                            />
                                        ) : (
                                            <Input
                                                {...hookField}
                                                type={fieldDef.type}
                                                placeholder={fieldDef.placeholder}
                                                disabled={loading}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <ImageUploadField
                        value={form.getValues("image")}
                        setValue={(file) =>
                            form.setValue("image", file, {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                        }
                        disabled={loading}
                        existingUrl={sponsor?.imgurl ?? undefined}
                    />

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : sponsor ? (
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
