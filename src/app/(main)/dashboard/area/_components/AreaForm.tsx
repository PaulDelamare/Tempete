"use client";

import React from "react";
import { FormProvider, Controller } from "react-hook-form";
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

import { useAreaForm } from "./useAreaForm";
import { Area } from "@/generated/prisma";
import { z } from "zod";
import { CreateAreaSchema } from "@/helpers/zod/area/create-area-schema";
import ImageUploadField from "@/components/form/uploadFile";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const AREA_TYPE_OPTIONS: { value: "stage" | "food" | "merch" | "chill" | "service" | "info" | "medical"; label: string }[] = [
    { value: "stage", label: "Stage" },
    { value: "food", label: "Restauration" },
    { value: "merch", label: "Merch" },
    { value: "chill", label: "Chill" },
    { value: "service", label: "Service" },
    { value: "info", label: "Info" },
    { value: "medical", label: "Medical" },
];

export default function AreaForm({ area }: { area?: Area }) {
    const initialData = area
        ? {
            ...area,
            latitude: area.latitude ? String(area.latitude) : "0",
            longitude: area.longitude ? String(area.longitude) : "0",
            capacity:
                area.capacity !== null && area.capacity !== undefined
                    ? area.capacity.toString()
                    : "0",
            type: (area.type as Area["type"]) ?? AREA_TYPE_OPTIONS[0].value,
            image: undefined as unknown as File | null,
        }
        : {
            name: "",
            description: null,
            latitude: "0",
            longitude: "0",
            capacity: "0",
            image: null,
            type: AREA_TYPE_OPTIONS[0].value,
        };

    const { form, onValid, onInvalid, success, loading, error } =
        useAreaForm(initialData);

    const fields = [
        {
            name: "name",
            label: "Nom",
            placeholder: "Nom de la zone",
            type: "text",
        },
        {
            name: "description",
            label: "Description",
            placeholder: "Description de la zone",
            type: "textarea",
        },
        {
            name: "latitude",
            label: "Latitude",
            placeholder: "Latitude de la zone",
            type: "text",
        },
        {
            name: "longitude",
            label: "Longitude",
            placeholder: "Longitude de la zone",
            type: "text",
        },
        {
            name: "capacity",
            label: "Capacité",
            placeholder: "Capacité de la zone",
            type: "text",
        },
    ];

    return (
        <CardWrapper
            cardTitle={area ? "Modifier la zone" : "Ajouter une zone"}
            cardDescription={
                area
                    ? "Modifiez les informations de la zone."
                    : "Créez une nouvelle zone en remplissant le formulaire."
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
                                    typeof CreateAreaSchema
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
                    <Controller
                        control={form.control}
                        name={"type" as keyof z.infer<typeof CreateAreaSchema>}
                        defaultValue={initialData.type}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(val) => field.onChange(val)}
                                        value={field.value ?? initialData.type}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AREA_TYPE_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <ImageUploadField
                        value={form.getValues("image")}
                        setValue={(file) =>
                            form.setValue("image", file, {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                        }
                        disabled={loading}
                        existingUrl={area?.imgurl ?? undefined}
                    />

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : area ? (
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
