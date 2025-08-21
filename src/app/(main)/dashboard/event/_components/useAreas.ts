"use client";

import { useEffect, useState } from "react";
import { Area } from "@/generated/prisma";

export function useAreas() {
     const [areas, setAreas] = useState<Area[]>([]);

     const fetchAreas = async () => {
          try {
               const res = await fetch("/api/areas", { cache: "no-store" });
               const data = (await res.json()) as Area[];
               setAreas(data);
          } catch (err) {
               console.error("Erreur lors du fetch des zones :", err);
          }
     };

     useEffect(() => {
          fetchAreas();
     }, []);

     return areas;
}
