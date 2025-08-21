import { FormLabel } from "@/components/ui/form";
import { Tag } from "@/generated/prisma";
import { CreateArtistSchema } from "@/helpers/zod/artist/create-artist-schema";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

export default function TagsField({ tags, selectedTags, setSelectedTags, disabled, form }: { tags: Tag[]; selectedTags: string[]; setSelectedTags: (tags: string[]) => void; disabled: boolean; form: UseFormReturn<z.infer<typeof CreateArtistSchema>> }) {
     return (
          <div>
               <FormLabel>Tags</FormLabel>
               <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                         <label key={tag.id} className="flex items-center gap-1 border rounded px-2 py-1 cursor-pointer">
                              <input type="checkbox" checked={selectedTags.includes(tag.id)} onChange={() => {
                                   const newTags = selectedTags.includes(tag.id) ? selectedTags.filter(id => id !== tag.id) : [...selectedTags, tag.id];
                                   setSelectedTags(newTags);
                                   form.setValue("tagIds", newTags, { shouldValidate: true, shouldDirty: true });
                              }} disabled={disabled} />
                              <span>{tag.name}</span>
                         </label>
                    ))}
               </div>
               {form.formState.errors.tagIds && <p className="text-red-500 text-sm mt-1">{(form.formState.errors.tagIds)?.message}</p>}
          </div>
     );
}
