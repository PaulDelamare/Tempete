"use client";

import React from "react";
import { Download, EllipsisVertical } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
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
    const table = useDataTableInstance({
        data,
        columns,
        getRowId: (row) => String(row.id),
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
                                <DataTableViewOptions table={table} />
                                <Button variant="outline" size="sm">
                                    <Download />
                                    <span className="hidden lg:inline">
                                        Export
                                    </span>
                                </Button>
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
