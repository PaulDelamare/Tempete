"use client";

import { useState } from "react";
import { z } from "zod";
import { EventStatus, Event, Artist, Area, Tag } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateEventSchema } from "@/helpers/zod/event/create-event-schema";
import { debugZodParse, logRHFErrors } from "@/helpers/form/form";
import { useAreas } from "./useAreas";

type EventWithFlexibleDates = Omit<Event, "datestart" | "dateend"> & {
     datestart?: string | Date;
     dateend?: string | Date;
     tagsJoin: { tag: Tag }[];
     artists?: Artist[];
     area?: Area;
};

export function useEventForm(event?: EventWithFlexibleDates) {
     const [loading, setLoading] = useState(false);
     const [success, setSuccess] = useState<string | null>(null);
     const [error, setError] = useState<string | null>(null);
     const allAreas = useAreas();

     const yesterday = new Date();
     yesterday.setDate(yesterday.getDate() - 1);

     const form = useForm<z.infer<ReturnType<typeof CreateEventSchema>>>({
          resolver: zodResolver(CreateEventSchema(allAreas)),
          mode: "onChange",
          defaultValues: {
               name: event?.name ?? "",
               description: event?.description ?? "",
               datestart: event?.datestart
                    ? typeof event.datestart === "string"
                         ? event.datestart
                         : event.datestart.toISOString()
                    : "",
               dateend: event?.dateend
                    ? typeof event.dateend === "string"
                         ? event.dateend
                         : event.dateend.toISOString()
                    : "",
               capacity: event?.capacity ?? undefined,
               status: event?.status ?? EventStatus.draft,
               areaId: event?.areaId ?? "",
               artists: event?.artists?.map(a => a.artistId) ?? [],
               tagsJoin: event?.tagsJoin?.map((t) => t.tag.id) ?? [],
          },
     });

     const onValid = async (data: z.infer<ReturnType<typeof CreateEventSchema>>) => {
          setLoading(true);
          setError(null);
          setSuccess(null);

          try {
               const method = event ? "PUT" : "POST";
               const url = event ? `/api/event/${event.id}` : "/api/event";

               const payload = {
                    ...data,
                    datestart: new Date(data.datestart),
                    dateend: new Date(data.dateend),
               };

               console.log(payload)
               // const res = await fetch(url, {
               //      method,
               //      headers: { "Content-Type": "application/json" },
               //      body: JSON.stringify(payload),
               // });

               // if (!res.ok) throw new Error("Erreur lors de l'enregistrement de l'événement");

               setSuccess(event ? "Événement modifié !" : "Événement créé !");
          } catch (e: any) {
               setError(e.message ?? "Erreur inconnue");
          } finally {
               setLoading(false);
          }
     };

     const onInvalid = (errors: Record<string, unknown>) => {
          logRHFErrors(errors);
          debugZodParse(CreateEventSchema(allAreas), form.getValues());
          // setError("Validation invalide : corrige les champs en rouge.");
          setError("Veuillez corriger les erreurs du formulaire.");
     };

     return { form, onValid, onInvalid, loading, success, error };
}
