"use client";

import { useEffect, useState } from "react";
import { Artist } from "@/generated/prisma";

export function useArtists() {
     const [artists, setArtists] = useState<Artist[]>([]);

     const fetchArtists = async () => {
          try {
               const res = await fetch("/api/artist", { cache: "no-store" });
               const data = (await res.json()) as Artist[];
               setArtists(data);
          } catch (err) {
               console.error("Erreur lors du fetch des artistes :", err);
          }
     };

     useEffect(() => {
          fetchArtists();
     }, []);

     return artists;
}
