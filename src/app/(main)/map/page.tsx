"use client";

import React, { useState, useCallback } from "react";
import { Map, Marker, Popup } from "@vis.gl/react-maplibre";

interface Area {
    id: string;
    name: string;
    description: string;
    type: string;
    longitude: number;
    latitude: number;
}

const MapPage: React.FC = () => {
    const areas: Area[] = [
        {
            id: "1",
            name: "Inferno",
            description: "Scène de feu intense",
            type: "stage",
            longitude: 142.7836861523403,
            latitude: 63.4677249881924,
        },
        {
            id: "2",
            name: "Tempête de Neige",
            description: "Scène de neige et de froid",
            type: "stage",
            longitude: 142.782123456789,
            latitude: 63.468123456789,
        },
        {
            id: "3",
            name: "Tornade",
            description: "Scène de tornade et de vent",
            type: "stage",
            longitude: 142.784567890123,
            latitude: 63.466987654321,
        },
        {
            id: "4",
            name: "Hot & spicy",
            description: "Bar de cocktails épicés",
            type: "Bar",
            longitude: 142.786543210987,
            latitude: 63.468523456789,
        },
    ];

    const [selectedArea, setSelectedArea] = useState<Area | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [markerClicked, setMarkerClicked] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentZoom, setCurrentZoom] = useState(15);

    const filteredAreas = areas.filter((area) =>
        area.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewStateChange = useCallback((evt: any) => {
        if (evt?.viewState?.zoom !== undefined) {
            setCurrentZoom(evt.viewState.zoom);
        }
    }, []);

    return (
        <div className="w-full h-screen flex flex-col">
            <h1 className="text-2xl font-bold p-4">Carte Tempête</h1>
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

                        // debug coords
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
                        >
                            <div className="p-4 min-w-[250px]">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    {selectedArea.name}
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <span className="font-semibold text-sm text-gray-600">
                                            Description:
                                        </span>
                                        <p className="text-gray-800 text-sm mt-1">
                                            {selectedArea.description}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="font-semibold text-sm text-gray-600">
                                            Type:
                                        </span>
                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {selectedArea.type}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="font-semibold text-sm text-gray-600">
                                            Coordonnées:
                                        </span>
                                        <div className="text-xs text-gray-700 mt-1">
                                            <div>
                                                Longitude: {selectedArea.longitude.toFixed(6)}
                                            </div>
                                            <div>
                                                Latitude: {selectedArea.latitude.toFixed(6)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    )}
                </Map>

                {/* Search input */}
                <div className="absolute top-4 right-4 z-10">
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
