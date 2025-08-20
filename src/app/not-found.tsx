"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Page non trouvée.</h1>
            <p className="text-muted-foreground">
                La page que vous recherchez est introuvable.
            </p>
            <Link replace href="/dashboard/default">
                <Button variant="outline">Retour à l&apos;accueil</Button>
            </Link>
        </div>
    );
}
