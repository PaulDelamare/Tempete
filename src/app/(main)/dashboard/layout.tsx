import { ReactNode } from "react";

import { cookies, headers } from "next/headers";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";
import {
    SIDEBAR_VARIANT_VALUES,
    SIDEBAR_COLLAPSIBLE_VALUES,
    CONTENT_LAYOUT_VALUES,
    type SidebarVariant,
    type SidebarCollapsible,
    type ContentLayout,
} from "@/types/preferences/layout";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

import { AccountSwitcher } from "./_components/sidebar/account-switcher";
import { LayoutControls } from "./_components/sidebar/layout-controls";
import { SearchDialog } from "./_components/sidebar/search-dialog";
import { ThemeSwitcher } from "./_components/sidebar/theme-switcher";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: Readonly<{ children: ReactNode }>) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    const THEME_MODE_VALUES: ["light", "dark"] = ["light", "dark"];
    const THEME_PRESET_VALUES: [
        "default",
        "brutalist",
        "soft-pop",
        "tangerine"
    ] = ["default", "brutalist", "soft-pop", "tangerine"];
    const [
        sidebarVariant,
        sidebarCollapsible,
        contentLayout,
        themeModeRaw,
        themePresetRaw,
    ] = await Promise.all([
        getPreference<SidebarVariant>(
            "sidebar_variant",
            SIDEBAR_VARIANT_VALUES,
            "inset"
        ),
        getPreference<SidebarCollapsible>(
            "sidebar_collapsible",
            SIDEBAR_COLLAPSIBLE_VALUES,
            "icon"
        ),
        getPreference<ContentLayout>(
            "content_layout",
            CONTENT_LAYOUT_VALUES,
            "centered"
        ),
        getPreference<string>("theme_mode", THEME_MODE_VALUES, "light"),
        getPreference<string>("theme_preset", THEME_PRESET_VALUES, "default"),
    ]);

    // Cast les valeurs pour respecter les types
    const themeMode = THEME_MODE_VALUES.includes(themeModeRaw as any)
        ? (themeModeRaw as (typeof THEME_MODE_VALUES)[number])
        : "light";
    const themePreset = THEME_PRESET_VALUES.includes(themePresetRaw as any)
        ? (themePresetRaw as (typeof THEME_PRESET_VALUES)[number])
        : "default";

    const layoutPreferences = {
        contentLayout,
        variant: sidebarVariant,
        collapsible: sidebarCollapsible,
    };

    return (
        <PreferencesStoreProvider
            themeMode={themeMode}
            themePreset={themePreset}
        >
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar
                    variant={sidebarVariant}
                    collapsible={sidebarCollapsible}
                />
                <SidebarInset
                    data-content-layout={contentLayout}
                    className={cn(
                        "data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl",
                        "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto"
                    )}
                >
                    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex w-full items-center justify-between px-4 lg:px-6">
                            <div className="flex items-center gap-1 lg:gap-2">
                                <SidebarTrigger className="-ml-1" />
                                <Separator
                                    orientation="vertical"
                                    className="mx-2 data-[orientation=vertical]:h-4"
                                />
                                <SearchDialog />
                            </div>
                            <div className="flex items-center gap-2">
                                <LayoutControls {...layoutPreferences} />
                                <ThemeSwitcher />
                                <AccountSwitcher
                                    users={[
                                        {
                                            id: "1",
                                            name: "John Doe",
                                            email: "john.doe@example.com",
                                            avatar: "/avatar.png",
                                            role: "user",
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </header>
                    <div className="h-full p-4 md:p-6">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </PreferencesStoreProvider>
    );
}
