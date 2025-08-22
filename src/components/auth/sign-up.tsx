"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import FormError from "./form-error";
import { FormSuccess } from "./form-success";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import CardWrapper from "./card-wrapper";
import { useAuthState } from "@/hooks/useAuthState";
import { SignUpSchema } from "@/helpers/zod/auth/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { toastError, toastSuccess } from "@/lib/utils/toast";

export default function SignUp() {
     const router = useRouter();

     const {
          error,
          success,
          loading,
          setError,
          setLoading,
          setSuccess,
          resetState,
     } = useAuthState();

     const form = useForm<z.infer<typeof SignUpSchema>>({
          resolver: zodResolver(SignUpSchema),
          defaultValues: {
               email: "",
               password: "",
               firstName: "",
               lastName: "",
               confirmPassword: "",
          },
     });

     const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
          await signUp.email(
               {
                    email: values.email,
                    password: values.password,
                    name: `${values.firstName} ${values.lastName}`,
                    callbackURL: "/dashboard/user",
               },
               {
                    onRequest: () => {
                         resetState();
                         setLoading(true);
                    },
                    onResponse: () => {
                         setLoading(false);
                    },

                    onError: (ctx) => {
                         const error = ctx.error.message === "User already exists. Use another email."
                              ? "Cet email est déjà utilisé par un autre utilisateur"
                              : "Une erreur est survenue";

                         toastError("Erreur d'inscription", error);

                         setError(error);
                    },
                    onSuccess: async () => {
                         toastSuccess("Inscription réussie", "Votre compte a été créé avec succès.");
                         setSuccess("Votre compte a été créé avec succès.");

                         router.push("/dashboard");
                    },
               });
     };

     const fields = [
          { name: "firstName", label: "Prénom", placeholder: "John", type: "text", col: 1 },
          { name: "lastName", label: "Nom", placeholder: "Robinson", type: "text", col: 1 },
          { name: "email", label: "Email", placeholder: "john@example.com", type: "email", col: 2 },
          { name: "password", label: "Mot de passe", placeholder: "************", type: "password", col: 2 },
          { name: "confirmPassword", label: "Confirmer le mot de passe", placeholder: "*************", type: "password", col: 2 },
     ];

     return (
          <CardWrapper cardTitle="Inscription" cardDescription="Entrez vos informations pour créer un compte">
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                         <div className="grid grid-cols-2 gap-4">
                              {fields.filter(f => f.col === 1).map(field => (
                                   <FormField
                                        key={field.name}
                                        control={form.control}
                                        name={field.name as keyof z.infer<typeof SignUpSchema>}
                                        render={({ field: hookField }) => (
                                             <FormItem>
                                                  <FormLabel>{field.label}</FormLabel>
                                                  <FormControl>
                                                       <Input {...hookField} type={field.type} placeholder={field.placeholder} disabled={loading} />
                                                  </FormControl>
                                                  <FormMessage />
                                             </FormItem>
                                        )}
                                   />
                              ))}
                         </div>

                         {fields.filter(f => f.col === 2).map(field => (
                              <FormField
                                   key={field.name}
                                   control={form.control}
                                   name={field.name as keyof z.infer<typeof SignUpSchema>}
                                   render={({ field: hookField }) => (
                                        <FormItem>
                                             <FormLabel>{field.label}</FormLabel>
                                             <FormControl>
                                                  <Input {...hookField} type={field.type} placeholder={field.placeholder} disabled={loading} />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                         ))}

                         <FormError message={error} />
                         <FormSuccess message={success} />
                         <Button type="submit" className="w-full" disabled={loading}>
                              {loading ? <Loader2 size={16} className="animate-spin" /> : "Créer un compte"}
                         </Button>
                    </form>
               </Form>
          </CardWrapper>
     );
}
