'use client'

import React from 'react'
import { Map } from '@vis.gl/react-maplibre'

const MapPage = () => {
    return (
        <div className="w-full h-screen flex flex-col">
            <h1 className="text-2xl font-bold p-4">Carte Tempête</h1>
            <div className="flex-1">
                <Map
                    initialViewState={{
                        longitude: 2.3522, // Paris
                        latitude: 48.8566,
                        zoom: 10
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="https://demotiles.maplibre.org/style.json"
                />
            </div>
        </div>
    )
}

export default MapPage