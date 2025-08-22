"use client";

import React, { useCallback } from "react";
import { FormLabel } from "@/components/ui/form";
import { Tag } from "@/generated/prisma";
import { UseFormReturn } from "react-hook-form";
import { CreateArtistSchema, CreateArtistSchemaType } from "@/helpers/zod/artist/create-artist-schema";

type Props = {
     tags: Tag[];
     form: UseFormReturn<Pick<CreateArtistSchemaType, "tagIds">>;
     disabled?: boolean;
};

export default function TagsField({ tags, form, disabled = false }: Props) {
     const selectedTags = form.watch("tagIds") || [];

     const toggle = useCallback(
          (id: string) => {
               const next = selectedTags.includes(id)
                    ? selectedTags.filter(x => x !== id)
                    : [...selectedTags, id];
               form.setValue("tagIds", next, { shouldValidate: true, shouldDirty: true });
          },
          [selectedTags, form]
     );

     return (
          <div>
               <FormLabel>Tags</FormLabel>
               <div className="flex flex-wrap gap-2 mt-2">
                    {tags.length === 0 ? (
                         <div className="text-sm text-muted-foreground">Aucun tag</div>
                    ) : (
                         tags.map(tag => {
                              const checked = selectedTags.includes(tag.id);
                              return (
                                   <label
                                        key={tag.id}
                                        className="flex items-center gap-2 border rounded px-2 py-1 cursor-pointer select-none"
                                   >
                                        <input
                                             type="checkbox"
                                             checked={checked}
                                             onChange={() => toggle(tag.id)}
                                             disabled={disabled}
                                        />
                                        <span>{tag.name}</span>
                                   </label>
                              );
                         })
                    )}
               </div>
               {form.formState.errors.tagIds && typeof form.formState.errors.tagIds.message === "string" && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.tagIds.message}</p>
               )}
          </div>
     );
}
