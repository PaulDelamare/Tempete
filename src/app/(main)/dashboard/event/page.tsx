"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardAction,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import {
    buildColumnsFromConfig,
    ColumnConfig,
} from "../_components/table/columns";

import EventForm from "./_components/EventForm";
import { Event } from "@/generated/prisma";
import { EventWithRelations, useEvent } from "./_components/useEvent";
import EventModal from "./_components/EventModal";

export default function EventPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [events, setEvents] = useState<EventWithRelations[]>([]);
    const [selectedEvent, setSelectedEvent] =
        useState<EventWithRelations | null>(null);
    const [reload, setReload] = useState(0);
    const [filter, setFilter] = useState("");

    // Hook pour fetch / gérer les events
    const { fetchEvents, deleteEvent } = useEvent();

    useEffect(() => {
        fetchEvents().then((data) => {
            setEvents(data);
        });
    }, [reload]);

    const filteredData = useMemo(() => {
        return events.filter((e) => {
            const value = filter.toLowerCase();
            return (
                e.name.toLowerCase().includes(value) ||
                e.description?.toLowerCase().includes(value)
            );
        });
    }, [events, filter]);

    const handleAdd = () => {
        setSelectedEvent({
            id: "",
            name: "",
            description: null,
            imgurl: null,
            datestart: "",
            dateend: "",
            capacity: null,
            status: "draft",
            areaId: null,
            created_at: new Date(),
            modified_at: new Date(),
            tagsJoin: [],
            artists: [],
        });
        setModalOpen(true);
    };

    const handleDelete = async (eventId: string) => {
        await deleteEvent(eventId);
        setReload((prev) => prev + 1);
    };

    const eventConfigs: ColumnConfig<EventWithRelations>[] = [
        { key: "name", title: "Nom", sortable: true },
        {
            key: "datestart",
            title: "Début",
            format: (val) => new Date(val as string).toLocaleString(),
        },
        {
            key: "dateend",
            title: "Fin",
            format: (val) => new Date(val as string).toLocaleString(),
        },
        {
            key: "areaId",
            title: "Zone",
            format: (_, row) => row.area?.name ?? "-",
        },
        {
            key: "artists",
            title: "Artiste",
            format: (_, row) => row.artists[0]?.artist.name ?? "-",
        },
        {
            key: "tagsJoin",
            title: "Tags",
            format: (_, row) =>
                row.tagsJoin?.map((t) => t.tag.name).join(", ") ?? "",
        },
        {
            id: "actions",
            title: "Actions",
            render: (event) => (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Gérer</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedEvent(event);
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
                                        Supprimer cet événement ?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Cette action est irréversible.
                                        L’événement{" "}
                                        <strong>{event.name}</strong> sera
                                        supprimé définitivement.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleDelete(event.id)}
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

    const eventColumns =
        buildColumnsFromConfig<EventWithRelations>(eventConfigs);

    const table = useDataTableInstance({
        data: filteredData,
        columns: eventColumns,
        getRowId: (row) => row.id,
    });

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Événements</h1>
                <Button onClick={handleAdd}>Ajouter un événement</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle>Liste des événements</CardTitle>
                            <CardDescription>
                                Retrouvez ici tous les événements enregistrés.
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
                        <DataTable table={table} columns={eventColumns} />
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>

            <EventModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setReload((prev) => prev + 1);
                }}
            >
                {selectedEvent && (
                    <EventForm
                        event={{
                            ...selectedEvent,
                            tagsJoin:
                                selectedEvent.tagsJoin?.map((t) => ({
                                    tag: t.tag,
                                })) ?? [],
                            artists:
                                selectedEvent.artists?.map((a) => a.artist) ??
                                [],
                            area: selectedEvent.area ?? undefined,
                        }}
                    />
                )}
            </EventModal>
        </div>
    );
}
