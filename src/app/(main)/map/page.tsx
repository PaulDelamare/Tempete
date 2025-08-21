"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Map, GeolocateControl } from "@vis.gl/react-maplibre";
import { AreaMarker } from "@/components/map/AreaMarker";
import { AreaPopup } from "@/components/map/AreaPopup";
import { MapControls } from "@/components/map/MapControls";

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

    const handleMarkerClick = (area: Area) => {
        setMarkerClicked(true);
        setSelectedArea(area);
        setIsModalOpen(true);
    };

    const handlePopupClose = () => {
        setIsModalOpen(false);
        setSelectedArea(null);
    };

    const handleMapClick = (event: any) => {
        if (!markerClicked && isModalOpen) {
            setIsModalOpen(false);
            setSelectedArea(null);
        }
        setMarkerClicked(false);

        console.log("Coordonnées cliquées:", { longitude: event.lngLat.lng, latitude: event.lngLat.lat });
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
                        zoom: 17,
                    }}
                    mapStyle="https://tiles.openfreemap.org/styles/liberty"
                    onMove={handleViewStateChange}
                    onClick={handleMapClick}
                    cursor="default"
                >
                    {filteredAreas.map((area) => (
                        <AreaMarker
                            key={area.id}
                            area={area}
                            currentZoom={currentZoom}
                            onClick={handleMarkerClick}
                        />
                    ))}

                    {selectedArea && isModalOpen && (
                        <AreaPopup
                            area={selectedArea}
                            onClose={handlePopupClose}
                        />
                    )}


                    <GeolocateControl position="bottom-right" />
                </Map>


                <MapControls
                    searchTerm={searchTerm}
                    selectedType={selectedType}
                    availableTypes={availableTypes}
                    onSearchChange={setSearchTerm}
                    onTypeChange={setSelectedType}
                />
            </div>
        </div>
    );
};

export default MapPage;