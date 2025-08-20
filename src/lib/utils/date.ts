/**
 * Utilitaires pour le formatage des dates et heures
 */

export interface FormattedDateTime {
    date: string;
    time: string;
    fullDateTime: string;
}

/**
 * Formate une date pour l'affichage des événements
 * @param dateString - Date au format ISO string
 * @returns Objet avec date, heure et date complète formatées
 */
export const formatEventDateTime = (dateString: string): FormattedDateTime => {
    const date = new Date(dateString);
    
    return {
        date: date.toLocaleDateString('fr-FR', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
        }),
        time: date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        fullDateTime: date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
};

/**
 * Formate une date courte (ex: "25 déc 2024")
 * @param dateString - Date au format ISO string
 * @returns Date formatée courte
 */
export const formatShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

/**
 * Formate une heure (ex: "20:30")
 * @param dateString - Date au format ISO string
 * @returns Heure formatée
 */
export const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Vérifie si une date est dans le futur
 * @param dateString - Date au format ISO string
 * @returns true si la date est dans le futur
 */
export const isFutureDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
};

/**
 * Calcule la durée entre deux dates
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Durée formatée (ex: "2h 30min")
 */
export const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${minutes}min`;
    }
};

/**
 * Formate une date relative (ex: "dans 2 jours", "il y a 1 heure")
 * @param dateString - Date au format ISO string
 * @returns Date relative formatée
 */
export const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
        return `dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays < 0) {
        return `il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
        return `dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffHours < 0) {
        return `il y a ${Math.abs(diffHours)} heure${Math.abs(diffHours) > 1 ? 's' : ''}`;
    } else if (diffMinutes > 0) {
        return `dans ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else if (diffMinutes < 0) {
        return `il y a ${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) > 1 ? 's' : ''}`;
    } else {
        return 'maintenant';
    }
};
