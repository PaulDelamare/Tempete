import { ColumnDef } from "@tanstack/react-table";

function getValue(obj: { [key: string]: unknown }, path: string) {
    if (!path) return undefined;
    return path
        .split(".")
        .reduce(
            (acc: unknown, k) =>
                acc == null
                    ? undefined
                    : (acc as { [key: string]: unknown })[k],
            obj
        );
}

export type ColumnConfig<T> = {
    id?: string;
    key?: string;
    title: string;
    sortable?: boolean;
    hideable?: boolean;
    width?: string;
    className?: string;
    render?: (row: T) => React.ReactNode;
    format?: (val: unknown, row: T) => React.ReactNode;
};

export function buildColumnsFromConfig<T extends Record<string, unknown>>(
    configs: ColumnConfig<T>[]
): ColumnDef<T, unknown>[] {
    return configs.map((c) => {
        if (c.render) {
            return {
                id: c.id ?? c.key ?? c.title,
                header: () => c.title,
                cell: ({ row }) => c.render!(row.original),
                enableSorting: !!c.sortable,
                enableHiding: c.hideable ?? true,
            } as ColumnDef<T, unknown>;
        }

        if (c.key && c.key.includes(".")) {
            return {
                id: c.id ?? c.key,
                header: () => c.title,
                accessorFn: (row: T) => getValue(row, c.key!),
                cell: ({ getValue, row }) =>
                    c.format
                        ? c.format(getValue(), row.original)
                        : String(getValue() ?? ""),
                enableSorting: !!c.sortable,
                enableHiding: c.hideable ?? true,
            } as ColumnDef<T, unknown>;
        }

        return {
            id: c.id ?? c.key,
            accessorKey: c.key,
            header: () => c.title,
            cell: ({ getValue, row }) =>
                c.format
                    ? c.format(getValue(), row.original)
                    : String(getValue() ?? ""),
            enableSorting: !!c.sortable,
            enableHiding: c.hideable ?? true,
        } as ColumnDef<T, unknown>;
    });
}
