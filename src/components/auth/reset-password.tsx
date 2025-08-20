"use client"

import React from 'react'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import CardWrapper from './card-wrapper'
import FormError from './form-error'
import { FormSuccess } from './form-success'
import { ResetPasswordSchema } from '@/helpers/zod/auth/reset-password-schema'
import { authClient } from '@/lib/auth-client'
import { useAuthState } from '@/hooks/useAuthState'
import { Loader2 } from 'lucide-react'


const ResetPassword = () => {
     const router = useRouter();
     const searchParams = useSearchParams();
     const token = searchParams.get("token");

     const {
          error,
          success,
          loading,
          setError,
          setLoading,
          setSuccess,
          resetState,
     } = useAuthState();

     const form = useForm<z.infer<typeof ResetPasswordSchema>>({
          resolver: zodResolver(ResetPasswordSchema),
          defaultValues: {
               password: "",
               confirmPassword: "",
          },
     });

     const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {

          if (!token) {
               setError("Token manquant ou invalide");
               return;
          }

          try {
               await authClient.resetPassword(
                    {
                         newPassword: values.password,
                         token: token,
                    },
                    {
                         onResponse: () => {
                              setLoading(false);
                         },
                         onRequest: () => {
                              resetState();
                              setLoading(true);
                         },
                         onSuccess: () => {
                              setSuccess("New password has been created");
                              router.push("/sign-in");
                         },
                         onError: (ctx) => {
                              setError(ctx.error.message);
                         },
                    },
               );
          } catch (error) {
               console.error(error);
               setError("Quelque chose s'est mal passé");
          }
     };

     const fields = [
          { name: "password", label: "Mot de passe", placeholder: "************", type: "password", col: 2 },
          { name: "confirmPassword", label: "Confirmer le mot de passe", placeholder: "*************", type: "password", col: 2 }
     ];
     return (
          <CardWrapper
               cardTitle='Réinitialisation du mot de passe'
               cardDescription='Créer un nouveau mot de passe'
               cardFooterLink='/sign-in'
               cardFooterDescription="Changé d'avis ? "
               cardFooterLinkTitle='Connexion'
          >
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         {fields.filter(f => f.col === 2).map(field => (
                              <FormField
                                   key={field.name}
                                   control={form.control}
                                   name={field.name as keyof z.infer<typeof ResetPasswordSchema>}
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
                              {loading ? (
                                   <Loader2 size={16} className="animate-spin" />
                              ) : (
                                   <p> Modifier </p>
                              )}
                         </Button>
                    </form>
               </Form>
          </CardWrapper>
     )
}

export default ResetPassword