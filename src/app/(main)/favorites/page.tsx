"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { Star, Trash2 } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

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

export default function FavoritesPage() {
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, removeFromFavorites } = useFavorites();

  useEffect(() => {
    const fetchFavoriteEvents = async () => {
      try {
        // Récupérer tous les événements
        const res = await fetch("/api/events");
        if (res.ok) {
          const allEvents: Event[] = await res.json();

          // Filtrer pour ne garder que les événements en favoris
          const favoritesEvents = allEvents.filter((event) =>
            favorites.some((fav) => fav.eventId === event.id)
          );

          setFavoriteEvents(favoritesEvents);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteEvents();
  }, [favorites]);

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

  const handleRemoveFavorite = async (eventId: string) => {
    await removeFromFavorites(eventId);
  };

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
              MES FAVORIS
            </h1>
            <p className="mt-3 opacity-80 max-w-xl">
              Retrouvez tous vos événements favoris en un coup d'œil.
            </p>
          </div>
        </div>
      </div>

      {/* Fondu noir entre le background et la section */}
      <div className="relative h-32 bg-gradient-to-b from-transparent to-black">
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Grille des favoris */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 font-metal text-center">
            ÉVÉNEMENTS FAVORIS
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              <p className="mt-4 text-lg">Chargement de vos favoris...</p>
            </div>
          ) : favoriteEvents.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aucun favori</h3>
              <p className="text-gray-400 mb-6">
                Vous n'avez pas encore ajouté d'événements à vos favoris.
              </p>
              <a
                href="/event"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
              >
                Découvrir les événements
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {favoriteEvents.map((event) => (
                <div key={event.id} className="relative group">
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 to-cyan-500/20" />

                  <div className="relative bg-black/80 border border-blue-400/40 rounded-lg p-6 h-full hover:border-blue-400 transition-colors duration-300 flex flex-col">
                    {/* Bouton supprimer des favoris */}
                    <button
                      onClick={() => handleRemoveFavorite(event.id)}
                      className="absolute top-4 right-4 z-10 p-2 bg-red-600/50 hover:bg-red-600/70 rounded-full transition-colors"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>

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
                        <p className="text-xs">→ {formatTime(event.dateend)}</p>
                      </div>
                    </div>

                    {/* Artistes */}
                    {event.artists.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">Artistes:</p>
                        <div className="flex flex-wrap gap-2">
                          {event.artists.slice(0, 3).map((eventArtist) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
