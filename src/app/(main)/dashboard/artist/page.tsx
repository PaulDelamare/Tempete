"use client";

import React, { useEffect, useMemo, useState } from "react";
import ArtistForm from "./_components/ArtistForm";
import ArtistModal from "./_components/ArtistModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardAction,
} from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import {
    buildColumnsFromConfig,
    ColumnConfig,
} from "../_components/table/columns";
import { EllipsisVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Tag } from "@/generated/prisma";

type Artist = {
    id: string;
    name: string;
    nickname?: string | null;
    bio?: string | null;
    imgurl?: string | null;
    links?: Record<string, string>[];
    created_at: string;
    modified_at: string;
    tagsJoin: Tag[];
};

export default function ArtistPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

    const [reload, setReload] = useState(0);

    const fetchArtists = async () => {
        const res = await fetch("http://localhost:3000/api/artist", {
            cache: "no-store",
        });
        const data = await res.json();
        setArtists(data);
    };

    useEffect(() => {
        fetchArtists();
    }, [reload]);

    const handleAdd = () => {
        setSelectedArtist({
            id: "",
            name: "",
            nickname: null,
            bio: null,
            imgurl: null,
            links: [],
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString(),
            tagsJoin: [],
        });
        setModalOpen(true);
    };

    const handleDelete = async (artistId: string) => {
        await fetch(`http://localhost:3000/api/artist/${artistId}`, {
            method: "DELETE",
        });
        setReload((prev) => prev + 1);
    };

    const [filter, setFilter] = useState("");
    const filteredData = useMemo(() => {
        return artists.filter((row) => {
            const value = filter.toLowerCase();
            const matchesText =
                row.id.toString().toLowerCase().includes(value) ||
                row.nickname?.toString().toLowerCase().includes(value) ||
                row.name?.toLowerCase().includes(value);

            return matchesText;
        });
    }, [artists, filter]);

    const artistConfigs: ColumnConfig<Artist>[] = [
        { key: "name", title: "Nom", sortable: true },
        {
            key: "nickname",
            title: "Surnom",
            format: (val: unknown) =>
                val ? (
                    <Badge variant="secondary">{String(val as string)}</Badge>
                ) : null,
        },
        {
            key: "bio",
            title: "Bio",
            format: (val: unknown) => {
                const text = String(val ?? "");
                return text.length > 50 ? text.slice(0, 50) + "..." : text;
            },
        },
        {
            key: "tagsJoin",
            title: "Tags",
            format: (val: unknown) => {
                const tags = val as Tag[];
                if (!tags || tags.length === 0) return <span>-</span>;
                return (
                    <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                            <Badge key={tag.id} variant="outline">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            key: "created_at",
            title: "Créé le",
            format: (val: unknown) =>
                new Date(val as string).toLocaleDateString(),
        },
        {
            key: "modified_at",
            title: "Modifié le",
            format: (val: unknown) =>
                new Date(val as string).toLocaleDateString(),
        },
        {
            id: "actions",
            title: "Actions",
            render: (artist) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Gérer</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedArtist(artist);
                                    setModalOpen(true);
                                }}
                            >
                                Modifier
                            </DropdownMenuItem>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-500/20 rounded hover:text-red-700 transition-colors">
                                        Supprimer
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Supprimer cet artiste ?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action est irréversible.
                                            L’artiste{" "}
                                            <strong>{artist.name}</strong> sera
                                            définitivement supprimé.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Annuler
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() =>
                                                handleDelete(artist.id)
                                            }
                                        >
                                            Supprimer
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            sortable: false,
        },
    ];

    const artistColumns = buildColumnsFromConfig<Artist>(artistConfigs);

    const table = useDataTableInstance({
        data: filteredData,
        columns: artistColumns,
        getRowId: (row) => String(row.id),
    });

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Artistes</h1>
                <Button onClick={handleAdd}>Ajouter un artiste</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle>Liste des artistes</CardTitle>
                            <CardDescription>
                                Retrouvez ici tous les artistes enregistrés.
                            </CardDescription>
                        </div>
                        <CardAction>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Rechercher..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                                <DataTableViewOptions table={table} />
                            </div>
                        </CardAction>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="overflow-hidden rounded-md border">
                        <DataTable table={table} columns={artistColumns} />
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>

            <ArtistModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setReload((prev) => prev + 1);
                }}
            >
                {selectedArtist && (
                    <ArtistForm
                        artist={{
                            ...selectedArtist,
                            nickname: selectedArtist.nickname ?? null,
                            bio: selectedArtist.bio ?? null,
                            imgurl: selectedArtist.imgurl ?? null,
                            links: selectedArtist.links ?? [],
                            created_at: new Date(selectedArtist.created_at),
                            modified_at: new Date(selectedArtist.modified_at),
                            tagsJoin: selectedArtist.tagsJoin
                                ? selectedArtist.tagsJoin.map((tag) => ({
                                      tag: {
                                          ...tag,
                                          created_at: new Date(tag.created_at),
                                          modified_at: new Date(
                                              tag.modified_at
                                          ),
                                          description: tag.description ?? null,
                                      },
                                  }))
                                : [],
                        }}
                    />
                )}
            </ArtistModal>
        </div>
    );
}
