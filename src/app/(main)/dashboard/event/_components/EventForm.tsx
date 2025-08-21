"use client";

import { FormProvider } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CardWrapper from "@/components/auth/card-wrapper";
import { useEventForm } from "./useEventForm";
import { Event, Artist, Area, Tag } from "@/generated/prisma";
import { useTags } from "../../artist/_components/useTags";
import { useArtists } from "./useArtists";
import { useAreas } from "./useAreas";

type EventWithFlexibleDates = Omit<Event, "datestart" | "dateend"> & {
     datestart?: string | Date;
     dateend?: string | Date;
     tagsJoin: { tag: Tag }[];
     artists?: Artist[];
     area?: Area;
};

export default function EventForm({ event }: { event?: EventWithFlexibleDates }) {
     const { form, onValid, onInvalid, loading, success, error } = useEventForm(event);

     const allArtists = useArtists();
     const allAreas = useAreas();
     const allTags = useTags();


     const artistOptions = allArtists.map((a) => ({ value: a.id, label: a.name }));
     const areaOptions = allAreas.map((a) => ({ value: a.id, label: a.name }));
     const tagOptions = allTags.map((t) => ({ value: t.id, label: t.name }));

     return (
          <CardWrapper
               cardTitle={event ? "Modifier l'événement" : "Créer un événement"}
               cardDescription={event ? "Modifiez les informations de l'événement." : "Créez un nouvel événement."}
               maxWidth="max-w-7xl"
               className="px-4 mx-auto"
          >
               <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onValid, onInvalid)} className="space-y-4">

                         <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                             <Input {...field} placeholder="Nom de l'événement" disabled={loading} />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />

                         <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                             <textarea
                                                  {...field}
                                                  rows={4}
                                                  className="w-full min-h-12 border rounded p-2"
                                                  placeholder="Description de l'événement"
                                                  disabled={loading}
                                             />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />

                         <FormField
                              control={form.control}
                              name="status"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Statut</FormLabel>
                                        <FormControl>
                                             <Select
                                                  value={field.value ?? undefined}
                                                  onValueChange={field.onChange}
                                                  disabled={loading}
                                             >
                                                  <SelectTrigger className="w-full">
                                                       <SelectValue placeholder="Sélectionner un statut..." />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       {["draft", "published", "cancelled", "soldout", "hidden"].map((s) => (
                                                            <SelectItem key={s} value={s}>
                                                                 {s.charAt(0).toUpperCase() + s.slice(1)}
                                                            </SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />

                         <div className="grid grid-cols-2 gap-4">
                              <FormField
                                   control={form.control}
                                   name="datestart"
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel>Date de début</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       type="datetime-local"
                                                       value={field.value ?? ""}
                                                       onChange={field.onChange}
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />

                              <FormField
                                   control={form.control}
                                   name="dateend"
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel>Date de fin</FormLabel>
                                             <FormControl>
                                                  <Input type="datetime-local"
                                                       value={field.value ?? ""}
                                                       onChange={field.onChange} />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                         </div>

                         {/* <FormField
                              name="artists"
                              control={form.control}
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Artiste</FormLabel>
                                        <FormControl>
                                             <MultiSelect
                                                  options={artistOptions}
                                                  value={field.value}
                                                  onValueChange={field.onChange}
                                             />
                                        </FormControl>
                                        <FormMessage>{form.formState.errors.artists?.message}</FormMessage>
                                   </FormItem>
                              )}
                         /> */}
                         <FormField
                              control={form.control}
                              name="artists"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Artiste</FormLabel>
                                        <FormControl>
                                             <Select
                                                  value={Array.isArray(field.value) ? field.value[0] ?? undefined : field.value ?? undefined}
                                                  onValueChange={(val) => field.onChange([val])}
                                                  disabled={loading}
                                             >
                                                  <SelectTrigger className="w-full">
                                                       <SelectValue placeholder="Sélectionner un artiste..." />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       {artistOptions.map((a) => (
                                                            <SelectItem key={a.value} value={a.value}>
                                                                 {a.label}
                                                            </SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />

                         <FormField
                              control={form.control}
                              name="areaId"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Zone</FormLabel>
                                        <FormControl>
                                             <Select value={field.value ?? undefined} onValueChange={field.onChange} disabled={loading}>
                                                  <SelectTrigger className="w-full">
                                                       <SelectValue placeholder="Sélectionner une zone..." />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       {areaOptions.map((a) => (
                                                            <SelectItem key={a.value} value={a.value}>
                                                                 {a.label}
                                                            </SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="capacity"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Capacité</FormLabel>
                                        <FormControl>
                                             <Input
                                                  type="number"
                                                  value={field.value ?? ""}
                                                  onChange={(e) => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                                                  placeholder="Nombre maximum de participants"
                                                  disabled={loading}
                                             />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />

                         <FormField
                              control={form.control}
                              name="tagsJoin"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                             <MultiSelect options={tagOptions} value={field.value ?? []} onValueChange={field.onChange} disabled={loading} />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />

                         {error && <div className="text-red-600">{error}</div>}
                         {success && <div className="text-green-600">{success}</div>}

                         <Button type="submit" className="w-full" disabled={loading}>
                              {loading ? <Loader2 size={16} className="animate-spin" /> : event ? "Modifier" : "Créer"}
                         </Button>
                    </form>
               </FormProvider>
          </CardWrapper>
     );
}
