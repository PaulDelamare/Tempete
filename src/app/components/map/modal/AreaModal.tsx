'use client'

import React from 'react'

interface Area {
    id: string
    name: string
    description: string
    type: string
    longitude: number
    latitude: number
}

interface AreaModalProps {
    area: Area | null
    isOpen: boolean
    onClose: () => void
}

const AreaModal: React.FC<AreaModalProps> = ({ area, isOpen, onClose }) => {
    if (!isOpen || !area) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                    ×
                </button>

                <div className="pr-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{area.name}</h2>

                    <div className="space-y-3">
                        <div>
                            <span className="font-semibold text-gray-600">Description:</span>
                            <p className="text-gray-800 mt-1">{area.description}</p>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-600">Type:</span>
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {area.type}
                            </span>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-600">Coordonnées:</span>
                            <div className="text-sm text-gray-700 mt-1">
                                <div>Longitude: {area.longitude.toFixed(6)}</div>
                                <div>Latitude: {area.latitude.toFixed(6)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AreaModal
