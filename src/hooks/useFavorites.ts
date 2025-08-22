import { useState, useEffect } from "react";

interface FavoriteEvent {
  eventId: string;
  email?: string;
  addedAt: string;
}

const FAVORITES_STORAGE_KEY = "tempete_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);

  // Charger les favoris depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
        setFavorites([]);
      }
    }
  }, []);

  // Sauvegarder les favoris dans localStorage
  const saveFavorites = (newFavorites: FavoriteEvent[]) => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  // Ajouter un événement aux favoris
  const addToFavorites = (eventId: string, email?: string) => {
    const newFavorite: FavoriteEvent = {
      eventId,
      email,
      addedAt: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, newFavorite];
    saveFavorites(updatedFavorites);
  };

  // Retirer un événement des favoris
  const removeFromFavorites = async (eventId: string) => {
    // Trouver le favori pour récupérer l'email
    const favorite = favorites.find((fav) => fav.eventId === eventId);

    // Si l'événement a un email associé, supprimer l'alerte mail
    if (favorite?.email) {
      try {
        await fetch(
          `/api/mail-alerts?eventId=${eventId}&email=${encodeURIComponent(
            favorite.email
          )}`,
          {
            method: "DELETE",
          }
        );
      } catch (error) {
        console.error("Erreur lors de la suppression de l'alerte mail:", error);
      }
    }

    // Supprimer du localStorage
    const updatedFavorites = favorites.filter((fav) => fav.eventId !== eventId);
    saveFavorites(updatedFavorites);
  };

  // Vérifier si un événement est en favori
  const isFavorite = (eventId: string) => {
    return favorites.some((fav) => fav.eventId === eventId);
  };

  // Obtenir les favoris
  const getFavorites = () => {
    return favorites;
  };

  // Obtenir l'email d'un favori
  const getFavoriteEmail = (eventId: string) => {
    const favorite = favorites.find((fav) => fav.eventId === eventId);
    return favorite?.email || null;
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavorites,
    getFavoriteEmail,
  };
}
