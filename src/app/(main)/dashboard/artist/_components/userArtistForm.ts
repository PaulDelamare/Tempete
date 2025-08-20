import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateArtistSchema } from "@/helpers/zod/artist/create-artist-schema";
import { convertImageToBase64 } from "@/helpers/file/convertImageToBase64";
import { logRHFErrors, debugZodParse } from "@/helpers/form/form";
import { useAuthState } from "@/hooks/useAuthState";
import { z } from "zod";

type ArtistFormValues = z.infer<typeof CreateArtistSchema> & { id?: string };

export function useArtistForm(initialData?: Partial<ArtistFormValues>) {
     const { success, loading, error, setError, setLoading, setSuccess, resetState } = useAuthState();

     const form: UseFormReturn<ArtistFormValues> = useForm<ArtistFormValues>({
          resolver: zodResolver(CreateArtistSchema),
          defaultValues: initialData,
          mode: "onSubmit",
     });

     const [links, setLinks] = useState<NonNullable<ArtistFormValues["links"]>>(initialData?.links ?? []);
     const [selectedTags, setSelectedTags] = useState<NonNullable<ArtistFormValues["tagIds"]>>(initialData?.tagIds ?? []);

     useEffect(() => {
          form.setValue("links", links, { shouldValidate: true, shouldDirty: true });
     }, [links, form]);

     useEffect(() => {
          form.setValue("tagIds", selectedTags, { shouldValidate: true, shouldDirty: true });
     }, [selectedTags, form]);

     const onValid = async (values: ArtistFormValues) => {
          resetState();
          setLoading(true);

          try {
               let imgurl: string | null = null;
               if (values.image instanceof File) {
                    imgurl = await convertImageToBase64(values.image);
               }

               const response = await fetch(initialData?.id ? `/api/artist/${initialData.id}` : "/api/artist", {
                    method: initialData?.id ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...values, imgurl, links: values.links }),
               });

               setLoading(false);

               if (!response.ok) {
                    const data: { message?: string } = await response.json().catch(() => ({}));
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

     return { form, links, setLinks, selectedTags, setSelectedTags, onValid, onInvalid, success, loading, error };
}
