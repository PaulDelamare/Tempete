import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Filters = {
  name?: string;
  nickname?: string;
  tagIds?: string[];
};

export default function ArtistFilter({ onFilter }: { onFilter: (filters: Filters) => void }) {
  const [filters, setFilters] = useState<Filters>({ name: "", nickname: "", tagIds: [] });
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const data = await res.json();
          setTags(data);
        }
      } catch {}
    }
    fetchTags();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tagId: string) => {
    setFilters((prev) => ({
      ...prev,
      tagIds: prev.tagIds?.includes(tagId)
        ? prev.tagIds?.filter((id) => id !== tagId)
        : [...(prev.tagIds || []), tagId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-4 items-end flex-wrap">
      <div>
        <label htmlFor="name" className="block text-xs font-medium mb-1">Nom</label>
        <Input
          id="name"
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Rechercher par nom"
        />
      </div>
      <div>
        <label htmlFor="nickname" className="block text-xs font-medium mb-1">Surnom</label>
        <Input
          id="nickname"
          name="nickname"
          value={filters.nickname}
          onChange={handleChange}
          placeholder="Rechercher par surnom"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1 border rounded px-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tagIds?.includes(tag.id) || false}
                onChange={() => handleTagChange(tag.id)}
              />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      </div>
      <Button type="submit">Filtrer</Button>
    </form>
  );
}

  const [filters, setFilters] = useState<Filters>({ name: "", nickname: "", tagIds: [] });
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const data = await res.json();
          setTags(data);
        }
      } catch {}
    }
    fetchTags();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tagId: string) => {
    setFilters((prev) => ({
      ...prev,
      tagIds: prev.tagIds?.includes(tagId)
        ? prev.tagIds?.filter((id) => id !== tagId)
        : [...(prev.tagIds || []), tagId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-4 items-end flex-wrap">
      <div>
        <label htmlFor="name" className="block text-xs font-medium mb-1">Nom</label>
        <Input
          id="name"
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Rechercher par nom"
        />
      </div>
      <div>
        <label htmlFor="nickname" className="block text-xs font-medium mb-1">Surnom</label>
        <Input
          id="nickname"
          name="nickname"
          value={filters.nickname}
          onChange={handleChange}
          placeholder="Rechercher par surnom"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1 border rounded px-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tagIds?.includes(tag.id) || false}
                onChange={() => handleTagChange(tag.id)}
              />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      </div>
      <Button type="submit">Filtrer</Button>
    </form>
  );
}
