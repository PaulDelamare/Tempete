"use client";

import { useEffect, useState } from "react";
import TagForm from "./_components/TagForm";
import ArtistModal from "@/app/(main)/dashboard/artist/_components/ArtistModal"; // tu peux renommer en TagModal si tu veux
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

type Tag = {
    id: string;
    name: string;
    description?: string | null;
    created_at: string;
    modified_at: string;
};

export default function TagPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [reload, setReload] = useState(0);

    const fetchTags = async () => {
        const res = await fetch("/api/tags", { cache: "no-store" });
        const data = await res.json();
        setTags(data);

    };

    useEffect(() => {
        fetchTags();
    }, [reload]);

    const handleAdd = () => {
        setSelectedTag({
            id: "",
            name: "",
            description: "",
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString(),
        });
        setModalOpen(true);
    };

    const handleDelete = async (tagId: string) => {
        await fetch(`/api/tags/${tagId}`, { method: "DELETE" });
        setReload((prev) => prev + 1);
    };

    const tagConfigs: ColumnConfig<Tag>[] = [
        { key: "name", title: "Nom", sortable: true },
        {
            key: "description",
            title: "Description",
            format: (val: unknown) => (val ? String(val) : "-"),
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
            render: (tag) => (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Gérer</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedTag(tag);
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
                                        Supprimer ce tag ?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Cette action est irréversible. Le tag{" "}
                                        <strong>{tag.name}</strong> sera
                                        définitivement supprimé.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleDelete(tag.id)}
                                    >
                                        Supprimer
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            sortable: false,
        },
    ];

    const tagColumns = buildColumnsFromConfig<Tag>(tagConfigs);

    const table = useDataTableInstance({
        data: tags,
        columns: tagColumns,
        getRowId: (row) => String(row.id),
    });

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Tags</h1>
                <Button onClick={handleAdd}>Ajouter un tag</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle>Liste des tags</CardTitle>
                            <CardDescription>
                                Retrouvez ici tous les tags enregistrés.
                            </CardDescription>
                        </div>
                        <CardAction>
                            <div className="flex items-center gap-2">
                                <DataTableViewOptions table={table} />
                            </div>
                        </CardAction>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="overflow-hidden rounded-md border">
                        <DataTable table={table} columns={tagColumns} />
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
                {selectedTag && (
                    <TagForm
                        tag={{
                            id: selectedTag.id,
                            name: selectedTag.name,
                            description: selectedTag.description ?? "",
                        }}
                        onSave={() => setReload((prev) => prev + 1)}
                    />
                )}
            </ArtistModal>
        </div>
    );
}
