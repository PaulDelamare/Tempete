"use client";

import { useState } from "react";
import { X, Mail, Star } from "lucide-react";

interface FavoritesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  onConfirm: (email: string) => void;
}

export function FavoritesPopup({
  isOpen,
  onClose,
  eventName,
  onConfirm,
}: FavoritesPopupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm(email);
      setEmail("");
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative bg-black/90 border border-blue-400/40 rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <h3 className="text-lg font-bold font-metal">
              Ajouter aux favoris
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-sm opacity-80 mb-2">
            Cet événement a été ajouté à vos favoris !
          </p>
          <p className="font-semibold text-blue-400 mb-2">{eventName}</p>
          <p className="text-sm opacity-80 mb-3">
            Pour recevoir une alerte 30 minutes avant cet événement, saisissez
            votre email :
          </p>
          <div className="bg-blue-600/10 border border-blue-400/20 rounded-md p-3 mb-3">
            <p className="text-xs text-blue-300">
              ⏰ L'alerte sera envoyée 30 minutes avant le début de l'événement
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Si vous annulez, vous ne recevrez aucune notification par email
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Votre email pour recevoir les notifications
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-white hover:border-gray-500 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md text-white transition-colors"
            >
              {isSubmitting ? "Envoi..." : "Activer les notifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
