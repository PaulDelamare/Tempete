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
import { Artist, Tag } from "@/generated/prisma";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ArtistPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [artists, setArtists] = useState<(Artist & {
        tagsJoin: {
            tag: Tag
        }
    })[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<(Artist & { tagsJoin: { tag: Tag } }) | null>(null);

    const [reload, setReload] = useState(0);

    const fetchArtists = async () => {

        const res = await fetch("http://localhost:3000/api/artist", {
            cache: "no-store",
        });

        const data = (await res.json()) as (Artist & {
            tagsJoin: {
                tag: Tag
            }
        })[];

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
            created_at: new Date(),
            modified_at: new Date(),
            tagsJoin: { tag: {} as Tag },
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

    const artistConfigs: ColumnConfig<(Artist & { tagsJoin: { tag: Tag } })>[] = [
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
                const tagsJoin = val as { tag: Tag }[];
                if (!tagsJoin || tagsJoin.length === 0) return <span>-</span>;

                const visibleTags = tagsJoin.slice(0, 3); // max 3 visibles
                const hiddenCount = tagsJoin.length - visibleTags.length;

                return (
                    <div className="flex flex-wrap gap-1">
                        {visibleTags.map((tj) => (
                            <Badge key={tj.tag.id} variant="outline">
                                {tj.tag.name}
                            </Badge>
                        ))}

                        {hiddenCount > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="secondary" className="cursor-pointer">
                                            +{hiddenCount}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <div className="flex flex-wrap gap-1">
                                            {tagsJoin.slice(3).map((tj) => (
                                                <Badge key={tj.tag.id} variant="outline">
                                                    {tj.tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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

    const artistColumns = buildColumnsFromConfig<(Artist & { tagsJoin: { tag: Tag } })>(artistConfigs);

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
                            tagsJoin: Array.isArray(selectedArtist.tagsJoin) ? selectedArtist.tagsJoin : [],
                        }}
                    />
                )}
            </ArtistModal>
        </div>
    );
}
