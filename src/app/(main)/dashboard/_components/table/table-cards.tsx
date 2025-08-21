"use client";

import React from "react";
import { EllipsisVertical } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { buildColumnsFromConfig, ColumnConfig } from "./columns";
import { recentLeadSchema } from "./schema";
import z from "zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useMemo, useState} from "react";
import {Input} from "@/components/ui/input";


type Lead = z.infer<typeof recentLeadSchema>;

const configs: ColumnConfig<Lead>[] = [
    {
        id: "select",
        title: "",
        render: () => null,
        sortable: false,
        hideable: false,
    },
    { key: "id", title: "Identifiant", sortable: false, hideable: false },
    { key: "name", title: "Nom", sortable: true },
    { key: "capacity", title: "Capacité", sortable: false },
    {
        key: "type",
        title: "Type",
        format: (val: unknown, row: Lead) => (
            <Badge variant="secondary">{String(val)}</Badge>
        ),
        sortable: false,
    },
    {
        key: "created_at",
        title: "Date de création",
        format: (val: unknown, row: Lead) => (
            <span>
                {new Date(val as string | number | Date).toLocaleString()}
            </span>
        ),
        sortable: false,
    },
    {
        key: "modified_at",
        title: "Date de modification",
        format: (val: unknown, row: Lead) => (
            <span>
                {new Date(val as string | number | Date).toLocaleString()}
            </span>
        ),
        sortable: false,
    },
    {
        id: "actions",
        title: "Actions",
        render: () => (
            <button className="btn ghost icon" aria-label="Actions">
                <EllipsisVertical />
            </button>
        ),
        sortable: false,
    },
];

const columns = buildColumnsFromConfig<Lead>(configs);

type TableCardsProps = {
    data: Lead[];
    title?: string;
    description?: string;
    actions?: React.ReactNode;
};

export function TableCards({
    data,
    title,
    description,
    actions,
}: TableCardsProps) {


    const [filter, setFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("");
    const uniqueTypes = useMemo(() => {
        return Array.from(new Set(data.map((row) => row.type))).filter(Boolean);
    }, [data]);
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const value = filter.toLowerCase();
            const matchesText =
                row.id.toString().toLowerCase().includes(value) ||
                row.name?.toLowerCase().includes(value);

            const matchesType = typeFilter && typeFilter !== "all" ? row.type === typeFilter : true;

            return matchesText && matchesType;
        });
    }, [data, filter, typeFilter]);

    const table = useDataTableInstance({
        data: filteredData,
        columns: columns,
        getRowId: (row) => row.id.toString(),
    });
    return (
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle>{title}</CardTitle>
                            {description && (
                                <CardDescription>{description}</CardDescription>
                            )}
                        </div>

                        <CardAction>
                            <div className="flex items-center gap-2">
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="sm:w-48">
                                        <SelectValue placeholder="Filtrer par type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
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
                                {actions}
                            </div>
                        </CardAction>
                    </div>
                </CardHeader>

                <CardContent className="flex size-full flex-col gap-4">
                    <div className="overflow-hidden rounded-md border">
                        <DataTable table={table} columns={columns} />
                    </div>

                    <DataTablePagination table={table} />
                </CardContent>
            </Card>
        </div>
    );
}
