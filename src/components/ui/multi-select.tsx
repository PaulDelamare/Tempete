"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

type Option = { value: string; label: string };

type Props = {
     options: Option[];
     value: string[]; // valeurs sélectionnées
     onValueChange: (next: string[]) => void;
     placeholder?: string;
     disabled?: boolean;
     className?: string;
     searchPlaceholder?: string;
};

/**
 * MultiSelect simple :
 * - affichage des items sélectionnés sous forme de badges dans le trigger
 * - popover avec input de recherche + liste filtrée avec checkbox
 */
export function MultiSelect({
     options,
     value,
     onValueChange,
     placeholder = "Sélectionner...",
     disabled = false,
     className = "",
     searchPlaceholder = "Rechercher...",
}: Props) {
     const [open, setOpen] = useState(false);
     const [query, setQuery] = useState("");

     const filtered = useMemo(() => {
          if (!query) return options;
          const q = query.toLowerCase();
          return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
     }, [options, query]);

     const toggle = (val: string) => {
          const exists = value.includes(val);
          const next = exists ? value.filter((v) => v !== val) : [...value, val];
          onValueChange(next);
     };

     return (
          <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger asChild>
                    <Button
                         variant="outline"
                         size="sm"
                         disabled={disabled}
                         className={`flex items-center gap-2 justify-start ${className}`}
                    >
                         <div className="flex-1 text-left">
                              {value && value.length > 0 ? (
                                   <div className="flex flex-wrap gap-1">
                                        {value.map((v) => {
                                             const opt = options.find((o) => o.value === v);
                                             return (
                                                  <Badge key={v} variant="secondary" className="text-xs">
                                                       {opt?.label ?? v}
                                                  </Badge>
                                             );
                                        })}
                                   </div>
                              ) : (
                                   <span className="text-muted-foreground">{placeholder}</span>
                              )}
                         </div>
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-70">
                              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                    </Button>
               </PopoverTrigger>

               <PopoverContent className="w-72 p-2">
                    <div className="pb-2">
                         <Input
                              placeholder={searchPlaceholder}
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              className="w-full"
                         />
                    </div>

                    <div className="max-h-48 overflow-auto space-y-1">
                         {filtered.length === 0 ? (
                              <div className="text-sm text-muted-foreground px-2 py-1">Aucun résultat</div>
                         ) : (
                              filtered.map((opt) => {
                                   const checked = value.includes(opt.value);
                                   return (
                                        <button
                                             key={opt.value}
                                             type="button"
                                             onClick={() => toggle(opt.value)}
                                             className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-muted"
                                        >
                                             <Checkbox checked={checked} onCheckedChange={() => toggle(opt.value)} asChild />
                                             <div className="flex-1 text-sm">{opt.label}</div>
                                        </button>
                                   );
                              })
                         )}
                    </div>
               </PopoverContent>
          </Popover>
     );
}
