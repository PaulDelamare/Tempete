"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";

interface Artist {
  id: string;
  name: string;
  nickname?: string | null;
  imgurl?: string | null;
}

interface EventArtist {
  id: string;
  artist: Artist;
}

interface Area {
  id: string;
  name: string;
  imgurl?: string | null;
  description?: string | null;
  type: string;
}

interface Event {
  id: string;
  name: string;
  imgurl?: string | null;
  description?: string | null;
  datestart: string;
  dateend: string;
  capacity?: number | null;
  status: string;
  artists: EventArtist[];
  area?: Area | null;
}

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ""}`;
    }
    return `${diffMinutes}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-600/20 border-green-400/30 text-green-400";
      case "draft":
        return "bg-gray-600/20 border-gray-400/30 text-gray-400";
      case "cancelled":
        return "bg-red-600/20 border-red-400/30 text-red-400";
      case "soldout":
        return "bg-orange-600/20 border-orange-400/30 text-orange-400";
      case "hidden":
        return "bg-purple-600/20 border-purple-400/30 text-purple-400";
      default:
        return "bg-blue-600/20 border-blue-400/30 text-blue-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Publié";
      case "draft":
        return "Brouillon";
      case "cancelled":
        return "Annulé";
      case "soldout":
        return "Complet";
      case "hidden":
        return "Caché";
      default:
        return status;
    }
  };

  // Grouper les événements par jour
  const eventsByDay = events.reduce((acc, event) => {
    const date = new Date(event.datestart);
    const dayKey = date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navigation />
      {/* Hero simple réutilisant le style */}
      <div className="relative h-[50vh] overflow-hidden">
        {/* Logo en haut à gauche */}
        <div className="absolute top-8 left-8 z-20 flex gap-4 flex-row items-center justify-center">
          <div className="w-30 h-30 shadow-lg">
            <Image
              src="/images/logos/LogoTDMP.png"
              alt="Logo Tempête de Metal Russe"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="">
            <h1 className="text-3xl font-bold font-metal">
              TEMPÊTE
              <br />
              DE MÉTAL RUSSE
            </h1>
          </div>
        </div>
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/MontagneBG.png"
            alt="BG"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-end px-8 pb-12">
          <div>
            <div className="w-16 h-0.5 bg-white mb-6" />
            <h1 className="text-5xl font-metal font-bold tracking-wider">
              LES ÉVÉNEMENTS
            </h1>
            <p className="mt-3 opacity-80 max-w-xl">
              Découvrez tous les événements du festival et leurs artistes.
            </p>
          </div>
        </div>
      </div>

      {/* Fondu noir entre le background et la section */}
      <div className="relative h-32 bg-gradient-to-b from-transparent to-black">
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Grille des events */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 font-metal text-center">
            PROGRAMME DU FESTIVAL
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              <p className="mt-4 text-lg">Chargement des événements...</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(eventsByDay).map(([day, dayEvents]) => (
                <div key={day} className="space-y-6">
                  <h3 className="text-2xl font-bold font-metal text-center border-b border-blue-400/30 pb-2">
                    {day}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                    {dayEvents.map((event) => (
                      <div key={event.id} className="relative group">
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 to-cyan-500/20" />

                        <div className="relative bg-black/80 border border-blue-400/40 rounded-lg p-6 h-full hover:border-blue-400 transition-colors duration-300 flex flex-col">
                          {/* Image de l'area */}
                          <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                            {event.area?.imgurl ? (
                              <Image
                                src={event.area.imgurl}
                                alt={event.area.name}
                                width={600}
                                height={400}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-4xl">📍</span>
                            )}
                          </div>

                          {/* Infos */}
                          <h3 className="text-xl font-bold mb-2 font-metal">
                            {event.name}
                          </h3>
                          {event.area && (
                            <p className="text-sm text-blue-400 mb-2">
                              📍 {event.area.name}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm opacity-80 mb-4 line-clamp-3">
                              {event.description}
                            </p>
                          )}

                          {/* Dates et heures */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl font-bold text-blue-400">
                                {formatTime(event.datestart)}
                              </span>
                              <span className="text-sm bg-blue-600/20 border border-blue-400/30 rounded px-2 py-1">
                                {formatDuration(event.datestart, event.dateend)}
                              </span>
                            </div>
                            <div className="text-sm opacity-70">
                              <p>{formatDate(event.datestart)}</p>
                              <p className="text-xs">
                                → {formatTime(event.dateend)}
                              </p>
                            </div>
                          </div>

                          {/* Artistes */}
                          {event.artists.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-semibold mb-2">
                                Artistes:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {event.artists
                                  .slice(0, 3)
                                  .map((eventArtist) => (
                                    <span
                                      key={eventArtist.id}
                                      className="px-2 py-1 bg-blue-600/20 border border-blue-400/30 rounded text-xs"
                                    >
                                      {eventArtist.artist.name}
                                    </span>
                                  ))}
                                {event.artists.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-600/20 border border-gray-400/30 rounded text-xs">
                                    +{event.artists.length - 3} autres
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Status et capacité alignés bas */}
                          <div className="mt-auto pt-2 flex justify-between items-center">
                            <span
                              className={`px-3 py-1 border rounded text-xs uppercase tracking-wide ${getStatusColor(
                                event.status
                              )}`}
                            >
                              {getStatusText(event.status)}
                            </span>
                            {event.capacity && (
                              <span className="text-xs opacity-70">
                                Cap: {event.capacity}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
