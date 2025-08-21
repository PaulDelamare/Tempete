import React from "react";
import { Marker } from "@vis.gl/react-maplibre";
import { getAreaIcon, getAreaColor } from "@/lib/utils/areaUtils";

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

interface AreaMarkerProps {
    area: Area;
    currentZoom: number;
    onClick: (area: Area) => void;
}



export const AreaMarker: React.FC<AreaMarkerProps> = ({ 
    area, 
    currentZoom, 
    onClick 
}) => {
    if (area.longitude === null || area.latitude === null) {
        return null;
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(area);
    };

    return (
        <Marker
            longitude={area.longitude}
            latitude={area.latitude}
            anchor="center"
            pitchAlignment="map"
            rotationAlignment="map"
        >
            <div
                onClick={handleClick}
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
                <div className={`w-8 h-8 rounded-full border-2 border-white cursor-pointer flex items-center justify-center ${getAreaColor(area.type)}`}>
                    {getAreaIcon(area.type)}
                </div>
                {currentZoom >= 14 && (
                    <div className="mt-1 px-2 py-1 bg-white bg-opacity-90 rounded shadow-sm text-xs font-medium text-gray-800 whitespace-nowrap border">
                        {area.name}
                    </div>
                )}
            </div>
        </Marker>
    );
};
