"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    buildColumnsFromConfig,
    ColumnConfig,
} from "@/app/(main)/dashboard/_components/table/columns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
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
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Sponsor, Prisma } from "@/generated/prisma";
import { Input } from "@/components/ui/input";
import SponsorModal from "@/app/(main)/dashboard/sponsor/_components/SponsorModal";
import SponsorForm from "@/app/(main)/dashboard/sponsor/_components/SponsorForm";

export default function SponsorPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

    const [reload, setReload] = useState(0);

    const fetchSponsors = async () => {
        const res = await fetch("http://localhost:3000/api/sponsors", {
            cache: "no-store",
        });
        const data = await res.json();
        setSponsors(data);
    };

    useEffect(() => {
        fetchSponsors();
    }, [reload]);

    const handleAdd = () => {
        setSelectedSponsor({
            id: "",
            name: "",
            imgurl: "",
            website_url: "",
        });
        setModalOpen(true);
    };

    const handleDelete = async (areaId: string) => {
        await fetch(`http://localhost:3000/api/sponsors/${areaId}`, {
            method: "DELETE",
        });
        setReload((prev) => prev + 1);
    };

    const [filter, setFilter] = useState("");
    const filteredData = useMemo(() => {
        return sponsors.filter((row) => {
            const value = filter.toLowerCase();
            const matchesText =
                row.id.toString().toLowerCase().includes(value) ||
                row.name?.toLowerCase().includes(value);

            return matchesText;
        });
    }, [sponsors, filter]);

    const sponsorsConfigs: ColumnConfig<Sponsor>[] = [
        { key: "name", title: "Nom", sortable: true },
        {
            key: "website_url",
            title: "Site web",
            format: (val: unknown) => {
                const url = String(val ?? "");
                if (!url) return null;

                const displayText = url.length > 50 ? url.slice(0, 50) + "..." : url;

                return (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {displayText}
                    </a>
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
            render: (area) => {
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
                                    setSelectedSponsor(area);
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
                                            Supprimer ce sponsor ?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action est irréversible. Le
                                            sponsor <strong>{area.name}</strong>{" "}
                                            sera définitivement supprimée.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Annuler
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() =>
                                                handleDelete(area.id)
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

    const sponsorsColumns = buildColumnsFromConfig<Sponsor>(sponsorsConfigs);

    const table = useDataTableInstance({
        data: filteredData,
        columns: sponsorsColumns,
        getRowId: (row) => String(row.id),
    });

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Sponsors</h1>
                <Button onClick={handleAdd}>Ajouter un sponsor</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle>Liste des sponsors</CardTitle>
                            <CardDescription>
                                Retrouvez ici tous les sponsors enregistrés.
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
                        <DataTable table={table} columns={sponsorsColumns} />
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>

            <SponsorModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setReload((prev) => prev + 1);
                }}
            >
                {selectedSponsor && (
                    <SponsorForm
                        sponsor={{
                            ...selectedSponsor,
                            imgurl: selectedSponsor.imgurl ?? null,
                            created_at: new Date(selectedSponsor.created_at),
                            modified_at: new Date(selectedSponsor.modified_at),
                        }}
                    />
                )}
            </SponsorModal>
        </div>
    );
}
