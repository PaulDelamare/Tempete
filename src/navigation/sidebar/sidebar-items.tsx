import {

    Calendar,
    ReceiptText,
    Users,
    LayoutDashboard,
    type LucideIcon,
    LandPlot,
    User,
    CircleDollarSign,
} from "lucide-react";

export interface NavSubItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    comingSoon?: boolean;
    newTab?: boolean;
    isNew?: boolean;
}

export interface NavMainItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    subItems?: NavSubItem[];
    comingSoon?: boolean;
    newTab?: boolean;
    isNew?: boolean;
}

export interface NavGroup {
    id: number;
    label?: string;
    items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
    {
        id: 1,
        label: "Tableaux de bord",
        items: [
            {
                title: "Accueil",
                url: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Utilisateurs",
                url: "/dashboard/user",
                icon: User,
            },
            {
                title: "Artistes",
                url: "/dashboard/artist",
                icon: Users,
            },
            {
                title: "Zones",
                url: "/dashboard/area",
                icon: LandPlot,
            },
            {
                title: "Tags",
                url: "/dashboard/tag",
                icon: ReceiptText,
            },
            {
                title: "Événements",
                url: "/dashboard/event",
                icon: Calendar,
            },
            {
                title: "Sponsors",
                url: "/dashboard/sponsor",
                icon: CircleDollarSign,
                comingSoon: false,
            },
        ],
    },
];
