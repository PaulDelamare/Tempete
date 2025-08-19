'use client'

import React, { useState } from 'react'
import { Map, Marker } from '@vis.gl/react-maplibre'
import AreaModal from '../../components/map/modal/AreaModal'

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
                    }}
                >
                    {areas.map((area) => (
                        <Marker
                            key={area.id}
                            longitude={area.longitude}
                            latitude={area.latitude}
                            onClick={() => {
                                setSelectedArea(area);
                                setIsModalOpen(true);
                            }}
                        >
                            <div className="bg-red-500 w-8 h-8 rounded-full border-2 border-white cursor-pointer hover:bg-red-600">
                            </div>
                        </Marker>
                    ))}
                </Map>
            </div>

            <AreaModal
                area={selectedArea}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedArea(null);
                }}
            />
        </div>
    )
}

export default MapPage