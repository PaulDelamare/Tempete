"use client";

import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateArtistSchema } from "@/helpers/zod/artist/create-artist-schema";
import { convertImageToBase64 } from "@/helpers/file/convertImageToBase64";
import { logRHFErrors, debugZodParse } from "@/helpers/form/form";
import { useAuthState } from "@/hooks/useAuthState";
import { z } from "zod";

type ArtistFormValues = z.infer<typeof CreateArtistSchema> & { id?: string };

export function useArtistForm(initialData?: Partial<ArtistFormValues>) {
     const { success, loading, error, setError, setLoading, setSuccess, resetState } =
          useAuthState();

     const form: UseFormReturn<ArtistFormValues> = useForm<ArtistFormValues>({
          resolver: zodResolver(CreateArtistSchema),
          defaultValues: {
               ...initialData,
               tagIds: initialData?.tagIds ?? [],
               links: initialData?.links ?? [],
          },
          mode: "onSubmit",
     });

     useEffect(() => {
          if (!initialData) return;
          form.reset({
               ...initialData,
               tagIds: initialData.tagIds ?? [],
               links: initialData.links ?? [],
          });
     }, [initialData?.id, initialData?.name]);

     const onValid = async (values: ArtistFormValues) => {
          resetState();
          setLoading(true);

          try {
               let imgurl: string | null = null;
               if (values.image instanceof File) {
                    imgurl = await convertImageToBase64(values.image);
               }

               const payload = {
                    ...values,
                    id: initialData?.id,
                    imgurl,
                    links: values.links ?? [],
                    tagIds: values.tagIds ?? [],
               };

               const response = await fetch("/api/artist", {
                    method: initialData?.id ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    cache: "no-store",
               });

               setLoading(false);

               if (!response.ok) {
                    const data: { message?: string; details?: unknown } = await response.json().catch(() => ({}));
                    if (data?.details && Array.isArray(data.details)) {
                         (data.details as { path: string | string[]; message?: string }[]).forEach(d => {
                              let path: string;
                              if (typeof d.path === "string") path = d.path;
                              else if (Array.isArray(d.path)) path = d.path.join(".");
                              else path = "root";

                              form.setError(path as keyof ArtistFormValues, { type: "server", message: d.message ?? "Erreur" });
                         });
                    }
                    setError(data?.message || "Erreur lors de l'enregistrement.");
                    return;
               }

               setSuccess(initialData?.id ? "Artiste modifié avec succès." : "Artiste créé avec succès.");
          } catch (err: unknown) {
               setLoading(false);
               setError("Erreur inattendue");
               console.error(err);
          }
     };

     const onInvalid = (errors: Record<string, unknown>) => {
          logRHFErrors(errors);
          debugZodParse(CreateArtistSchema, form.getValues());
          setError("Validation invalide : corrige les champs en rouge.");
     };

     return {
          form,
          onValid,
          onInvalid,
          success,
          loading,
          error,
     };
}
