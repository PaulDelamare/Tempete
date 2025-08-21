import {
    Music,
    UtensilsCrossed,
    ShoppingBag,
    Armchair,
    Settings
} from "lucide-react";

export const getAreaIcon = (type: string) => {
    const iconProps = { size: 16, className: "text-white" };

    switch (type) {
        case 'stage':
            return <Music {...iconProps} />;
        case 'food':
            return <UtensilsCrossed {...iconProps} />;
        case 'merch':
            return <ShoppingBag {...iconProps} />;
        case 'chill':
            return <Armchair {...iconProps} />;
        default:
            return <Settings {...iconProps} />;
    }
};

export const getAreaColor = (type: string) => {
    switch (type) {
        case 'stage':
            return 'bg-purple-500 hover:bg-purple-600';
        case 'food':
            return 'bg-orange-500 hover:bg-orange-600';
        case 'merch':
            return 'bg-blue-500 hover:bg-blue-600';
        case 'chill':
            return 'bg-green-500 hover:bg-green-600';
        default:
            return 'bg-gray-500 hover:bg-gray-600';
    }
};

export const getAreaTypeLabel = (type: string) => {
    switch (type) {
        case 'stage':
            return 'Scène';
        case 'food':
            return 'Restauration';
        case 'merch':
            return 'Boutique';
        case 'chill':
            return 'Détente';
        default:
            return type.charAt(0).toUpperCase() + type.slice(1);
    }
};

export const getCurrentAndNextEvent = (area: { events?: any[] }) => {
    if (!area.events) return { currentEvent: null, nextEvent: null };

    const now = new Date();
    const publishedEvents = area.events.filter(event => event.status === 'published');

    const currentEvent = publishedEvents.find(event => {
        const eventStart = new Date(event.datestart);
        const eventEnd = new Date(event.dateend);
        return eventStart <= now && eventEnd >= now;
    });

    const nextEvent = publishedEvents
        .filter(event => {
            const eventStart = new Date(event.datestart);
            return eventStart > now;
        })
        .sort((a, b) => new Date(a.datestart).getTime() - new Date(b.datestart).getTime())[0];

    return { currentEvent, nextEvent };
};
