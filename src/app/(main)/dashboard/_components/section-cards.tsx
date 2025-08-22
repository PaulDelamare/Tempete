import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
    CircleDollarSign,
    Users,
    LandPlot,
    ReceiptText,
    Calendar
} from "lucide-react";

export function SectionCards() {
    const items = [
        { href: "/dashboard/artist", title: "Artistes", icon: Users },
        { href: "/dashboard/event", title: "Événements", icon: Calendar },
        { href: "/dashboard/area", title: "Zones", icon: LandPlot },
        { href: "/dashboard/tag", title: "Tags", icon: ReceiptText },
        { href: "/dashboard/sponsor", title: "Sponsors", icon: CircleDollarSign },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <Link key={item.href} href={item.href} className="group">
                        <Card className="relative flex items-center justify-center h-32 @container/card rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-card shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                            <CardHeader className="flex flex-col items-center justify-center gap-2">
                                <Icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                                <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl text-center">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
