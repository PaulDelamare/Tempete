"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Map, Marker, Popup } from "@vis.gl/react-maplibre";
import { formatEventDateTime } from "@/lib/utils/date";

import { Badge } from "@/components/ui/badge";

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

const MapPage: React.FC = () => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedArea, setSelectedArea] = useState<Area | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [markerClicked, setMarkerClicked] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentZoom, setCurrentZoom] = useState(15);
    const [selectedType, setSelectedType] = useState<string>("all");

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/areas');
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des areas');
                }
                const data = await response.json();

                const areasWithCoords = data
                    .filter((area: any) => area.latitude && area.longitude)
                    .map((area: any) => ({
                        ...area,
                        latitude: parseFloat(area.latitude.toString()),
                        longitude: parseFloat(area.longitude.toString()),
                    }));

                setAreas(areasWithCoords);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        };

        fetchAreas();
    }, []);

    const filteredAreas = areas.filter((area) => {
        const matchesSearch = area.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "all" || area.type === selectedType;
        return matchesSearch && matchesType;
    });

    const availableTypes = Array.from(new Set(areas.map(area => area.type)));

    const handleViewStateChange = useCallback((evt: any) => {
        if (evt?.viewState?.zoom !== undefined) {
            setCurrentZoom(evt.viewState.zoom);
        }
    }, []);

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

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-6xl animate-spin">💀</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <div className="text-xl text-red-600">Erreur de chargement</div>
                <div className="mt-2 text-gray-600">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <h1 className="text-2xl font-bold p-4">
                Carte Tempête ({areas.length} area{areas.length > 1 ? 's' : ''})
            </h1>
            <div className="flex-1 relative min-h-0 overflow-hidden">
                <Map
                    initialViewState={{
                        longitude: 142.78130880856264,
                        latitude: 63.467719565611816,
                        zoom: 15,
                    }}
                    mapStyle="https://tiles.openfreemap.org/styles/liberty"
                    onMove={handleViewStateChange}
                    onClick={(event: any) => {
                        if (!markerClicked && isModalOpen) {
                            setIsModalOpen(false);
                            setSelectedArea(null);
                        }
                        setMarkerClicked(false);

                        console.log("Coordonnées cliquées:", { longitude: event.lngLat.lng, latitude: event.lngLat.lat });
                    }}
                >
                    {filteredAreas.map((area) => (
                        <Marker
                            key={area.id}
                            longitude={area.longitude}
                            latitude={area.latitude}
                            anchor="center"
                            pitchAlignment="map"
                            rotationAlignment="map"
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMarkerClicked(true);
                                    setSelectedArea(area);
                                    setIsModalOpen(true);
                                }}
                                className="flex flex-col items-center select-none"
                                role="button"
                                aria-label={`Marker ${area.name}`}
                                style={{
                                    transform: 'translate(-50%, -50%)',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    pointerEvents: 'auto',
                                }}
                            >
                                <div className="bg-red-500 w-8 h-8 rounded-full border-2 border-white cursor-pointer hover:bg-red-600" />
                                {currentZoom >= 14 && (
                                    <div className="mt-1 px-2 py-1 bg-white bg-opacity-90 rounded shadow-sm text-xs font-medium text-gray-800 whitespace-nowrap border">
                                        {area.name}
                                    </div>
                                )}
                            </div>
                        </Marker>
                    ))}

                    {selectedArea && isModalOpen && (
                        <Popup
                            longitude={selectedArea.longitude}
                            latitude={selectedArea.latitude}
                            closeButton={true}
                            closeOnClick={false}
                            onClose={() => {
                                setIsModalOpen(false);
                                setSelectedArea(null);
                            }}
                            anchor="bottom"
                            offset={[0, -10]}
                            maxWidth="260px"
                        >
                            <div className="w-[260px] max-w-[260px] px-4 py-3 space-y-3">
                                <div>
                                    <div className="text-base font-semibold leading-tight truncate">{selectedArea.name}</div>
                                    <Badge variant="secondary" className="w-fit px-2 py-0.5 text-[10px] mt-1">{selectedArea.type}</Badge>
                                </div>

                                {selectedArea.description && (
                                    <p className="text-sm text-gray-600 break-words line-clamp-2">{selectedArea.description}</p>
                                )}

                                <div className="space-y-2">
                                    {(() => {
                                        const { currentEvent, nextEvent } = getCurrentAndNextEvent(selectedArea);

                                        return (
                                            <>
                                                {currentEvent && (
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">En cours</div>
                                                        <div className="rounded-md border p-2 space-y-2 bg-green-50 border-green-200">
                                                            {currentEvent.artists?.[0]?.artist?.imgurl && (
                                                                <img
                                                                    src={currentEvent.artists[0].artist.imgurl}
                                                                    alt={currentEvent.artists[0].artist.name}
                                                                    className="w-full h-20 object-cover rounded"
                                                                />
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium truncate">{currentEvent.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {formatEventDateTime(currentEvent.datestart).date} · {formatEventDateTime(currentEvent.datestart).time}
                                                                </div>
                                                            </div>

                                                            {currentEvent.artists?.[0]?.artist && (
                                                                <div className="space-y-1">
                                                                    {currentEvent.artists[0].artist.tagsJoin?.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {currentEvent.artists[0].artist.tagsJoin.map((tagJoin: any) => (
                                                                                <Badge key={tagJoin.tag.id} variant="outline" className="text-[9px] px-1 py-0.5">
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

                                                {nextEvent && (
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">À venir</div>
                                                        <div className="rounded-md border p-2 space-y-2">
                                                            <div>
                                                                <div className="text-sm font-medium truncate">{nextEvent.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {formatEventDateTime(nextEvent.datestart).date} · {formatEventDateTime(nextEvent.datestart).time}
                                                                </div>
                                                            </div>

                                                            {nextEvent.artists?.[0]?.artist && (
                                                                <div className="space-y-1">
                                                                    {nextEvent.artists[0].artist.tagsJoin?.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {nextEvent.artists[0].artist.tagsJoin.map((tagJoin: any) => (
                                                                                <Badge key={tagJoin.tag.id} variant="outline" className="text-[9px] px-1 py-0.5">
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
                                                    <div className="text-xs text-muted-foreground">Aucun événement programmé</div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </Popup>
                    )}
                </Map>

                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-lg text-sm"
                    >
                        <option value="all">Tous les types</option>
                        {availableTypes.map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                    
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher une area..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-lg"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPage;

