import React from "react";
import { Marker } from "@vis.gl/react-maplibre";
import {
    Music,
    UtensilsCrossed,
    ShoppingBag,
    Armchair,
    Settings
} from "lucide-react";

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

const getAreaIcon = (type: string) => {
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

const getAreaColor = (type: string) => {
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

export const AreaMarker: React.FC<AreaMarkerProps> = ({ 
    area, 
    currentZoom, 
    onClick 
}) => {
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
