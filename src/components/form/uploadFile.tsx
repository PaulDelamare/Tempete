import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface ImageUploadFieldProps {
     value?: File | undefined;
     setValue: (file?: File) => void;
     disabled?: boolean;
     existingUrl?: string;
}

export default function ImageUploadField({ value, setValue, disabled, existingUrl }: ImageUploadFieldProps) {
     const [preview, setPreview] = useState<string | null>(existingUrl ?? null);

     return (
          <FormField
               name="image"
               render={({ field }) => (
                    <FormItem>
                         <FormLabel>Image</FormLabel>
                         <div className="flex items-end gap-4">
                              {preview && (
                                   <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                        <img src={preview} alt="preview" className="object-cover w-full h-full" />
                                   </div>
                              )}
                              <div className="flex items-center gap-2 w-full">
                                   <Input
                                        type="file"
                                        accept="image/*"
                                        disabled={disabled}
                                        onChange={async e => {
                                             const file = e.target.files?.[0];
                                             setValue(file);
                                             field.onChange(file);
                                             if (file) setPreview(URL.createObjectURL(file));
                                             else setPreview(null);
                                        }}
                                   />
                                   {preview && (
                                        <button
                                             type="button"
                                             className="ml-2 text-red-500"
                                             onClick={() => {
                                                  setValue(undefined);
                                                  field.onChange(undefined);
                                                  setPreview(null);
                                             }}
                                        >
                                             ✕
                                        </button>
                                   )}
                              </div>
                         </div>
                         <FormMessage />
                    </FormItem>
               )}
          />
     );
}
