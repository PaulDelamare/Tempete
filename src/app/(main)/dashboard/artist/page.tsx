"use client";

import { useState } from "react";
import ArtistTable from "./_components/ArtistTable";
import ArtistFilter from "./_components/ArtistFilter";
import ArtistForm from "./_components/ArtistForm";
import ArtistModal from "./_components/ArtistModal";
import { Button } from "@/components/ui/button";

type Artist = {
    id: string;
    name: string;
    nickname?: string;
    bio?: string;
    imgurl?: string;
    links?: Record<string, string>;
};

const MOCK_ARTISTS: Artist[] = [
    {
        id: "1",
        name: "Jean Dupont",
        nickname: "JD",
        bio: "Artiste contemporain.",
        imgurl: "https://placehold.co/48x48",
        links: { instagram: "https://instagram.com/jd" },
    },
    {
        id: "2",
        name: "Marie Curie",
        nickname: "MC",
        bio: "Peintre abstraite.",
        imgurl: "https://placehold.co/48x48",
        links: { site: "https://mariecurie.com" },
    },
];

export default function ArtistPage() {
    const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
    const [filter, setFilter] = useState<{ name?: string; nickname?: string }>(
        {}
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [editArtist, setEditArtist] = useState<Artist | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Filtrage simple côté client
    const filteredArtists = artists.filter((a) => {
        const nameMatch = filter.name
            ? a.name.toLowerCase().includes(filter.name.toLowerCase())
            : true;
        const nickMatch = filter.nickname
            ? (a.nickname || "")
                  .toLowerCase()
                  .includes(filter.nickname.toLowerCase())
            : true;
        return nameMatch && nickMatch;
    });

    const handleAdd = () => {
        setEditArtist(null);
        setModalOpen(true);
    };

    const handleEdit = (artist: Artist) => {
        setEditArtist(artist);
        setModalOpen(true);
    };

    const handleDelete = (artist: Artist) => {
        setDeleteId(artist.id);
    };

    const handleSubmit = (data: Artist) => {
        if (editArtist) {
            // Edition
            setArtists((prev) =>
                prev.map((a) =>
                    a.id === editArtist.id ? { ...a, ...data } : a
                )
            );
        } else {
            // Création
            setArtists((prev) => [
                ...prev,
                { ...data, id: Math.random().toString(36).slice(2) },
            ]);
        }
        setModalOpen(false);
        setEditArtist(null);
    };

    const confirmDelete = () => {
        setArtists((prev) => prev.filter((a) => a.id !== deleteId));
        setDeleteId(null);
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Artistes</h1>
                <Button onClick={handleAdd}>Ajouter un artiste</Button>
            </div>
            {/* Modal création uniquement */}
            <ArtistModal open={modalOpen} onClose={() => setModalOpen(false)}>
                <ArtistForm
                    artist={{
                        id: "",
                        name: "",
                        nickname: null,
                        bio: null,
                        imgurl: null,
                        links: {},
                        created_at: new Date(),
                        modified_at: new Date(),
                        tagsJoin: [],
                    }}
                />
            </ArtistModal>
        </div>
    );
}
