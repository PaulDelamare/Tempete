import React from "react";
import { MapComponent } from "@/components/map/MapComponent";
import { prisma } from "@/lib/prisma";

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


async function getAreas(): Promise<Area[]> {
    try {
        const data = await prisma.area.findMany({
            include: { 
                events: { 
                    include: { 
                        artists: { 
                            include: { 
                                artist: { 
                                    include: { 
                                        tagsJoin: { 
                                            include: { 
                                                tag: true 
                                            } 
                                        } 
                                    } 
                                } 
                            } 
                        } 
                    } 
                }, 
                products: true 
            },
            orderBy: { created_at: "desc" },
        });

        // Filtrer et transformer les données
        const areasWithCoords = data
            .filter((area: any) => area.latitude && area.longitude)
            .map((area: any) => ({
                ...area,
                latitude: parseFloat(area.latitude.toString()),
                longitude: parseFloat(area.longitude.toString()),
                created_at: area.created_at.toISOString(),
                modified_at: area.modified_at.toISOString(),
            }));

        return areasWithCoords;
    } catch (error) {
        console.error('Erreur lors du chargement des areas:', error);
        return [];
    }
}

const MapPage = async () => {
    const areas = await getAreas();

    return (
        <div className="w-full h-screen flex flex-col">
            <h1 className="text-2xl font-bold p-4">
                Carte Tempête ({areas.length} area{areas.length > 1 ? 's' : ''})
            </h1>
            <MapComponent areas={areas} />
        </div>
    );
};

export default MapPage;