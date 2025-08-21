"use client";

import { FormProvider } from "react-hook-form";
import { Loader2 } from "lucide-react";

import CardWrapper from "@/components/auth/card-wrapper";
import FormError from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useAreaForm } from "./useAreaForm";
import { Area } from "@/generated/prisma";
import z from "zod";
import { CreateAreaSchema } from "@/helpers/zod/area/create-area-schema";
import ImageUploadField from "@/components/form/uploadFile";

export default function AreaForm({ area }: { area: Area }) {

    const fields = [
        { name: "name", label: "Nom", placeholder: "Nom de la zone", type: "text" },
        { name: "description", label: "Description", placeholder: "Description de la zone", type: "textarea" },
        { name: "latitude", label: "Latitude", placeholder: "Latitude de la zone", type: "number" },
        { name: "longitude", label: "Longitude", placeholder: "Longitude de la zone", type: "number" },
        { name: "capacity", label: "Capacité", placeholder: "Capacité de la zone", type: "number" },
    ];

    const { form, onValid, onInvalid, success, loading, error } = useAreaForm({
        ...area,
        latitude: area.latitude?.toNumber() ?? 0,
        longitude: area.longitude?.toNumber() ?? 0,
        capacity: area.capacity ?? 0,
    });

    return (
        <CardWrapper
            cardTitle={area ? "Modifier la zone" : "Ajouter une zone"}
            cardDescription={area ? "Modifiez les informations de la zone." : "Créez une nouvelle zone en remplissant le formulaire."}
            maxWidth="max-w-7xl"
            className="px-4 mx-auto"
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onValid, onInvalid)} className="space-y-4">
                    {fields.map(field => (
                        <FormField key={field.name} control={form.control} name={field.name as keyof z.infer<
                            typeof CreateAreaSchema
                        >} render={({ field: hookField }) => (
                            <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                    {field.type === "textarea" ? (
                                        <div>
                                            <textarea
                                                {...hookField}
                                                rows={4}
                                                className="w-full max-h-96 h-24 min-h-12 border rounded p-2"
                                                placeholder={field.placeholder}
                                                disabled={loading}
                                            />
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Petite description de la zone... (quelques lignes suffisent)
                                            </div>
                                        </div>
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
                        )} />
                    ))}

                    <ImageUploadField
                        value={form.getValues("image")}
                        setValue={file => form.setValue("image", file, { shouldValidate: true, shouldDirty: true })}
                        disabled={loading}
                        existingUrl={area?.imgurl ?? undefined}
                    />

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : area ? "Modifier" : "Créer"}
                    </Button>
                </form>
            </FormProvider>
        </CardWrapper>
    );
}