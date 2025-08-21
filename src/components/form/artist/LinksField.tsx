import { Input } from "@/components/ui/input";
import React from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface Link {
     name: string;
     url: string;
}

interface LinksFieldProps {
     links: Link[];
     updateLinkAt: (idx: number, partial: Partial<Link>) => void;
     removeLink: (idx: number) => void;
     addLink: () => void;
     errors?: Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<{ name: string; url: string; }>> | undefined)[]> | undefined;
     disabled?: boolean;
}

export default function LinksField({ links, updateLinkAt, removeLink, addLink, errors, disabled }: LinksFieldProps) {

     return (
          <div className="space-y-2">
               {links.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                         <div className="w-1/3">
                              <Input type="text" placeholder="Nom du lien" value={link.name} onChange={e => updateLinkAt(idx, { name: e.target.value })} disabled={disabled} />
                              {errors?.[idx]?.name && <p className="text-red-500 text-sm mt-1">{errors[idx].name.message}</p>}
                         </div>
                         <div className="w-2/3">
                              <Input type="url" placeholder="URL du lien" value={link.url} onChange={e => updateLinkAt(idx, { url: e.target.value })} disabled={disabled} />
                              {errors?.[idx]?.url && <p className="text-red-500 text-sm mt-1">{errors[idx].url.message}</p>}
                         </div>
                         <button type="button" className="text-red-500 ml-2" onClick={() => removeLink(idx)} disabled={disabled}>✕</button>
                    </div>
               ))}
               <button type="button" className="text-blue-500 mt-2" onClick={addLink} disabled={disabled}>+ Ajouter un lien</button>
          </div>
     );
}
