import { useEffect, useState } from "react";
import { Tag } from "@/generated/prisma";

export function useTags(initial?: Tag[]) {
     const [tags, setTags] = useState<Tag[]>(initial ?? []);

     useEffect(() => {
          if (initial && initial.length > 0) return;

          let mounted = true;
          (async () => {
               try {
                    const res = await fetch("/api/tags", { cache: "no-store" });
                    if (!res.ok) return;
                    const data: Tag[] = await res.json();
                    if (mounted) setTags(data);
               } catch (e) {
               }
          })();

          return () => {
               mounted = false;
          };
     }, []);

     return tags;
}
