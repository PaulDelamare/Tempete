import {
    ShoppingBag,
    Forklift,
    Mail,
    MessageSquare,
    Calendar,
    Kanban,
    ReceiptText,
    Users,
    Lock,
    Fingerprint,
    SquareArrowUpRight,
    LayoutDashboard,
    GraduationCap,
    type LucideIcon,
    LandPlot,
    User,
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
                title: "Défaut",
                url: "/dashboard/default",
                icon: LayoutDashboard,
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
                title: "Académie",
                url: "/dashboard/academy",
                icon: GraduationCap,
                comingSoon: true,
            },
            {
                title: "Logistique",
                url: "/dashboard/logistics",
                icon: Forklift,
                comingSoon: true,
            },
        ],
    },
    {
        id: 2,
        label: "Pages",
        items: [
            {
                title: "Email",
                url: "/mail",
                icon: Mail,
                comingSoon: true,
            },
            {
                title: "Chat",
                url: "/chat",
                icon: MessageSquare,
                comingSoon: true,
            },
            {
                title: "Calendrier",
                url: "/calendar",
                icon: Calendar,
                comingSoon: true,
            },
            {
                title: "Kanban",
                url: "/kanban",
                icon: Kanban,
                comingSoon: true,
            },
            {
                title: "Facture",
                url: "/invoice",
                icon: ReceiptText,
                comingSoon: true,
            },
            {
                title: "Utilisateurs",
                url: "/users",
                icon: Users,
                comingSoon: true,
            },
            {
                title: "Rôles",
                url: "/roles",
                icon: Lock,
                comingSoon: true,
            },
            {
                title: "Authentification",
                url: "/auth",
                icon: Fingerprint,
                subItems: [
                    { title: "Connexion v1", url: "/auth/v1/login", newTab: true },
                    { title: "Connexion v2", url: "/auth/v2/login", newTab: true },
                    {
                        title: "Inscription v1",
                        url: "/auth/v1/register",
                        newTab: true,
                    },
                    {
                        title: "Inscription v2",
                        url: "/auth/v2/register",
                        newTab: true,
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        label: "Divers",
        items: [
            {
                title: "Autres",
                url: "/others",
                icon: SquareArrowUpRight,
                comingSoon: true,
            },
        ],
    },
];
