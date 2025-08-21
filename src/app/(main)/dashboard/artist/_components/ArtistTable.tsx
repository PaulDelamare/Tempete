import { useState } from "react";
import { Button } from "@/components/ui/button";

type Artist = {
  id: string;
  name: string;
  nickname?: string;
  bio?: string;
  imgurl?: string;
};

const MOCK_ARTISTS: Artist[] = [
  {
    id: "1",
    name: "Jean Dupont",
    nickname: "JD",
    bio: "Artiste contemporain.",
    imgurl: "https://placehold.co/48x48",
  },
  {
    id: "2",
    name: "Marie Curie",
    nickname: "MC",
    bio: "Peintre abstraite.",
    imgurl: "https://placehold.co/48x48",
  },
];

export default function ArtistTable({
  artists = MOCK_ARTISTS,
  onEdit,
  onDelete,
}: {
  artists?: Artist[];
  onEdit?: (artist: Artist) => void;
  onDelete?: (artist: Artist) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded border bg-white dark:bg-neutral-900">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-neutral-100 dark:bg-neutral-800">
            <th className="px-4 py-2 text-left">Image</th>
            <th className="px-4 py-2 text-left">Nom</th>
            <th className="px-4 py-2 text-left">Surnom</th>
            <th className="px-4 py-2 text-left">Bio</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id} className="border-b">
              <td className="px-4 py-2">
                {artist.imgurl ? (
                  <img src={artist.imgurl} alt={artist.name} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-neutral-200 rounded" />
                )}
              </td>
              <td className="px-4 py-2 font-semibold">{artist.name}</td>
              <td className="px-4 py-2">{artist.nickname}</td>
              <td className="px-4 py-2 max-w-xs truncate">{artist.bio}</td>
              <td className="px-4 py-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit && onEdit(artist)}>
                  Modifier
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete && onDelete(artist)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
