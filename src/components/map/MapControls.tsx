import React, { useState, useEffect } from "react";
import {
    Music,
    UtensilsCrossed,
    ShoppingBag,
    Armchair,
    Settings,
    Info
} from "lucide-react";

interface MapControlsProps {
    searchTerm: string;
    selectedType: string;
    availableTypes: string[];
    onSearchChange: (value: string) => void;
    onTypeChange: (type: string) => void;
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

export const MapControls: React.FC<MapControlsProps> = ({
    searchTerm,
    selectedType,
    availableTypes,
    onSearchChange,
    onTypeChange
}) => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    // Fermer le dropdown quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isSelectOpen) {
                setIsSelectOpen(false);
            }
        };

        if (isSelectOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSelectOpen]);

    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col sm:flex-row gap-2">
            {/* Filtre par type */}
            <div className="relative">
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsSelectOpen(!isSelectOpen);
                    }}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-lg text-sm cursor-pointer w-64 sm:w-auto sm:min-w-[140px]"
                >
                    <span>{selectedType === "all" ? "Tous les types" : getAreaTypeLabel(selectedType)}</span>
                </div>

                {/* Icône du type sélectionné */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {selectedType === "all" ? (
                        <div className="w-6 h-6 rounded-full bg-gray-400 border border-white flex items-center justify-center">
                            <Info size={12} className="text-white" />
                        </div>
                    ) : (
                        <div className={`w-6 h-6 rounded-full border border-white flex items-center justify-center ${getAreaColor(selectedType).replace('hover:', '')}`}>
                            {React.cloneElement(getAreaIcon(selectedType) as React.ReactElement, { size: 12 })}
                        </div>
                    )}
                </div>

                {/* Flèche du select */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Options dropdown */}
                {isSelectOpen && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
                    >
                        {/* Option "Tous les types" */}
                        <div
                            onClick={() => {
                                onTypeChange("all");
                                setIsSelectOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${selectedType === "all" ? "bg-blue-50" : ""}`}
                        >
                            <div className="w-6 h-6 rounded-full bg-gray-400 border border-white flex items-center justify-center flex-shrink-0">
                                <Info size={12} className="text-white" />
                            </div>
                            <span className="text-sm">Tous les types</span>
                        </div>

                        {/* Options pour chaque type */}
                        {availableTypes.map(type => (
                            <div
                                key={type}
                                onClick={() => {
                                    onTypeChange(type);
                                    setIsSelectOpen(false);
                                }}
                                className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${selectedType === type ? "bg-blue-50" : ""}`}
                            >
                                <div className={`w-6 h-6 rounded-full border border-white flex items-center justify-center flex-shrink-0 ${getAreaColor(type).replace('hover:', '')}`}>
                                    {React.cloneElement(getAreaIcon(type) as React.ReactElement, { size: 12 })}
                                </div>
                                <span className="text-sm">{getAreaTypeLabel(type)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Champ de recherche */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Rechercher une area..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-lg"
                />
                {searchTerm && (
                    <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};
