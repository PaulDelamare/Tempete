"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    buildColumnsFromConfig,
    ColumnConfig,
} from "@/app/(main)/dashboard/_components/table/columns";
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
import { Input } from "@/components/ui/input";

import { User } from "@/generated/prisma";
import UserModal from "./_components/SignUpModal";
import SignUp from "@/components/auth/sign-up";

export default function UserPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [reload, setReload] = useState(0);

    const fetchUsers = async () => {
        const res = await fetch("/api/users", { cache: "no-store" });
        const data = await res.json();
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, [reload]);

    const [filter, setFilter] = useState("");
    const filteredData = useMemo(() => {
        return users.filter((user) => {
            const value = filter.toLowerCase();
            return (
                user.email.toLowerCase().includes(value) ||
                user.name?.toLowerCase().includes(value)
            );
        });
    }, [users, filter]);

    const userConfigs: ColumnConfig<User>[] = [
        { key: "name", title: "Nom", sortable: true },
        { key: "email", title: "Email", sortable: true },
        {
            key: "created_at",
            title: "Créé le",
            format: (val: unknown) =>
                new Date(val as string).toLocaleDateString(),
            sortable: true,
        },
    ];

    const userColumns = buildColumnsFromConfig<User>(userConfigs);

    const table = useDataTableInstance({
        data: filteredData,
        columns: userColumns,
        getRowId: (row) => String(row.id),
    });

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Utilisateurs</h1>
                <Button onClick={() => setModalOpen(true)}>
                    Ajouter un utilisateur
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle>Liste des utilisateurs</CardTitle>
                            <CardDescription>
                                Retrouvez ici tous les utilisateurs enregistrés.
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
                        <DataTable table={table} columns={userColumns} />
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>

            <UserModal open={modalOpen} onClose={() => setModalOpen(false)}>
                <SignUp />
            </UserModal>
        </div>
    );
}
