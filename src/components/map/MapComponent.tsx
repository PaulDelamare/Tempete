"use client";

import React, { useState, useCallback } from "react";
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

interface MapComponentProps {
    areas: Area[];
}

export const MapComponent: React.FC<MapComponentProps> = ({ areas }) => {
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [markerClicked, setMarkerClicked] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentZoom, setCurrentZoom] = useState(15);
    const [selectedType, setSelectedType] = useState<string>("all");

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
    };

    return (
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
    );
};
