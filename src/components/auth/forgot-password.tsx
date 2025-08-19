"use client"

import { useForm } from 'react-hook-form'
import CardWrapper from './card-wrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from './form-error'
import { FormSuccess } from './form-success'
import { useAuthState } from '@/hooks/useAuthState'
import { authClient } from '@/lib/auth-client'
import { ForgotPasswordSchema } from '@/helpers/zod/auth/forgot-password-schema'
import { Loader2 } from 'lucide-react'


const ForgotPassword = () => {
     const { error, success, loading, setError, setSuccess, setLoading, resetState } = useAuthState()

     const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
          resolver: zodResolver(ForgotPasswordSchema),
          defaultValues: {
               email: '',
          }
     })

     const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
          try {
               await authClient.forgetPassword({
                    email: values.email,
                    redirectTo: "/reset-password"
               }, {
                    onResponse: () => {
                         setLoading(false)
                    },
                    onRequest: () => {
                         resetState()
                         setLoading(true)
                    },
                    onSuccess: () => {
                         setSuccess("Reset password link has been sent")
                    },
                    onError: (ctx) => {
                         setError(ctx.error.message);
                    },
               });

          } catch (error) {
               console.error(error)
               setError("Something went wrong")
          }
     }

     return (
          <CardWrapper
               cardTitle='Mot de passe oublié'
               cardDescription='Entrez votre email pour envoyer un lien de réinitialisation du mot de passe'
               cardFooterDescription="Changé d'avis ?"
               cardFooterLink='/sign-in'
               cardFooterLinkTitle='Se connecter'
          >
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                             <Input
                                                  disabled={loading}
                                                  type="email"
                                                  placeholder='example@gmail.com'
                                                  {...field}
                                             />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />
                         <FormError message={error} />
                         <FormSuccess message={success} />

                         <Button type="submit" className="w-full" disabled={loading}>
                              {loading ? (
                                   <Loader2 size={16} className="animate-spin" />
                              ) : (
                                   <p> Envoyer </p>
                              )}
                         </Button>
                    </form>
               </Form>

          </CardWrapper>
     )
}

export default ForgotPassword