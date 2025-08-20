'use client'

import React, { useState } from 'react'
import { Map, Marker, Popup } from '@vis.gl/react-maplibre'

interface Area {
    id: string
    name: string
    description: string
    type: string
    longitude: number
    latitude: number
}

const MapPage = () => {
    const areas = [
        {
            id: '1',
            name: 'Inferno',
            description: 'Scène de feu intense',
            type: 'stage',
            longitude: 142.7836861523403,
            latitude: 63.4677249881924,
        },
    ]

    const [selectedArea, setSelectedArea] = useState<Area | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [markerClicked, setMarkerClicked] = useState(false)




    return (
        <div className="w-full h-screen flex flex-col">
            <h1 className="text-2xl font-bold p-4">Carte Tempête</h1>
            <div className="flex-1">
                <Map
                    initialViewState={{
                        longitude: 142.78130880856264,
                        latitude: 63.467719565611816,
                        zoom: 15
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="https://tiles.openfreemap.org/styles/liberty"
                    onClick={(event) => {
                        console.log('Coordonnées cliquées:', {
                            longitude: event.lngLat.lng,
                            latitude: event.lngLat.lat
                        });
                        // Ne fermer que si ce n'est pas un clic sur marqueur
                        if (!markerClicked && isModalOpen) {
                            setIsModalOpen(false);
                            setSelectedArea(null);
                        }
                        // Reset du flag
                        setMarkerClicked(false);
                    }}
                >
                    {areas.map((area) => (
                        <Marker
                            key={area.id}
                            longitude={area.longitude}
                            latitude={area.latitude}
                            onClick={() => {
                                setMarkerClicked(true);
                                setSelectedArea(area);
                                setIsModalOpen(true);
                            }}
                        >
                            <div className="bg-red-500 w-8 h-8 rounded-full border-2 border-white cursor-pointer hover:bg-red-600">
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
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{selectedArea.name}</h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <span className="font-semibold text-sm text-gray-600">Description:</span>
                                        <p className="text-gray-800 text-sm mt-1">{selectedArea.description}</p>
                                    </div>

                                    <div>
                                        <span className="font-semibold text-sm text-gray-600">Type:</span>
                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {selectedArea.type}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="font-semibold text-sm text-gray-600">Coordonnées:</span>
                                        <div className="text-xs text-gray-700 mt-1">
                                            <div>Longitude: {selectedArea.longitude.toFixed(6)}</div>
                                            <div>Latitude: {selectedArea.latitude.toFixed(6)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    )}
                </Map>
            </div>


        </div>
    )
}

export default MapPage