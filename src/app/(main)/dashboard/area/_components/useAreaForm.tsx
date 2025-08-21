import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAreaSchema } from "@/helpers/zod/area/create-area-schema";
import { logRHFErrors, debugZodParse } from "@/helpers/form/form";
import { convertImageToBase64 } from "@/helpers/file/convertImageToBase64";
import { useAuthState } from "@/hooks/useAuthState";
import { z } from "zod";

type AreaFormValues = z.infer<typeof CreateAreaSchema> & { id?: string };

export function useAreaForm(initialData?: Partial<AreaFormValues>) {
    const {
        success,
        loading,
        error,
        setError,
        setLoading,
        setSuccess,
        resetState,
    } = useAuthState();

    const form: UseFormReturn<AreaFormValues> = useForm<AreaFormValues>({
        resolver: zodResolver(CreateAreaSchema),
        defaultValues: initialData,
        mode: "onSubmit",
    });

    const onValid = async (values: AreaFormValues) => {
        resetState();
        setLoading(true);

        try {
            let imgurl: string | null = null;
            if (values.image instanceof File) {
                imgurl = await convertImageToBase64(values.image);
            }

            const payload = {
                ...values,
                latitude: values.latitude
                    ? values.latitude
                    : "0",
                longitude: values.longitude
                    ? values.longitude
                    : "0",
                imgurl,
                capacity: values.capacity
                    ? values.capacity
                    : "0",
                id: initialData?.id ?? values.id,
            };

            const response = await fetch("/api/areas", {
                method: initialData?.id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            setLoading(false);

            if (!response.ok) {
                const data: { message?: string } = await response
                    .json()
                    .catch(() => ({}));

                setError(data?.message || "Erreur lors de l'enregistrement.");
                return;
            }

            setSuccess(
                initialData?.id
                    ? "Zone modifiée avec succès."
                    : "Zone créée avec succès."
            );
        } catch (err: unknown) {
            setLoading(false);
            setError("Erreur inattendue");
            console.error(err);
        }
    };

    const onInvalid = (errors: Record<string, unknown>) => {
        logRHFErrors(errors);
        debugZodParse(CreateAreaSchema, form.getValues());
        setError("Validation invalide : corrige les champs en rouge.");
    };

    return { form, onValid, onInvalid, success, loading, error };
}
