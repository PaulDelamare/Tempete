import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { formatEventDateTime } from "@/lib/utils/date";
import { getAreaTypeLabel } from "@/lib/utils/areaUtils";
import Image from "next/image";

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

async function getArea(id: string): Promise<Area | null> {
    try {
        const area = await prisma.area.findUnique({
            where: { id },
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
        });

        if (!area) return null;

        return {
            ...area,
            latitude: area.latitude ? parseFloat(area.latitude.toString()) : null,
            longitude: area.longitude ? parseFloat(area.longitude.toString()) : null,
            created_at: area.created_at.toISOString(),
            modified_at: area.modified_at.toISOString(),
        };
    } catch (error) {
        console.error('Erreur lors du chargement de l\'area:', error);
        return null;
    }
}

const getEventsData = (area: Area) => {
    if (!area.events) return { currentEvent: null, upcomingEvents: [] };

    const now = new Date();
    const publishedEvents = area.events.filter(event => event.status === 'published');

    const currentEvent = publishedEvents.find(event => {
        const eventStart = new Date(event.datestart);
        const eventEnd = new Date(event.dateend);
        return eventStart <= now && eventEnd >= now;
    });

    const upcomingEvents = publishedEvents
        .filter(event => {
            const eventStart = new Date(event.datestart);
            return eventStart > now;
        })
        .sort((a, b) => new Date(a.datestart).getTime() - new Date(b.datestart).getTime());

    return { currentEvent, upcomingEvents };
};

const AreaDetailPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await Promise.resolve(params);

    const area = await getArea(id);

    if (!area) {
        notFound();
    }

    const { currentEvent, upcomingEvents } = getEventsData(area);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <div className="fixed inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px), radial-gradient(circle at 75% 75%, #ef4444 2px, transparent 2px)`,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <Navigation />
            <Header />

            <div className="relative z-10">
                <div className="relative h-[60vh] overflow-hidden">
                    {area.imgurl ? (
                        <>
                            <Image
                                src={area.imgurl}
                                alt={area.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                        </>
                    ) : (
                        <>
                        </>
                    )}

                    {/* Contenu hero */}
                    <div className="absolute inset-0 flex items-end">
                        <div className="w-full px-8 pb-12">
                            <div className="max-w-4xl mx-auto">

                                <h1 className="text-5xl md:text-7xl font-bold font-metal text-white mb-4 tracking-wider drop-shadow-2xl">
                                    {area.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <Badge variant="secondary" className="bg-blue-600/30 text-blue-300 border-blue-400/50 text-lg px-4 py-2 font-bold backdrop-blur-sm">
                                        {getAreaTypeLabel(area.type)}
                                    </Badge>

                                    {area.capacity && (
                                        <div className="text-gray-300 text-lg font-semibold backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg">
                                            🏟️ {area.capacity} personnes
                                        </div>
                                    )}
                                </div>

                                {area.description && (
                                    <p className="text-xl text-gray-200 leading-relaxed max-w-3xl backdrop-blur-sm bg-black/30 p-4 rounded-lg">
                                        {area.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {area.type === "stage" && (
                    <div className="px-8 py-16">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <div className="inline-block relative">
                                    <h2 className="text-4xl md:text-5xl font-bold font-metal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-400 mb-4 tracking-wider">
                                        ⚡ ÉVÉNEMENTS ⚡
                                    </h2>
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-red-500" />
                                </div>
                            </div>

                            {currentEvent && (
                                <div className="mb-12">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

                                        <div className="relative bg-black border-2 border-red-500/50 rounded-xl p-8">
                                            <div className="flex items-center justify-center mb-6">
                                                <div className="bg-gradient-to-r from-red-600 to-red-400 text-black font-bold px-6 py-3 rounded-full text-lg font-metal tracking-wider">
                                                    🔥 LIVE MAINTENANT 🔥
                                                </div>
                                            </div>

                                            <div className="flex flex-col lg:flex-row gap-8 items-center">
                                                {currentEvent.artists?.[0]?.artist?.imgurl && (
                                                    <div className="flex-shrink-0 relative group">
                                                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300" />
                                                        <Image
                                                            src={currentEvent.artists[0].artist.imgurl}
                                                            alt={currentEvent.artists[0].artist.name}
                                                            width={200}
                                                            height={200}
                                                            className="relative rounded-xl object-cover border-2 border-white/20"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex-1 text-center lg:text-left">
                                                    <h3 className="text-3xl md:text-4xl font-bold font-metal text-white mb-4 tracking-wide">
                                                        {currentEvent.name}
                                                    </h3>

                                                    <div className="text-red-400 text-xl font-bold mb-6">
                                                        🕐 {formatEventDateTime(currentEvent.datestart).date} · {formatEventDateTime(currentEvent.datestart).time}
                                                    </div>

                                                    {currentEvent.artists?.[0]?.artist?.tagsJoin?.length > 0 && (
                                                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                                            {currentEvent.artists[0].artist.tagsJoin.map((tagJoin: any) => (
                                                                <Badge key={tagJoin.tag.id} className="bg-gradient-to-r from-red-600/30 to-blue-600/30 text-white border-red-400/50 text-sm px-3 py-1 font-bold">
                                                                    {tagJoin.tag.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {upcomingEvents.length > 0 && (
                                <div className="mb-12">
                                    <div className="text-center mb-12">
                                        <h3 className="text-3xl font-bold font-metal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white mb-4">
                                            🗲 PROCHAINS ASSAUTS 🗲
                                        </h3>
                                        <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-white mx-auto" />
                                    </div>

                                    <div className="grid gap-6">
                                        {upcomingEvents.map((event: any, index: number) => (
                                            <div key={event.id} className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />

                                                <div className="relative bg-gradient-to-r from-gray-900/80 to-black/80 border border-blue-400/30 rounded-lg p-6 backdrop-blur-sm hover:border-blue-400/60 transition-all duration-300">
                                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                                        <div className="flex-shrink-0 relative">
                                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-transparent rounded-lg blur opacity-50" />
                                                            {event.artists?.[0]?.artist?.imgurl ? (
                                                                <Image
                                                                    src={event.artists[0].artist.imgurl}
                                                                    alt={event.artists[0].artist.name}
                                                                    width={120}
                                                                    height={120}
                                                                    className="relative rounded-lg object-cover border border-blue-400/30"
                                                                />
                                                            ) : (
                                                                <div className="relative w-[120px] h-[120px] bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border border-blue-400/30 flex items-center justify-center">
                                                                    <div className="text-4xl">🎸</div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div>
                                                                    <h4 className="text-xl md:text-2xl font-bold font-metal text-white group-hover:text-blue-300 transition-colors">
                                                                        {event.name}
                                                                    </h4>
                                                                    {event.artists?.[0]?.artist?.name && (
                                                                        <div className="text-blue-300 text-sm font-semibold mt-1">
                                                                            🎤 {event.artists[0].artist.name}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-blue-400 font-bold text-lg">
                                                                    #{index + 1}
                                                                </div>
                                                            </div>

                                                            <div className="text-blue-400 font-semibold mb-4 text-lg">
                                                                📅 {formatEventDateTime(event.datestart).date} · ⏰ {formatEventDateTime(event.datestart).time}
                                                            </div>

                                                            {event.artists?.[0]?.artist?.tagsJoin?.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {event.artists[0].artist.tagsJoin.map((tagJoin: any) => (
                                                                        <Badge key={tagJoin.tag.id} className="bg-blue-600/20 text-blue-300 border-blue-400/40 hover:bg-blue-600/30 transition-colors">
                                                                            {tagJoin.tag.name}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!currentEvent && upcomingEvents.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="text-8xl mb-6">💀</div>
                                    <p className="text-2xl font-metal text-gray-400">AUCUN ÉVÉNEMENT PROGRAMMÉ</p>
                                    <p className="text-lg text-gray-500 mt-2">Le silence avant la tempête...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {area.latitude && area.longitude && (
                    <div className="px-8 py-16">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold font-metal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white mb-4">
                                    🗺️ COORDONNÉES DE GUERRE 🗺️
                                </h2>
                                <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-white mx-auto" />
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-transparent to-blue-500/30 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-500" />

                                <div className="relative bg-gradient-to-r from-gray-900/90 to-black/90 border-2 border-blue-400/30 rounded-xl p-8 backdrop-blur-sm">
                                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                                        <div className="flex-1 text-center lg:text-left">
                                            <div className="text-blue-400 font-bold text-xl mb-2">
                                                📍 POSITION STRATÉGIQUE
                                            </div>
                                            <div className="text-white text-lg font-mono bg-black/50 px-4 py-2 rounded-lg inline-block">
                                                LAT: {area.latitude.toFixed(6)} / LONG: {area.longitude.toFixed(6)}
                                            </div>
                                        </div>

                                        <div className="relative group/button">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-50 group-hover/button:opacity-100 transition duration-300" />
                                            <a
                                                href={`/map?lat=${area.latitude}&lng=${area.longitude}&zoom=19`}
                                                className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-metal tracking-wide"
                                            >
                                                🗺️ LOCALISER SUR LA CARTE
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="h-32 bg-gradient-to-t from-black via-gray-900/50 to-transparent relative">
                    <div className="absolute inset-0 opacity-10">
                        <div style={{
                            backgroundImage: `repeating-linear-gradient(90deg, #3b82f6 0px, #3b82f6 2px, transparent 2px, transparent 40px)`,
                        }} className="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AreaDetailPage;
