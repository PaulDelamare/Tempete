import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { formatEventDateTime } from "@/lib/utils/date";
import Image from "next/image";

interface Event {
  id: string;
  name: string;
  description: string | null;
  datestart: string;
  dateend: string;
  capacity: number | null;
  status: string;
  areaId: string | null;
  created_at: string;
  modified_at: string;
  artists?: Array<{
    id: string;
    artistId: string;
    artist: {
      id: string;
      name: string;
      nickname?: string;
      bio?: string;
      imgurl?: string;
      tagsJoin?: Array<{
        id: string;
        tagId: string;
        tag: {
          id: string;
          name: string;
        };
      }>;
    };
  }>;
  tagsJoin?: Array<{
    id: string;
    tagId: string;
    tag: {
      id: string;
      name: string;
    };
  }>;
  area?: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    imgurl: string | null;
    capacity: number | null;
  } | null;
}

async function getEvent(id: string): Promise<Event | null> {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        artists: {
          include: {
            artist: {
              include: {
                tagsJoin: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
        tagsJoin: {
          include: {
            tag: true,
          },
        },
        area: true,
      },
    });

    if (!event) return null;

    return {
      ...event,
      created_at: event.created_at.toISOString(),
      modified_at: event.modified_at.toISOString(),
      datestart: event.datestart.toISOString(),
      dateend: event.dateend.toISOString(),
    };
  } catch (error) {
    console.error("Erreur lors du chargement de l'événement:", error);
    return null;
  }
}

const getEventStatusInfo = (event: Event) => {
  const now = new Date();
  const eventStart = new Date(event.datestart);
  const eventEnd = new Date(event.dateend);

  if (event.status === "cancelled") {
    return { status: "cancelled", label: "ANNULÉ", color: "red", icon: "❌" };
  }
  if (event.status === "soldout") {
    return { status: "soldout", label: "COMPLET", color: "orange", icon: "🔒" };
  }
  if (event.status === "hidden") {
    return { status: "hidden", label: "CACHÉ", color: "gray", icon: "👻" };
  }
  if (event.status === "draft") {
    return { status: "draft", label: "BROUILLON", color: "yellow", icon: "📝" };
  }

  // Événement publié
  if (eventStart > now) {
    return { status: "upcoming", label: "À VENIR", color: "blue", icon: "⏰" };
  }
  if (eventStart <= now && eventEnd >= now) {
    return { status: "live", label: "EN DIRECT", color: "green", icon: "🔴" };
  }
  if (eventEnd < now) {
    return { status: "past", label: "TERMINÉ", color: "gray", icon: "✅" };
  }

  return { status: "unknown", label: "INCONNU", color: "gray", icon: "❓" };
};

const EventDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await Promise.resolve(params);

  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const statusInfo = getEventStatusInfo(event);
  const mainArtist = event.artists?.[0]?.artist;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px), radial-gradient(circle at 75% 75%, #ef4444 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <Navigation />
      <Header />

      <div className="relative z-10">
        <div className="relative h-[60vh] overflow-hidden">
          {mainArtist?.imgurl ? (
            <>
              <Image
                src={mainArtist.imgurl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          )}

          {/* Contenu hero */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-8 pb-12">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div
                    className={`bg-gradient-to-r from-${statusInfo.color}-600 to-${statusInfo.color}-400 text-black font-bold px-6 py-3 rounded-full text-lg font-metal tracking-wider`}
                  >
                    {statusInfo.icon} {statusInfo.label} {statusInfo.icon}
                  </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold font-metal text-white mb-4 tracking-wider drop-shadow-2xl text-center">
                  {event.name}
                </h1>

                {mainArtist && (
                  <div className="text-center mb-6">
                    <div className="text-2xl text-blue-300 font-bold backdrop-blur-sm bg-black/30 px-6 py-3 rounded-lg inline-block">
                      🎤 {mainArtist.name}
                      {mainArtist.nickname && (
                        <span className="text-lg text-gray-300 ml-2">
                          ({mainArtist.nickname})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                  <div className="text-gray-300 text-lg font-semibold backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg">
                    📅 {formatEventDateTime(event.datestart).date}
                  </div>
                  <div className="text-gray-300 text-lg font-semibold backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg">
                    ⏰ {formatEventDateTime(event.datestart).time}
                  </div>
                  {event.capacity && (
                    <div className="text-gray-300 text-lg font-semibold backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg">
                      🏟️ {event.capacity} personnes
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="text-xl text-gray-200 leading-relaxed max-w-3xl backdrop-blur-sm bg-black/30 p-4 rounded-lg mx-auto text-center">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Artistes */}
        {event.artists && event.artists.length > 0 && (
          <div className="px-8 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block relative">
                  <h2 className="text-4xl md:text-5xl font-bold font-metal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-400 mb-4 tracking-wider">
                    🎸 ARTISTES 🎸
                  </h2>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-red-500" />
                </div>
              </div>

              <div className="grid gap-8">
                {event.artists.map((eventArtist, index) => {
                  const artist = eventArtist.artist;
                  return (
                    <div key={eventArtist.id} className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-transparent to-red-500/30 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-500" />

                      <div className="relative bg-gradient-to-r from-gray-900/90 to-black/90 border-2 border-blue-400/30 rounded-xl p-8 backdrop-blur-sm">
                        <div className="flex flex-col lg:flex-row gap-8 items-center">
                          <div className="flex-shrink-0 relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-red-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300" />
                            {artist.imgurl ? (
                              <Image
                                src={artist.imgurl}
                                alt={artist.name}
                                width={200}
                                height={200}
                                className="relative rounded-xl object-cover border-2 border-white/20"
                              />
                            ) : (
                              <div className="relative w-[200px] h-[200px] bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl border-2 border-white/20 flex items-center justify-center">
                                <div className="text-6xl">🎸</div>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-3xl md:text-4xl font-bold font-metal text-white tracking-wide">
                                {artist.name}
                              </h3>
                              <div className="text-blue-400 font-bold text-2xl">
                                #{index + 1}
                              </div>
                            </div>

                            {artist.nickname && (
                              <div className="text-blue-300 text-xl font-semibold mb-4">
                                "{artist.nickname}"
                              </div>
                            )}

                            {artist.bio && (
                              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                {artist.bio}
                              </p>
                            )}

                            {artist.tagsJoin && artist.tagsJoin.length > 0 && (
                              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                {artist.tagsJoin.map((tagJoin) => (
                                  <Badge
                                    key={tagJoin.tag.id}
                                    className="bg-gradient-to-r from-red-600/30 to-blue-600/30 text-white border-red-400/50 text-sm px-3 py-1 font-bold"
                                  >
                                    {tagJoin.tag.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Section Zone */}
        {event.area && (
          <div className="px-8 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-metal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white mb-4">
                  🏟️ ZONE DE COMBAT 🏟️
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-white mx-auto" />
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-transparent to-blue-500/30 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-500" />

                <div className="relative bg-gradient-to-r from-gray-900/90 to-black/90 border-2 border-blue-400/30 rounded-xl p-8 backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="text-2xl font-bold font-metal text-white mb-4">
                        {event.area.name}
                      </h3>
                      {event.area.description && (
                        <p className="text-gray-300 text-lg mb-4">
                          {event.area.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <Badge
                          variant="secondary"
                          className="bg-blue-600/30 text-blue-300 border-blue-400/50 text-lg px-4 py-2 font-bold"
                        >
                          {event.area.type.toUpperCase()}
                        </Badge>
                        {event.area.capacity && (
                          <div className="text-gray-300 text-lg font-semibold bg-black/30 px-4 py-2 rounded-lg">
                            🏟️ {event.area.capacity} personnes
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative group/button">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-50 group-hover/button:opacity-100 transition duration-300" />
                      <a
                        href={`/areas/${event.area.id}`}
                        className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-metal tracking-wide"
                      >
                        🏟️ VOIR LA ZONE
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Tags */}
        {event.tagsJoin && event.tagsJoin.length > 0 && (
          <div className="px-8 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-metal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white mb-4">
                  🏷️ STYLES MUSICAUX 🏷️
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-white mx-auto" />
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {event.tagsJoin.map((tagJoin) => (
                  <Badge
                    key={tagJoin.tag.id}
                    className="bg-gradient-to-r from-red-600/30 to-blue-600/30 text-white border-red-400/50 text-lg px-6 py-3 font-bold font-metal"
                  >
                    {tagJoin.tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="h-32 bg-gradient-to-t from-black via-gray-900/50 to-transparent relative">
          <div className="absolute inset-0 opacity-10">
            <div
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, #3b82f6 0px, #3b82f6 2px, transparent 2px, transparent 40px)`,
              }}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
