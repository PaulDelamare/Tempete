import React from "react";
import { Popup } from "@vis.gl/react-maplibre";
import { Badge } from "@/components/ui/badge";
import { formatEventDateTime } from "@/lib/utils/date";

interface Area {
    id: string;
    name: string;
    description: string | null;
    type: string;
    longitude: number | null;
    latitude: number | null;
    imgurl: string | null;
    capacity: number | null;
    created_at: string;
    modified_at: string;
    events?: any[];
}

interface AreaPopupProps {
    area: Area;
    onClose: () => void;
}

const getAreaTypeLabel = (type: string) => {
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

const getCurrentAndNextEvent = (area: Area) => {
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

export const AreaPopup: React.FC<AreaPopupProps> = ({ area, onClose }) => {
    return (
        <Popup
            longitude={area.longitude!}
            latitude={area.latitude!}
            closeButton={true}
            closeOnClick={false}
            onClose={onClose}
            anchor="bottom"
            offset={[0, -10]}
            maxWidth="260px"
        >
            <div className="w-[260px] max-w-[260px] px-4 py-3 space-y-3 bg-black text-white">
                <div>
                    <div className="text-base font-semibold leading-tight truncate font-metal text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">{area.name}</div>
                    <Badge variant="secondary" className="w-fit px-2 py-0.5 text-[10px] mt-1 bg-blue-600/20 text-blue-400 border-blue-400/30">
                        {getAreaTypeLabel(area.type)}
                    </Badge>
                </div>

                {area.description && (
                    <p className="text-sm text-gray-300 break-words line-clamp-2">{area.description}</p>
                )}



                {area.type === "stage" ? (
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-white">Prochains événements</div>
                        {(() => {
                            const { currentEvent, nextEvent } = getCurrentAndNextEvent(area);

                            return (
                                <>
                                    {/* Événement en cours */}
                                    {currentEvent && (
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-blue-400">En cours</div>
                                            <div className="rounded-md border p-2 space-y-2 bg-blue-600/20 border-blue-400/30">
                                                {currentEvent.artists?.[0]?.artist?.imgurl && (
                                                    <img
                                                        src={currentEvent.artists[0].artist.imgurl}
                                                        alt={currentEvent.artists[0].artist.name}
                                                        className="w-full h-20 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium truncate text-white">{currentEvent.name}</div>
                                                    <div className="text-xs text-gray-400">
                                                        {formatEventDateTime(currentEvent.datestart).date} · {formatEventDateTime(currentEvent.datestart).time}
                                                    </div>
                                                </div>

                                                {currentEvent.artists?.[0]?.artist && (
                                                    <div className="space-y-1">
                                                        {currentEvent.artists[0].artist.tagsJoin?.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {currentEvent.artists[0].artist.tagsJoin.map((tagJoin: any) => (
                                                                    <Badge key={tagJoin.tag.id} variant="outline" className="text-[9px] px-1 py-0.5 bg-blue-600/20 text-blue-400 border-blue-400/30">
                                                                        {tagJoin.tag.name}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Prochain événement */}
                                    {nextEvent && (
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-blue-400">À venir</div>
                                            <div className="rounded-md border p-2 space-y-2 bg-gray-800/50 border-gray-600">
                                                <div>
                                                    <div className="text-sm font-medium truncate text-white">{nextEvent.name}</div>
                                                    <div className="text-xs text-gray-400">
                                                        {formatEventDateTime(nextEvent.datestart).date} · {formatEventDateTime(nextEvent.datestart).time}
                                                    </div>
                                                </div>

                                                {nextEvent.artists?.[0]?.artist && (
                                                    <div className="space-y-1">
                                                        {nextEvent.artists[0].artist.tagsJoin?.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {nextEvent.artists[0].artist.tagsJoin.map((tagJoin: any) => (
                                                                    <Badge key={tagJoin.tag.id} variant="outline" className="text-[9px] px-1 py-0.5 bg-blue-600/20 text-blue-400 border-blue-400/30">
                                                                        {tagJoin.tag.name}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {!currentEvent && !nextEvent && (
                                        <div className="text-xs text-gray-400">Aucun événement programmé</div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                ) : (
                    area.imgurl && (
                        <div>
                            <img 
                                src={area.imgurl} 
                                alt={area.name}
                                className="w-full h-32 object-cover rounded"
                            />
                        </div>
                    )
                )}
            </div>
        </Popup>
    );
};
