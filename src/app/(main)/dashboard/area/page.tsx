"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    buildColumnsFromConfig,
    ColumnConfig,
} from "@/app/(main)/dashboard/_components/table/columns";
import { Badge } from "@/components/ui/badge";
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
import AreaForm from "@/app/(main)/dashboard/area/_components/AreaForm";
import AreaModal from "@/app/(main)/dashboard/area/_components/AreaModal";
import { Area, AreaType, Prisma } from "@/generated/prisma";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function AreaPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [areas, setAreas] = useState<Area[]>([]);
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);

    const [reload, setReload] = useState(0);

    const fetchAreas = async () => {
        const res = await fetch("http://localhost:3000/api/areas", {
            cache: "no-store",
        });
        const data = await res.json();
        setAreas(data);
    };

    useEffect(() => {
        fetchAreas();
    }, [reload]);

    const handleAdd = () => {
        setSelectedArea({
            id: "",
            name: "",
            description: "",
            imgurl: null,
            type: AreaType.stage,
            latitude: "",
            longitude: "",
            capacity: null,
            created_at: new Date(),
            modified_at: new Date(),
        });
        setModalOpen(true);
    };

    const handleDelete = async (areaId: string) => {
        await fetch(`http://localhost:3000/api/areas/${areaId}`, {
            method: "DELETE",
        });
        setReload((prev) => prev + 1);
    };

    const [filter, setFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("");
    const uniqueTypes = useMemo(() => {
        return Array.from(new Set(areas.map((row) => row.type))).filter(
            (type): type is AreaType => typeof type === "string"
        );
    }, [areas]);
    const filteredData = useMemo(() => {
        return areas.filter((row) => {
            const value = filter.toLowerCase();
            const matchesText =
                row.id.toString().toLowerCase().includes(value) ||
                row.name?.toLowerCase().includes(value);

            const matchesType =
                typeFilter && typeFilter !== "all"
                    ? row.type === typeFilter
                    : true;

            return matchesText && matchesType;
        });
    }, [areas, filter, typeFilter]);

    const areaConfigs: ColumnConfig<Area>[] = [
        { key: "name", title: "Nom", sortable: true },
        {
            key: "type",
            title: "Type",
            format: (val: unknown) =>
                val ? (
                    <Badge variant="secondary">{String(val as string)}</Badge>
                ) : null,
        },
        {
            key: "description",
            title: "Description",
            format: (val: unknown) => {
                const text = String(val ?? "");
                return text.length > 50 ? text.slice(0, 50) + "..." : text;
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
                                    setSelectedArea(area);
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
                                            Supprimer cette zone ?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action est irréversible. La
                                            zone <strong>{area.name}</strong>{" "}
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

    const areaColumns = buildColumnsFromConfig<Area>(areaConfigs);

    const table = useDataTableInstance({
        data: filteredData,
        columns: areaColumns,
        getRowId: (row) => String(row.id),
    });

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Zones</h1>
                <Button onClick={handleAdd}>Ajouter une zone</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle>Liste des zones</CardTitle>
                            <CardDescription>
                                Retrouvez ici tous les zones enregistrése.
                            </CardDescription>
                        </div>
                        <CardAction>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={typeFilter}
                                    onValueChange={setTypeFilter}
                                >
                                    <SelectTrigger className="sm:w-48">
                                        <SelectValue placeholder="Filtrer par type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tous
                                        </SelectItem>

                                        {uniqueTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                        <DataTable table={table} columns={areaColumns} />
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>

            <AreaModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setReload((prev) => prev + 1);
                }}
            >
                {selectedArea && (
                    <AreaForm
                        area={{
                            ...selectedArea,
                            type: selectedArea.type ?? AreaType.stage,
                            description: selectedArea.description ?? null,
                            imgurl: selectedArea.imgurl ?? null,
                            created_at: new Date(selectedArea.created_at),
                            modified_at: new Date(selectedArea.modified_at),
                            capacity: selectedArea.capacity ?? 0,
                            latitude: selectedArea.latitude ?? "0",
                            longitude: selectedArea.longitude ?? "0",
                        }}
                    />
                )}
            </AreaModal>
        </div>
    );
}
