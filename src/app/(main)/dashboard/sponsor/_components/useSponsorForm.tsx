import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSponsorSchema } from "@/helpers/zod/sponsor/create-sponsor-schema";
import { logRHFErrors, debugZodParse } from "@/helpers/form/form";
import { convertImageToBase64 } from "@/helpers/file/convertImageToBase64";
import { useAuthState } from "@/hooks/useAuthState";
import { z } from "zod";

type SponsorFormValues = z.infer<typeof CreateSponsorSchema> & { id?: string };

export function useSponsorForm(initialData?: Partial<SponsorFormValues>) {
    const {
        success,
        loading,
        error,
        setError,
        setLoading,
        setSuccess,
        resetState,
    } = useAuthState();

    const form: UseFormReturn<SponsorFormValues> = useForm<SponsorFormValues>({
        resolver: zodResolver(CreateSponsorSchema),
        defaultValues: initialData,
        mode: "onSubmit",
    });

    const onValid = async (values: SponsorFormValues) => {
        resetState();
        setLoading(true);

        try {
            let imgurl: string | null = null;
            if (values.image instanceof File) {
                imgurl = await convertImageToBase64(values.image);
            }

            const payload = {
                ...values,
                imgurl,
                id: initialData?.id ?? values.id,
            };

            const response = await fetch("/api/sponsors", {
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
                    ? "Sponsor modifié avec succès."
                    : "Sponsor créé avec succès."
            );
        } catch (err: unknown) {
            setLoading(false);
            setError("Erreur inattendue");
            console.error(err);
        }
    };

    const onInvalid = (errors: Record<string, unknown>) => {
        logRHFErrors(errors);
        debugZodParse(CreateSponsorSchema, form.getValues());
        setError("Validation invalide : corrige les champs en rouge.");
    };

    return { form, onValid, onInvalid, success, loading, error };
}
