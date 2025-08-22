"use client";

import { useState, useEffect } from "react";
import { Area, Artist, Event, EventStatus, Tag } from "@/generated/prisma";

// export type EventWithRelations = Event & {
//      artists: { artist: { id: string; name: string } }[];
//      tagsJoin: { tag: { id: string; name: string } }[];
//      area?: { id: string; name: string };
// };

export type EventWithRelations = {
     id: string;
     name: string;
     description: string | null;
     imgurl: string | null;
     datestart: Date | string;
     dateend: Date | string;
     capacity: number | null;
     status: EventStatus;
     areaId: string | null;
     created_at: Date;
     modified_at: Date;

     // relations
     area?: Area | null;
     artists: { artist: Artist }[];
     tagsJoin: { tag: Tag }[];
};

export function useEvent() {
     const [events, setEvents] = useState<EventWithRelations[]>([]);
     const [loading, setLoading] = useState(false);

     const fetchEvents = async (): Promise<EventWithRelations[]> => {
          setLoading(true);
          try {
               const res = await fetch("/api/events");
               const data: EventWithRelations[] = await res.json();
               setEvents(data);
               return data;
          } catch (err) {
               console.error(err);
               return [];
          } finally {
               setLoading(false);
          }
     };

     const createEvent = async (event: Partial<EventWithRelations>) => {
          try {
               const res = await fetch("/api/events", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(event),
               });
               const data: EventWithRelations = await res.json();
               setEvents((prev) => [...prev, data]);
               return data;
          } catch (err) {
               console.error("Erreur createEvent:", err);
               throw err;
          }
     };

     const updateEvent = async (id: string, event: Partial<EventWithRelations>) => {
          try {
               const res = await fetch(`/api/events/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(event),
               });
               const data: EventWithRelations = await res.json();
               setEvents((prev) => prev.map((e) => (e.id === id ? data : e)));
               return data;
          } catch (err) {
               console.error("Erreur updateEvent:", err);
               throw err;
          }
     };

     const deleteEvent = async (id: string) => {
          try {
               await fetch(`/api/events/${id}`, { method: "DELETE" });
               setEvents((prev) => prev.filter((e) => e.id !== id));
          } catch (err) {
               console.error("Erreur deleteEvent:", err);
               throw err;
          }
     };

     useEffect(() => {
          fetchEvents();
     }, []);

     return { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent };
}
